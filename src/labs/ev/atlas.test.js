import { test } from "node:test";
import assert from "node:assert/strict";
import { children, childrenOf, getNode, glossary, lessons, nodes, searchNodes, sources, systems, vehicle } from "./atlas.js";

test("atlas has eight systems and the exact twenty planned child nodes", () => {
  assert.equal(systems.length, 8);
  assert.deepEqual(
    systems.map((system) => system.id),
    ["battery", "inverter", "motor", "gears", "charger", "dcdc", "thermal", "bms"],
  );
  assert.equal(children.length, 20);
  assert.equal(nodes.length, 28);
  assert.equal(new Set(nodes.map((node) => node.id)).size, 28);
});

test("every child has a real parent and every system has valid metadata", () => {
  for (const system of systems) {
    assert.equal(system.parentId, "vehicle");
    assert.equal(system.systemId, system.id);
    assert.ok(system.name && system.english);
    assert.match(system.color, /^#[0-9a-f]{6}$/i);
    assert.ok(system.sources.length > 0);
    assert.ok(system.basic.title && system.advanced.title);
  }
  for (const child of children) {
    assert.ok(systems.some((system) => system.id === child.parentId));
    assert.equal(child.systemId, child.parentId);
    assert.ok(child.name && child.english && child.aliases.length > 0);
    assert.ok(child.basic.description.length > 40);
    assert.ok(child.advanced.description.length > 40);
    assert.ok(["Temsili", "Referansa dayalı sadeleştirme"].includes(child.geometryStatus));
    assert.ok(["Belgelenmiş", "Hesaplanmış", "Varsayılmış"].includes(child.informationStatus));
  }
});

test("hierarchy helpers and Turkish/English search work", () => {
  assert.equal(getNode("battery-cells").parentId, "battery");
  assert.equal(childrenOf("battery").length, 6);
  assert.equal(childrenOf("motor").length, 4);
  assert.ok(searchNodes("rotor").some((node) => node.id === "motor-rotor"));
  assert.ok(searchNodes("hücre").some((node) => node.id === "battery-cells"));
  assert.ok(searchNodes("dc-dc").some((node) => node.id === "dcdc"));
  assert.equal(searchNodes("  ").length, nodes.length);
});

test("source records are resolvable and scope is explicit", () => {
  assert.equal(sources.length, 4);
  for (const source of sources) {
    assert.match(source.url, /^https:\/\//);
    assert.ok(source.title && source.scope.length > 30);
  }
  assert.equal(vehicle.year, 2018);
  assert.equal(vehicle.variant, "Long Range RWD");
  assert.match(vehicle.disclaimer, /OEM CAD|Tesla onayı/);
});

test("eight lessons have valid task targets and two explained questions", () => {
  assert.equal(lessons.length, 8);
  const allowedTaskTypes = new Set(["select", "run", "flow", "adjust"]);
  for (const lesson of lessons) {
    assert.ok(lesson.id && lesson.title && lesson.objective);
    assert.ok(getNode(lesson.targetId));
    assert.ok(allowedTaskTypes.has(lesson.task.type));
    assert.equal(lesson.task.targetId, lesson.targetId);
    for (const question of [lesson.question, lesson.advancedQuestion]) {
      assert.equal(question.options.length, 3);
      assert.ok(Number.isInteger(question.answer));
      assert.ok(question.explanation.length > 20);
    }
  }
});

test("glossary contains the first principles used by the lessons", () => {
  const terms = new Set(glossary.map((entry) => entry.term));
  for (const term of ["kWh", "kW", "Tork", "İnverter", "SOC", "BMS"]) assert.ok(terms.has(term));
});
