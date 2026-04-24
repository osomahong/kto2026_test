#!/usr/bin/env node
/**
 * GTM Container 자동 구성 스크립트
 *
 * 요구사항:
 *   1) GOOGLE_APPLICATION_CREDENTIALS 환경변수 = 서비스 계정 JSON 키 경로
 *   2) 해당 서비스 계정이 GTM 컨테이너(GTM-P2PQ8KFM)의 Publish 권한 보유
 *   3) GCP 프로젝트에서 tagmanager.googleapis.com API 활성화
 *
 * 실행:
 *   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
 *   node scripts/setup-gtm.mjs
 */

import { google } from "googleapis";

const CONTAINER_PUBLIC_ID = "GTM-P2PQ8KFM";
const GA4_MEASUREMENT_ID = "G-4ZK5WV5CG2";
const EVENT_NAME = "type_recommended";

const VAR_TYPE = "dlv - recommended_type";
const VAR_TYPE_NAME = "dlv - recommended_type_name";
const TRIGGER_CE = "CE - type_recommended";
const TAG_GA4_CONFIG = "GA4 - Config";
const TAG_GA4_EVENT = "GA4 - type_recommended";

async function main() {
  const auth = new google.auth.GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/tagmanager.edit.containers",
      "https://www.googleapis.com/auth/tagmanager.edit.containerversions",
      "https://www.googleapis.com/auth/tagmanager.publish",
    ],
  });
  const tagmanager = google.tagmanager({ version: "v2", auth });

  log("1/6 계정·컨테이너·워크스페이스 조회 중...");
  const accountsRes = await tagmanager.accounts.list({});
  const accounts = accountsRes.data.account || [];
  if (accounts.length === 0) throw new Error("접근 가능한 GTM 계정이 없습니다. 서비스 계정 권한을 확인하세요.");

  let container = null;
  let accountPath = null;
  for (const acc of accounts) {
    const listRes = await tagmanager.accounts.containers.list({ parent: acc.path });
    const found = (listRes.data.container || []).find(c => c.publicId === CONTAINER_PUBLIC_ID);
    if (found) {
      container = found;
      accountPath = acc.path;
      break;
    }
  }
  if (!container) throw new Error(`컨테이너 ${CONTAINER_PUBLIC_ID}를 찾을 수 없습니다. 권한 부여 여부 확인 필요.`);

  log(`  · Account: ${accountPath}`);
  log(`  · Container: ${container.path} (${container.name})`);

  const wsRes = await tagmanager.accounts.containers.workspaces.list({ parent: container.path });
  const workspace = (wsRes.data.workspace || []).find(w => w.name === "Default Workspace") || (wsRes.data.workspace || [])[0];
  if (!workspace) throw new Error("워크스페이스가 없습니다.");
  log(`  · Workspace: ${workspace.path} (${workspace.name})`);

  log("2/6 Data Layer 변수 2개 upsert 중...");
  const varType = await upsertVariable(tagmanager, workspace.path, {
    name: VAR_TYPE,
    type: "v",
    parameter: [
      { type: "integer", key: "dataLayerVersion", value: "2" },
      { type: "boolean", key: "setDefaultValue", value: "false" },
      { type: "template", key: "name", value: "recommended_type" },
    ],
  });
  const varTypeName = await upsertVariable(tagmanager, workspace.path, {
    name: VAR_TYPE_NAME,
    type: "v",
    parameter: [
      { type: "integer", key: "dataLayerVersion", value: "2" },
      { type: "boolean", key: "setDefaultValue", value: "false" },
      { type: "template", key: "name", value: "recommended_type_name" },
    ],
  });
  log(`  · ${varType.name} (${varType.variableId})`);
  log(`  · ${varTypeName.name} (${varTypeName.variableId})`);

  log("3/6 Custom Event 트리거 upsert 중...");
  const trigger = await upsertTrigger(tagmanager, workspace.path, {
    name: TRIGGER_CE,
    type: "customEvent",
    customEventFilter: [
      {
        type: "equals",
        parameter: [
          { type: "template", key: "arg0", value: "{{_event}}" },
          { type: "template", key: "arg1", value: EVENT_NAME },
        ],
      },
    ],
  });
  log(`  · ${trigger.name} (${trigger.triggerId})`);

  log("4/6 All Pages 트리거 조회 중...");
  const triggersRes = await tagmanager.accounts.containers.workspaces.triggers.list({ parent: workspace.path });
  const allPagesTrigger = (triggersRes.data.trigger || []).find(
    t => t.name === "All Pages" || t.type === "pageview"
  );
  let allPagesTriggerId = allPagesTrigger?.triggerId;
  if (!allPagesTriggerId) {
    log("  · All Pages 트리거가 없어 생성 중...");
    const created = await tagmanager.accounts.containers.workspaces.triggers.create({
      parent: workspace.path,
      requestBody: { name: "All Pages", type: "pageview" },
    });
    allPagesTriggerId = created.data.triggerId;
  }
  log(`  · All Pages triggerId: ${allPagesTriggerId}`);

  log("5/6 태그 2개 upsert 중...");
  const tagConfig = await upsertTag(tagmanager, workspace.path, {
    name: TAG_GA4_CONFIG,
    type: "googtag",
    parameter: [
      { type: "template", key: "tagId", value: GA4_MEASUREMENT_ID },
    ],
    firingTriggerId: [allPagesTriggerId],
  });
  log(`  · ${tagConfig.name} (${tagConfig.tagId})`);

  const tagEvent = await upsertTag(tagmanager, workspace.path, {
    name: TAG_GA4_EVENT,
    type: "gaawe",
    parameter: [
      { type: "template", key: "eventName", value: EVENT_NAME },
      { type: "template", key: "measurementIdOverride", value: GA4_MEASUREMENT_ID },
      {
        type: "list",
        key: "eventParameters",
        list: [
          {
            type: "map",
            map: [
              { type: "template", key: "name", value: "recommended_type" },
              { type: "template", key: "value", value: `{{${VAR_TYPE}}}` },
            ],
          },
          {
            type: "map",
            map: [
              { type: "template", key: "name", value: "recommended_type_name" },
              { type: "template", key: "value", value: `{{${VAR_TYPE_NAME}}}` },
            ],
          },
        ],
      },
    ],
    firingTriggerId: [trigger.triggerId],
  });
  log(`  · ${tagEvent.name} (${tagEvent.tagId})`);

  log("6/6 버전 생성 및 게시 중...");
  const versionRes = await tagmanager.accounts.containers.workspaces.create_version({
    path: workspace.path,
    requestBody: {
      name: `Auto setup: ${EVENT_NAME}`,
      notes: "Automated GTM setup for type_recommended event",
    },
  });
  const version = versionRes.data.containerVersion;
  if (!version?.path) throw new Error(`버전 생성 실패: ${JSON.stringify(versionRes.data)}`);
  log(`  · Version created: ${version.path}`);

  const publishRes = await tagmanager.accounts.containers.versions.publish({ path: version.path });
  log(`  · Published version: ${publishRes.data.containerVersion?.containerVersionId}`);

  log("\n✅ GTM 자동 구성 완료.");
  log(`   Container: ${CONTAINER_PUBLIC_ID}`);
  log(`   Published Version: ${publishRes.data.containerVersion?.containerVersionId}`);
}

async function upsertVariable(tagmanager, workspacePath, body) {
  const listRes = await tagmanager.accounts.containers.workspaces.variables.list({ parent: workspacePath });
  const existing = (listRes.data.variable || []).find(v => v.name === body.name);
  if (existing) {
    const res = await tagmanager.accounts.containers.workspaces.variables.update({
      path: existing.path,
      requestBody: body,
    });
    return res.data;
  }
  const res = await tagmanager.accounts.containers.workspaces.variables.create({
    parent: workspacePath,
    requestBody: body,
  });
  return res.data;
}

async function upsertTrigger(tagmanager, workspacePath, body) {
  const listRes = await tagmanager.accounts.containers.workspaces.triggers.list({ parent: workspacePath });
  const existing = (listRes.data.trigger || []).find(t => t.name === body.name);
  if (existing) {
    const res = await tagmanager.accounts.containers.workspaces.triggers.update({
      path: existing.path,
      requestBody: body,
    });
    return res.data;
  }
  const res = await tagmanager.accounts.containers.workspaces.triggers.create({
    parent: workspacePath,
    requestBody: body,
  });
  return res.data;
}

async function upsertTag(tagmanager, workspacePath, body) {
  const listRes = await tagmanager.accounts.containers.workspaces.tags.list({ parent: workspacePath });
  const existing = (listRes.data.tag || []).find(t => t.name === body.name);
  if (existing) {
    const res = await tagmanager.accounts.containers.workspaces.tags.update({
      path: existing.path,
      requestBody: body,
    });
    return res.data;
  }
  const res = await tagmanager.accounts.containers.workspaces.tags.create({
    parent: workspacePath,
    requestBody: body,
  });
  return res.data;
}

function log(msg) {
  process.stdout.write(msg + "\n");
}

main().catch(err => {
  process.stderr.write(`\n❌ GTM 설정 실패: ${err.message}\n`);
  if (err.response?.data) {
    process.stderr.write(JSON.stringify(err.response.data, null, 2) + "\n");
  }
  process.exit(1);
});
