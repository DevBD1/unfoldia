import { test } from "node:test";
import assert from "node:assert/strict";
import { parts, curriculum } from "./content.js";
test("eight distinct selectable systems have both learning levels", () => {
  assert.equal(parts.length, 8);
  assert.equal(new Set(parts.map((p) => p.id)).size, 8);
  for (const p of parts) {
    assert.match(p.color, /^#[0-9a-f]{6}$/i);
    for (const level of ["basic", "advanced"]) {
      assert.ok(p[level].title);
      assert.ok(p[level].description.length > 40);
      assert.equal(p[level].points.length, 3);
    }
  }
});
test("every level has a valid explained knowledge check", () => {
  for (const p of parts)
    for (const q of [p.question, p.advancedQuestion]) {
      assert.ok(q?.text);
      assert.equal(q.options.length, 3);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 3);
      assert.ok(q.explanation.length > 20);
    }
});
test("learning route references real systems and covers all eight", () => {
  assert.equal(curriculum.length, 4);
  const covered = new Set();
  for (const c of curriculum) {
    assert.ok(c.title);
    for (const id of c.partIds) {
      assert.ok(parts.some((p) => p.id === id));
      covered.add(id);
    }
  }
  assert.equal(covered.size, 8);
});
