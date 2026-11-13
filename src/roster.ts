import catalog from "./data/stronghold.json" with { type: "json" };

export { catalog };
export type Operator = (typeof catalog.operators)[number];
export type Availability = "available" | "banned";
export type StatusFilter = Availability | "all";

export const tierLabels = ["I", "II", "III", "IV", "V", "VI"];
export const tierColors = [
  "text-tier-1",
  "text-tier-2",
  "text-tier-3",
  "text-tier-4",
  "text-tier-5",
  "text-tier-6",
];
export const rulesSource =
  "https://prts.wiki/w/%E5%8D%AB%E6%88%8D%E5%8D%8F%E8%AE%AE%C2%B7%E8%A7%84%E7%A8%8B/PRTS%E7%9B%9F%E7%BA%A6%E8%AE%B0%E5%BD%95";

const primaryCovenants = new Set(
  catalog.covenants
    .filter((covenant) => covenant.kind === "primary")
    .map((covenant) => covenant.name),
);

export function getAvailability(
  operator: Operator,
  bans: ReadonlySet<string>,
): {
  status: Availability;
  reason: string;
} {
  const primary = operator.covenants.filter((name) =>
    primaryCovenants.has(name),
  );
  const secondary = operator.covenants.filter(
    (name) => !primaryCovenants.has(name),
  );
  const bannedPrimary = primary.filter((name) => bans.has(name));
  const allSecondaryBanned =
    secondary.length > 0 && secondary.every((name) => bans.has(name));

  if (primary.length > 0) {
    if (bannedPrimary.length === primary.length) {
      return { status: "banned", reason: "核心盟约全部禁用" };
    }

    return { status: "available", reason: "仍有可用核心盟约" };
  }

  return allSecondaryBanned
    ? { status: "banned", reason: "附加盟约全部禁用" }
    : { status: "available", reason: "仍有可用附加盟约" };
}

export function filterRoster(
  bans: ReadonlySet<string>,
  filters: { tier: number; covenants: readonly string[]; status: StatusFilter },
) {
  return catalog.operators
    .map((operator) => ({ ...operator, ...getAvailability(operator, bans) }))
    .filter(
      (operator) =>
        (filters.tier === 0 || operator.tier === filters.tier) &&
        filters.covenants.every((name) => operator.covenants.includes(name)) &&
        (filters.status === "all" || operator.status === filters.status),
    )
    .sort(
      (a, b) => Number(a.status === "banned") - Number(b.status === "banned"),
    );
}
