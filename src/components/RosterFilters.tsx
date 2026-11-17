import { Button } from "@base-ui/react/button";
import { Switch } from "@base-ui/react/switch";
import { Toggle } from "@base-ui/react/toggle";
import { catalog, tierColors, tierLabels, type StatusFilter } from "../roster";
import CovenantButton from "./CovenantButton";

const statusOptions = [
  { value: "all", label: "全部" },
  { value: "available", label: "可用" },
  { value: "banned", label: "已 Ban" },
] as const;

export default function RosterFilters({
  bans,
  tier,
  search,
  covenants,
  disableBannedKinds,
  status,
  counts,
  hasFilters,
  onStatusChange,
  onTierChange,
  onSearchChange,
  onClearFilters,
  onToggleBannedFilters,
  onToggleCovenant,
}: {
  bans: ReadonlySet<string>;
  tier: number;
  search: string;
  covenants: readonly string[];
  disableBannedKinds: readonly string[];
  status: StatusFilter;
  counts: Record<StatusFilter, number>;
  hasFilters: boolean;
  onStatusChange: (status: StatusFilter) => void;
  onTierChange: (tier: number) => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
  onToggleBannedFilters: (kind: string, enabled: boolean) => void;
  onToggleCovenant: (name: string) => void;
}) {
  return (
    <>
      <div
        className="flex gap-6 border-b border-line mobile:justify-between mobile:gap-1.5"
        role="group"
        aria-label="按干员状态筛选"
      >
        {statusOptions.map((option) => (
          <Toggle
            className="group relative flex min-h-[43px] items-center gap-2 border-0 bg-transparent px-0.5 pt-1.5 pb-3 text-[14px] text-muted hover:text-ink data-pressed:font-[650] data-pressed:text-accent data-pressed:after:absolute data-pressed:after:inset-x-0 data-pressed:after:-bottom-px data-pressed:after:h-0.5 data-pressed:after:bg-current data-pressed:after:content-[''] data-[status=banned]:data-pressed:text-danger mobile:min-h-11 mobile:gap-[5px] mobile:text-[13px] narrow:gap-[3px] narrow:text-[12px]"
            key={option.value}
            data-status={option.value}
            pressed={status === option.value}
            onPressedChange={() => onStatusChange(option.value)}
          >
            {option.label}
            <span className="min-w-[26px] rounded-[3px] bg-[#e8ebe2] px-1.5 text-[12px] tabular-nums group-data-pressed:bg-accent group-data-pressed:text-white group-data-[status=banned]:group-data-pressed:bg-danger mobile:min-w-[22px] mobile:px-[5px] mobile:text-[11px]">
              {counts[option.value]}
            </span>
          </Toggle>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-line py-4 mobile:gap-2.5 mobile:py-3">
        <div
          className="flex items-center gap-[5px] mobile:w-full mobile:gap-0.5"
          role="group"
          aria-label="按等级筛选"
        >
          <span className="mr-2 text-[12px] text-muted mobile:mr-1">
            等级
          </span>
          {[0, 1, 2, 3, 4, 5, 6].map((value) => (
            <Toggle
              className={`min-h-[34px] min-w-[35px] rounded-[3px] border-0 bg-black px-2.5 py-1 hover:bg-[#282828] data-pressed:font-semibold data-pressed:underline data-pressed:decoration-2 data-pressed:underline-offset-4 mobile:min-h-10 mobile:min-w-[33px] mobile:px-2 ${value === 0 ? "text-white" : tierColors[value - 1]}`}
              key={value}
              pressed={tier === value}
              onPressedChange={() => onTierChange(value)}
              aria-label={value === 0 ? "全部等级" : `${value} 阶`}
            >
              {value === 0 ? "全部" : tierLabels[value - 1]}
            </Toggle>
          ))}
        </div>
        <input
          className="h-9 w-60 min-w-0 rounded-sm border border-line bg-surface px-2.5 text-[13px] text-ink caret-accent placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent mobile:h-10 mobile:flex-1 mobile:text-base"
          type="search"
          aria-label="搜索干员名称、拼音或首字母"
          placeholder="搜索干员 / 拼音 / 首字母"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <Button
          className="inline-flex min-h-9 items-center justify-center gap-[7px] rounded-sm border border-line bg-surface px-2.5 py-[5px] text-[13px] whitespace-nowrap enabled:hover:border-danger enabled:hover:bg-danger-soft enabled:hover:text-danger disabled:bg-[#f7f8f5] mobile:border-0 mobile:px-1 mobile:text-[11px]"
          onClick={onClearFilters}
          disabled={!hasFilters}
        >
          <svg
            className="size-4 mobile:size-3.5"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path d="M4 7a6 6 0 1 1-.4 5M4 3v4h4" />
          </svg>
          重置筛选
        </Button>
        <div className="w-full" role="group" aria-label="按盟约筛选">
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
            <span>禁用已 Ban：</span>
            {[
              { kind: "primary", label: "核心盟约" },
              { kind: "secondary", label: "附加盟约" },
            ].map((group) => (
              <Switch.Root
                key={group.kind}
                className="group inline-flex min-h-11 items-center gap-1.5 border-0 bg-transparent py-1 text-[12px] text-ink hover:text-accent"
                render={<button type="button" />}
                nativeButton
                aria-label={`禁用已 Ban 的${group.label}筛选按钮`}
                checked={disableBannedKinds.includes(group.kind)}
                onCheckedChange={(checked) =>
                  onToggleBannedFilters(group.kind, checked)
                }
              >
                <span
                  className="h-4 w-7 shrink-0 rounded-2xl border border-[#85957a] bg-line group-data-checked:border-accent group-data-checked:bg-accent"
                  aria-hidden="true"
                >
                  <Switch.Thumb className="m-px block size-3 rounded-full bg-surface data-checked:translate-x-3" />
                </span>
                {group.label}
              </Switch.Root>
            ))}
          </div>
          {[
            { kind: "primary", label: "核心盟约" },
            { kind: "secondary", label: "附加盟约" },
          ].map((group) => (
            <div
              className="mb-4 grid grid-cols-[max-content_1fr] items-center gap-3 tablet:gap-2 mobile:block"
              role="group"
              aria-label={`${group.label}筛选`}
              key={group.kind}
            >
              <div className="mobile:pb-2">
                <h3 className="text-[20px] font-[650]">{group.label}</h3>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-1">
                {catalog.covenants
                  .filter((item) => item.kind === group.kind)
                  .sort((a, b) =>
                    disableBannedKinds.includes(group.kind)
                      ? Number(bans.has(a.name)) - Number(bans.has(b.name))
                      : 0,
                  )
                  .map((item) => (
                    <CovenantButton
                      key={item.name}
                      covenant={item}
                      variant="filter"
                      disabled={
                        disableBannedKinds.includes(group.kind) &&
                        bans.has(item.name)
                      }
                      pressed={covenants.includes(item.name)}
                      onPressedChange={() => onToggleCovenant(item.name)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
