import { useState } from "react";
import { Button } from "@base-ui/react/button";
import { Switch } from "@base-ui/react/switch";
import { Toggle } from "@base-ui/react/toggle";
import BanImportDialog from "./BanImportDialog";
import CovenantButton from "./CovenantButton";
import OperatorCard from "./OperatorCard";
import {
  catalog,
  filterRoster,
  rulesSource,
  tierColors,
  tierLabels,
  type StatusFilter,
} from "./roster";

const statusOptions = [
  { value: "all", label: "全部" },
  { value: "available", label: "可用" },
  { value: "banned", label: "已 Ban" },
] as const;

function App() {
  const [bans, setBans] = useState<Set<string>>(() => new Set());
  const [tier, setTier] = useState(0);
  const [search, setSearch] = useState("");
  const [covenants, setCovenants] = useState<string[]>([]);
  const [disableBannedKinds, setDisableBannedKinds] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusFilter>("all");

  const roster = filterRoster(bans, { tier, covenants, search, status: "all" });
  const visibleOperators = roster.filter(
    (operator) => status === "all" || operator.status === status,
  );
  const counts = {
    all: roster.length,
    available: roster.filter((operator) => operator.status === "available")
      .length,
    banned: roster.filter((operator) => operator.status === "banned").length,
  };
  const hasFilters =
    tier !== 0 ||
    search !== "" ||
    covenants.length > 0 ||
    disableBannedKinds.length > 0 ||
    status !== "all";
  const showBannedGroups =
    status === "banned" && tier === 0 && search.trim() === "" && covenants.length === 0;

  function toggleBan(name: string, kind: string) {
    if (!bans.has(name) && disableBannedKinds.includes(kind)) {
      setCovenants((current) => current.filter((item) => item !== name));
    }

    setBans((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function toggleBannedFilters(kind: string, enabled: boolean) {
    setDisableBannedKinds((current) =>
      enabled ? [...current, kind] : current.filter((item) => item !== kind),
    );

    if (enabled) {
      const bannedNames = catalog.covenants
        .filter((item) => item.kind === kind && bans.has(item.name))
        .map((item) => item.name);
      setCovenants((current) =>
        current.filter((name) => !bannedNames.includes(name)),
      );
    }
  }

  function clearFilters() {
    setTier(0);
    setSearch("");
    setCovenants([]);
    setDisableBannedKinds([]);
    setStatus("all");
  }

  return (
    <>
      <a
        className="absolute -top-20 left-4 z-10 bg-surface px-4.5 py-2.5 focus:top-3"
        href="#operators"
      >
        跳转到干员列表
      </a>
      <header className="flex min-h-20 items-center justify-between gap-6 border-b border-[#cbd3c2] bg-[#e9ede2] px-[max(32px,calc((100%_-_1344px)/2))] py-5 tablet:px-6 mobile:min-h-[68px] mobile:gap-3 mobile:p-4">
        <div className="flex items-center gap-3.5 mobile:gap-[9px]">
          <svg
            className="size-7 text-accent mobile:size-[23px]"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="10" height="10" rx="1" />
            <rect x="19" y="3" width="10" height="10" rx="1" />
            <rect x="3" y="19" width="10" height="10" rx="1" />
            <path d="M19 24h10m-5-5v10" />
          </svg>
          <h1 className="text-[22px] font-bold tracking-[-.02em] mobile:text-[18px]">
            卫戍协议助手
          </h1>
          <span className="ml-1.5 border-l border-[#b9c4af] pl-5 text-[13px] text-[#58644e] tablet:hidden">
            规程 · 干员图录
          </span>
        </div>
        <a
          className="inline-flex items-center gap-2 text-[13px] no-underline mobile:gap-[3px] mobile:text-[11px] narrow:text-[10px]"
          href={catalog.source}
          target="_blank"
          rel="noreferrer"
        >
          PRTS 数据来源
          <svg
            className="size-4 mobile:size-3.5"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path d="M5 15 15 5M5 5h10v10" />
          </svg>
        </a>
      </header>

      <main className="mx-auto max-w-[1408px] px-8 pt-[30px] pb-12 tablet:p-6 mobile:px-3.5 mobile:pt-4.5 mobile:pb-8">
        <section
          className="rounded-md border border-line bg-surface px-[26px] pt-6 tablet:px-5 tablet:pt-5 mobile:px-3.5 mobile:pt-4"
          aria-labelledby="ban-title"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 mobile:mb-4.5">
            <div className="flex flex-wrap items-center gap-3">
              <h2
                className="text-[20px] font-[650] mobile:text-[18px]"
                id="ban-title"
              >
                设置 Ban 位
              </h2>
              <BanImportDialog
                onImport={(names) => {
                  const next = new Set(names);
                  setBans(next);
                  setCovenants((current) =>
                    current.filter((name) => {
                      const covenant = catalog.covenants.find(
                        (item) => item.name === name,
                      );
                      return (
                        !covenant ||
                        !disableBannedKinds.includes(covenant.kind) ||
                        !next.has(name)
                      );
                    }),
                  );
                }}
              />
            </div>
            <Button
              className="inline-flex min-h-9 items-center justify-center gap-[7px] rounded-sm border border-line bg-surface px-2.5 py-[5px] text-[13px] whitespace-nowrap enabled:hover:border-danger enabled:hover:bg-danger-soft enabled:hover:text-danger disabled:bg-[#f7f8f5] mobile:border-0 mobile:px-1 mobile:text-[11px]"
              onClick={() => setBans(new Set())}
              disabled={bans.size === 0}
            >
              <svg
                className="size-4 mobile:size-3.5"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path d="M4 7a6 6 0 1 1-.4 5M4 3v4h4" />
              </svg>
              清空 Ban
            </Button>
          </div>

          {[
            { kind: "primary", label: "核心盟约" },
            { kind: "secondary", label: "附加盟约" },
          ].map((group) => (
            <div
              className="mb-4 grid grid-cols-[max-content_1fr] items-center gap-3 tablet:gap-2 mobile:block"
              role="group"
              aria-label={`${group.label} Ban 设置`}
              key={group.kind}
            >
              <div className="mobile:pb-2">
                <h3 className="text-[20px] font-[650]">{group.label}</h3>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-1">
                {catalog.covenants
                  .filter((item) => item.kind === group.kind)
                  .map((item) => (
                    <CovenantButton
                      key={item.name}
                      covenant={item}
                      variant="ban"
                      pressed={bans.has(item.name)}
                      onPressedChange={() => toggleBan(item.name, item.kind)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </section>

        <section
          className="mt-8 scroll-mt-5 mobile:mt-[26px]"
          id="operators"
          aria-labelledby="roster-title"
          tabIndex={-1}
        >
          <div className="mb-[15px] flex items-center justify-between gap-3 mobile:mb-2.5 mobile:flex-col mobile:items-start mobile:gap-1">
            <div className="flex items-baseline gap-3">
              <h2
                className="text-[20px] font-[650] mobile:text-[18px]"
                id="roster-title"
              >
                干员一览
              </h2>
              <span className="text-[12px] text-muted mobile:text-[11px]">
                {catalog.operators.length} 名干员
              </span>
            </div>
          </div>

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
                onPressedChange={() => setStatus(option.value)}
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
                  onPressedChange={() => setTier(value)}
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
              onChange={(event) => setSearch(event.target.value)}
            />
            <Button
              className="inline-flex min-h-9 items-center justify-center gap-[7px] rounded-sm border border-line bg-surface px-2.5 py-[5px] text-[13px] whitespace-nowrap enabled:hover:border-danger enabled:hover:bg-danger-soft enabled:hover:text-danger disabled:bg-[#f7f8f5] mobile:border-0 mobile:px-1 mobile:text-[11px]"
              onClick={clearFilters}
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
                      toggleBannedFilters(group.kind, checked)
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
                          onPressedChange={() =>
                            setCovenants((current) =>
                              current.includes(item.name)
                                ? current.filter((name) => name !== item.name)
                                : [...current, item.name],
                            )
                          }
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-3 text-muted mobile:py-3" />

          {visibleOperators.length > 0 && showBannedGroups ? (
            <div className="divide-y divide-line">
              {catalog.covenants.filter((covenant) => bans.has(covenant.name)).map((covenant) => {
                const operators = visibleOperators
                  .filter((operator) => operator.covenants.includes(covenant.name))
                  .sort((a, b) => b.tier - a.tier);
                if (operators.length === 0) return null;

                return (
                  <section
                    key={covenant.name}
                    aria-label={`${covenant.name}已 Ban 干员`}
                    className="grid grid-cols-[96px_minmax(0,1fr)] items-start gap-6 py-6 first:pt-0 last:pb-0 mobile:grid-cols-[56px_minmax(0,1fr)] mobile:gap-3 mobile:py-4"
                  >
                    <h3 className="flex flex-col items-center gap-2 pt-1 text-center text-[14px] text-muted mobile:text-[12px]">
                      <span className="flex size-14 items-center justify-center rounded-full border-2 border-[#4aebb5] opacity-65 grayscale [background:radial-gradient(#25be97,#212121_80%)] mobile:size-10">
                        <img className="size-4/5 object-contain" src={covenant.logo} alt="" width="40" height="40" />
                      </span>
                      {covenant.name}
                    </h3>
                    <ul className="grid grid-cols-8 gap-3 compact:grid-cols-6 tablet:grid-cols-4 mobile:grid-cols-3 mobile:gap-2">
                      {operators.map((operator) => (
                        <OperatorCard key={operator.name} operator={operator} bans={bans} compact dimBanned={false} />
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          ) : visibleOperators.length > 0 ? (
            <ul className="grid grid-cols-8 items-stretch gap-x-3 gap-y-3.5 compact:grid-cols-6 tablet:grid-cols-5 mobile:grid-cols-3 mobile:gap-x-2 mobile:gap-y-2.5">
              {visibleOperators.map((operator) => (
                <OperatorCard
                  key={operator.name}
                  operator={operator}
                  bans={bans}
                  dimBanned={status !== "banned"}
                />
              ))}
            </ul>
          ) : (
            <div className="border-b border-line px-5 pt-14 pb-16 text-center">
              <svg
                className="mb-3.5 size-[38px] text-[#7a8c6e]"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
              >
                <rect x="7" y="5" width="26" height="30" rx="3" />
                <path d="M13 14h14m-14 6h14m-14 6h7" />
              </svg>
              <h3 className="mb-2 text-[17px]">
                {status === "banned" && bans.size === 0
                  ? "还没有干员被 Ban"
                  : "没有符合条件的干员"}
              </h3>
              <p className="mb-5 text-[13px] text-muted">
                {status === "banned" && bans.size === 0
                  ? "在上方点选盟约，即可查看受影响的干员。"
                  : "试试其他关键词、等级、盟约或状态；重置筛选不会清除 Ban。"}
              </p>
              <Button
                className="rounded-sm border border-accent bg-accent px-4.5 py-2 text-white hover:bg-[#334c2a]"
                onClick={clearFilters}
              >
                查看全部干员
              </Button>
            </div>
          )}
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1344px] flex-wrap gap-5 border-t border-line pt-[22px] pb-8 text-[11px] text-muted compact:mx-8 tablet:mx-6 mobile:mx-3.5 mobile:gap-x-3 mobile:gap-y-[7px] mobile:pt-5 mobile:pb-7">
        <span className="font-semibold text-accent">卫戍协议 · 规程</span>

        <a
          className="ml-auto"
          href={rulesSource}
          target="_blank"
          rel="noreferrer"
        >
          规则来源
        </a>
      </footer>
    </>
  );
}

export default App;
