// Teaching cutaways: assembled mechanisms, without opaque covers or neighbours.
export const workingCovers = {
  battery: ["battery-lid", "battery-modules"],
  motor: ["motor-housing"],
  inverter: ["inverter-board"],
  gears: ["gears-case"],
};

export function workingPartVisible(id, systemId, active) {
  return !active || (systemId === active && !(workingCovers[active] || []).includes(id));
}
