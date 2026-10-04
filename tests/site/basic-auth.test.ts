import assert from "node:assert/strict";
import { test } from "node:test";

import { checkAuditAccess, isValidBasicAuth } from "../../src/lib/basic-auth";

const header = (creds: string) => "Basic " + Buffer.from(creds, "utf8").toString("base64");

test("accepts ASCII credentials", () => {
  assert.equal(isValidBasicAuth(header("dan:secret"), "dan", "secret"), true);
});

test("accepts non-ASCII credentials encoded as UTF-8", () => {
  assert.equal(isValidBasicAuth(header("dán:pässwörd€"), "dán", "pässwörd€"), true);
});

test("rejects wrong password, missing header and non-Basic scheme", () => {
  assert.equal(isValidBasicAuth(header("dan:wrong"), "dan", "secret"), false);
  assert.equal(isValidBasicAuth("", "dan", "secret"), false);
  assert.equal(isValidBasicAuth("Bearer abc", "dan", "secret"), false);
});

test("rejects malformed base64 and invalid UTF-8 without throwing", () => {
  assert.equal(isValidBasicAuth("Basic !!!not-base64", "dan", "secret"), false);
  assert.equal(isValidBasicAuth("Basic /w==", "dan", "secret"), false);
});

test("checkAuditAccess fails closed when either credential is unset", () => {
  const ok = header("dan:secret");
  assert.equal(checkAuditAccess(undefined, undefined, ok), "unconfigured");
  assert.equal(checkAuditAccess("dan", undefined, ok), "unconfigured");
  assert.equal(checkAuditAccess(undefined, "secret", ok), "unconfigured");
  assert.equal(checkAuditAccess("", "secret", ""), "unconfigured");
  assert.equal(checkAuditAccess("dan", "", ok), "unconfigured");
});

test("checkAuditAccess allows valid credentials and denies the rest", () => {
  assert.equal(checkAuditAccess("dan", "secret", header("dan:secret")), "allowed");
  assert.equal(checkAuditAccess("dan", "secret", header("dan:nope")), "denied");
  assert.equal(checkAuditAccess("dan", "secret", ""), "denied");
});
