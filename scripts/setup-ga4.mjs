#!/usr/bin/env node
/**
 * GA4 커스텀 디멘션 등록 스크립트
 *
 * 요구사항:
 *   1) GOOGLE_APPLICATION_CREDENTIALS 환경변수 = 서비스 계정 JSON 키 경로
 *   2) 해당 서비스 계정이 GA4 속성(G-4ZK5WV5CG2 소속)의 Editor 이상 권한 보유
 *   3) GCP 프로젝트에서 analyticsadmin.googleapis.com API 활성화
 *
 * 실행:
 *   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
 *   node scripts/setup-ga4.mjs
 */

import { google } from "googleapis";

const MEASUREMENT_ID = "G-4ZK5WV5CG2";

const DIMENSIONS = [
  {
    parameterName: "recommended_type",
    displayName: "추천 유형 번호",
    description: "사용자에게 추천된 지원 사업 유형 번호 (1 또는 2)",
    scope: "EVENT",
  },
  {
    parameterName: "recommended_type_name",
    displayName: "추천 유형명",
    description: "추천된 지원 사업 유형 이름",
    scope: "EVENT",
  },
];

async function main() {
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/analytics.edit"],
  });
  const admin = google.analyticsadmin({ version: "v1beta", auth });

  log(`1/3 Measurement ID(${MEASUREMENT_ID}) 연결 속성 검색 중...`);

  const accountsRes = await admin.accounts.list({});
  const accounts = accountsRes.data.accounts || [];
  if (accounts.length === 0) throw new Error("접근 가능한 GA4 계정이 없습니다. 서비스 계정 권한 확인 필요.");

  let propertyName = null;
  for (const account of accounts) {
    const propsRes = await admin.properties.list({ filter: `parent:${account.name}` });
    for (const prop of propsRes.data.properties || []) {
      const streamsRes = await admin.properties.dataStreams.list({ parent: prop.name });
      const match = (streamsRes.data.dataStreams || []).find(
        s => s.webStreamData?.measurementId === MEASUREMENT_ID,
      );
      if (match) {
        propertyName = prop.name;
        log(`  · 매칭 속성: ${prop.name} (${prop.displayName})`);
        log(`  · 데이터 스트림: ${match.name}`);
        break;
      }
    }
    if (propertyName) break;
  }
  if (!propertyName) throw new Error(`Measurement ID ${MEASUREMENT_ID}에 연결된 GA4 속성을 찾을 수 없습니다.`);

  log("2/3 기존 커스텀 디멘션 조회 중...");
  const existingRes = await admin.properties.customDimensions.list({ parent: propertyName });
  const existing = existingRes.data.customDimensions || [];
  const existingByParam = new Map(existing.map(d => [d.parameterName, d]));

  log("3/3 커스텀 디멘션 upsert 중...");
  for (const dim of DIMENSIONS) {
    const found = existingByParam.get(dim.parameterName);
    if (found) {
      log(`  · [SKIP] ${dim.parameterName} 이미 존재 (${found.name})`);
      continue;
    }
    try {
      const res = await admin.properties.customDimensions.create({
        parent: propertyName,
        requestBody: dim,
      });
      log(`  · [CREATED] ${dim.parameterName} → ${res.data.name}`);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err.message;
      if (/already exists/i.test(msg)) {
        log(`  · [EXISTS] ${dim.parameterName}`);
      } else {
        throw err;
      }
    }
  }

  log("\n✅ GA4 커스텀 디멘션 등록 완료.");
  log("   이벤트 수신 후 보고서 반영까지 24~48시간 소요될 수 있습니다. DebugView는 즉시 확인 가능합니다.");
}

function log(msg) {
  process.stdout.write(msg + "\n");
}

main().catch(err => {
  process.stderr.write(`\n❌ GA4 설정 실패: ${err.message}\n`);
  if (err.response?.data) {
    process.stderr.write(JSON.stringify(err.response.data, null, 2) + "\n");
  }
  process.exit(1);
});
