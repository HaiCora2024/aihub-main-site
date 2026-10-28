import test from "node:test";
import assert from "node:assert/strict";
import { readCaseLanguage, caseListHref } from "../src/i18n/useCaseLanguage.ts";

test("case language accepts only implemented locales", () => {
  assert.equal(readCaseLanguage("?lang=ru"), "ru");
  for (const search of ["", "?lang=en", "?lang=pl", "?lang=bad"])
    assert.equal(readCaseLanguage(search), "en");
});

test("back links preserve locale and nested deployment base", () => {
  assert.equal(caseListHref("/", "?lang=ru"), "/?lang=ru#cases");
  assert.equal(caseListHref("/nested/", "?lang=en"), "/nested/?lang=en#cases");
});
