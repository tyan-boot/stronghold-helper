import { useState } from "react";
import BanSettings from "./components/BanSettings";
import OperatorList from "./components/OperatorList";
import RosterFilters from "./components/RosterFilters";
import { catalog, filterRoster, rulesSource, type StatusFilter } from "./roster";

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
        <BanSettings
          bans={bans}
          onToggleBan={toggleBan}
          onClearBans={() => setBans(new Set())}
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

          <RosterFilters
            bans={bans}
            tier={tier}
            search={search}
            covenants={covenants}
            disableBannedKinds={disableBannedKinds}
            status={status}
            counts={counts}
            hasFilters={hasFilters}
            onStatusChange={setStatus}
            onTierChange={setTier}
            onSearchChange={setSearch}
            onClearFilters={clearFilters}
            onToggleBannedFilters={toggleBannedFilters}
            onToggleCovenant={(name) =>
              setCovenants((current) =>
                current.includes(name)
                  ? current.filter((item) => item !== name)
                  : [...current, name],
              )
            }
          />

          <div className="py-3 text-muted mobile:py-3" />

          <OperatorList
            operators={visibleOperators}
            bans={bans}
            status={status}
            grouped={showBannedGroups}
            onClearFilters={clearFilters}
          />
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
