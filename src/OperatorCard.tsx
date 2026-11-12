import { tierLabels, type Availability, type Operator } from './roster'

const statusLabels = { available: '可用', banned: '已 Ban', uncertain: '待核实' }

export default function OperatorCard({ operator, bans }: {
  operator: Operator & { status: Availability; reason: string }
  bans: ReadonlySet<string>
}) {
  return (
    <li className={`operator-card is-${operator.status}`}>
      <div className="operator-portrait">
        <img src={operator.image} alt="" width="180" height="180" loading="lazy" />
        <span className="tier-badge" aria-label={`${operator.tier} 阶`}>{tierLabels[operator.tier - 1]}</span>
        <span className="operator-status">{statusLabels[operator.status]}</span>
      </div>
      <div className="operator-info">
        <h3>{operator.name}</h3>
        <ul className="operator-covenants" aria-label="所属盟约">
          {operator.covenants.map((name) => (
            <li key={name} className={bans.has(name) ? 'covenant-banned' : ''}>
              {name}{bans.has(name) && <span className="sr-only">（已 Ban）</span>}
            </li>
          ))}
        </ul>
        <p className="ban-reason">{operator.reason}</p>
      </div>
    </li>
  )
}
