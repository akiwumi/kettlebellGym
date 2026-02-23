import { METHODS } from "../data/exercises";

export function getMethodForDate(d = new Date()) {
  // deterministic daily rotation: KB -> BW -> Band -> repeat
  const order = [METHODS.kettlebell.key, METHODS.bodyweight.key, METHODS.band.key];

  // Use day count since epoch (local date) to rotate
  const local = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayIndex = Math.floor(local.getTime() / (1000 * 60 * 60 * 24));
  const key = order[dayIndex % order.length];
  return key;
}

export function formatDateLabel(d = new Date()) {
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}