import { tierLabels, type Availability, type Operator } from './roster'

const statusLabels = { available: '可用', banned: '已 Ban', uncertain: '待核实' }

export default function OperatorCard({ operator, bans }: {
  operator: Operator & { status: Availability; reason: string }
  bans: ReadonlySet<string>
}) {
  return (
    <li data-status={operator.status} className="group min-w-0 overflow-hidden rounded-sm border border-line bg-surface data-[status=banned]:border-[#dababe] data-[status=uncertain]:border-[#d7c69f]">
      <div className="relative aspect-[1.25] overflow-hidden border-b border-line bg-[#e7e9e3]">
        <img
          className="block size-full object-cover object-[center_35%] transition-[filter,opacity] duration-180 ease-[ease-out] group-data-[status=banned]:opacity-50 group-data-[status=banned]:grayscale motion-reduce:transition-none"
          src={operator.image} alt="" width="180" height="180" loading="lazy"
        />
        <span className="absolute top-1.5 left-1.5 min-w-6 rounded-xs bg-[#283126] px-[5px] py-px text-center text-[12px] text-white tabular-nums mobile:top-1 mobile:left-1 mobile:min-w-[21px] mobile:text-[11px]" aria-label={`${operator.tier} 阶`}>{tierLabels[operator.tier - 1]}</span>
        <span className="absolute right-[5px] bottom-[5px] rounded-xs bg-[#f2f6ed] px-1.5 py-px text-[11px] font-semibold text-[#405735] group-data-[status=banned]:bg-danger-soft group-data-[status=banned]:text-danger group-data-[status=uncertain]:bg-warning-soft group-data-[status=uncertain]:text-warning mobile:px-1 mobile:text-[10px]">{statusLabels[operator.status]}</span>
      </div>
      <div className="px-2.5 pt-[9px] pb-[11px] mobile:p-2">
        <h3 className="min-h-[22px] text-[14px] font-[650] wrap-anywhere mobile:min-h-[38px] mobile:text-[13px]">{operator.name}</h3>
        <ul className="flex min-h-9 flex-wrap content-start gap-x-1.5 gap-y-0.5 text-[11px] text-muted mobile:gap-x-[5px]" aria-label="所属盟约">
          {operator.covenants.map((name) => (
            <li key={name} className={`wrap-anywhere ${bans.has(name) ? 'text-danger line-through decoration-1' : ''}`}>
              {name}{bans.has(name) && <span className="sr-only">（已 Ban）</span>}
            </li>
          ))}
        </ul>
        <p className="mt-1 min-h-10 border-t border-line pt-1 text-[11px] leading-[1.5] wrap-anywhere text-muted group-data-[status=banned]:text-danger group-data-[status=uncertain]:text-warning">{operator.reason}</p>
      </div>
    </li>
  )
}
