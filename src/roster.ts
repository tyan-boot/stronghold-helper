import catalog from './data/stronghold.json' with { type: 'json' }

export { catalog }
export type Operator = (typeof catalog.operators)[number]
export type Availability = 'available' | 'banned'
export type StatusFilter = Availability | 'all'

export const tierLabels = ['I', 'II', 'III', 'IV', 'V', 'VI']
export const rulesSource = 'https://prts.wiki/w/卫戍协议·规程/战场一览#入门协议关卡内剧情'

const primaryCovenants = new Set(
  catalog.covenants.filter((covenant) => covenant.kind === 'primary').map((covenant) => covenant.name),
)

export function getAvailability(operator: Operator, bans: ReadonlySet<string>): {
  status: Availability
  reason: string
} {
  const primary = operator.covenants.filter((name) => primaryCovenants.has(name))
  const secondary = operator.covenants.filter((name) => !primaryCovenants.has(name))
  const bannedPrimary = primary.filter((name) => bans.has(name))
  const allSecondaryBanned = secondary.length > 0 && secondary.every((name) => bans.has(name))

  if (primary.length > 0) {
    if (bannedPrimary.length === primary.length) {
      return { status: 'banned', reason: '核心盟约全部禁用' }
    }

    return { status: 'available', reason: '仍有可用核心盟约' }
  }

  return allSecondaryBanned
    ? { status: 'banned', reason: '附加盟约全部禁用' }
    : { status: 'available', reason: '仍有可用附加盟约' }
}

export function filterRoster(
  bans: ReadonlySet<string>,
  filters: { tier: number; covenants: readonly string[]; status: StatusFilter },
) {
  return catalog.operators
    .map((operator) => ({ ...operator, ...getAvailability(operator, bans) }))
    .filter((operator) =>
      (filters.tier === 0 || operator.tier === filters.tier)
      && filters.covenants.every((name) => operator.covenants.includes(name))
      && (filters.status === 'all' || operator.status === filters.status),
    )
    .sort((a, b) => Number(a.status === 'banned') - Number(b.status === 'banned'))
}
