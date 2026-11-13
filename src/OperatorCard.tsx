import { catalog, tierColors, tierLabels, type Availability, type Operator } from './roster'

const covenantLogos = new Map(catalog.covenants.map(({ name, logo }) => [name, logo]))

export default function OperatorCard({ operator, bans }: {
  operator: Operator & { status: Availability }
  bans: ReadonlySet<string>
}) {
  return (
    <li data-status={operator.status} className="group min-w-0 overflow-hidden rounded-sm border border-line bg-surface data-[status=banned]:border-[#dababe]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e9e3]">
        <img
          className="block size-full object-scale-down object-top transition-[filter,opacity] duration-180 ease-[ease-out] group-data-[status=banned]:opacity-50 group-data-[status=banned]:grayscale motion-reduce:transition-none"
          src={operator.image} alt="" width="180" height="180" loading="lazy"
        />
        <svg className={`absolute top-1.5 left-1.5 size-8 mobile:top-1 mobile:left-1 mobile:size-7 ${tierColors[operator.tier - 1]}`} viewBox="0 0 32 32" role="img" aria-label={`${operator.tier} 阶`}>
          <path d="M5 1H27L31 5V27L27 31H5L1 27V5Z" fill="black" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
          <path d="M5.5 2.5H26.5L29.5 5.5V26.5L26.5 29.5H5.5L2.5 26.5V5.5Z" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.35" />
          <text className="font-sans" x="16" y="23" textAnchor="middle" fill="currentColor" stroke="none" fontSize="21" fontWeight="700">{tierLabels[operator.tier - 1]}</text>
        </svg>
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-white via-white/90 via-65% to-transparent px-2 pt-6 pb-1 mobile:px-1.5">
          <ul className="flex flex-col gap-0.5 text-[12px] leading-[1.4] font-medium text-black mobile:text-[11px]" aria-label="所属盟约">
            {operator.covenants.map((name) => (
              <li key={name} className={`flex items-center gap-1 ${bans.has(name) ? 'text-danger line-through decoration-1' : ''}`}>
                <img className="size-5 shrink-0 object-contain brightness-0 mobile:size-[18px]" src={covenantLogos.get(name)} alt="" width="20" height="20" />
                <span>{name}{bans.has(name) && <span className="sr-only">（已 Ban）</span>}</span>
              </li>
            ))}
          </ul>
        </div>
        {operator.status === 'banned' && (
          <svg className="absolute top-0 right-0 size-11 text-[#ff8995] mobile:size-9" viewBox="0 0 44 44" fill="none" role="img" aria-label="已 Ban">
            <path d="M0 0H44V44Z" fill="#7d2733" fillOpacity="0.9" stroke="none" />
            <path d="m28 5 4 4-4 4-4-4Z M22 27V19a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3" strokeWidth="2.5" />
            <path d="m31 27 7 7m0-7-7 7" strokeWidth="3.5" />
          </svg>
        )}
      </div>
      <div className="flex min-h-12 items-center gap-1.5 bg-white px-1.5 py-1 mobile:min-h-11 mobile:gap-1 mobile:px-1">
        <img className="size-5 shrink-0 object-contain mobile:size-[18px]" src={`/images/professions/${operator.profession}.png`} alt={operator.profession} width="20" height="20" />
        <h3 className="min-w-0 text-[14px] leading-[1.3] font-[650] wrap-anywhere mobile:text-[12px]">{operator.name}</h3>
      </div>
    </li>
  )
}
