import { Button } from "@base-ui/react/button";
import { catalog, type Availability, type Operator, type StatusFilter } from "../roster";
import OperatorCard from "./OperatorCard";

export default function OperatorList({
  operators,
  bans,
  status,
  grouped,
  onClearFilters,
}: {
  operators: readonly (Operator & { status: Availability })[];
  bans: ReadonlySet<string>;
  status: StatusFilter;
  grouped: boolean;
  onClearFilters: () => void;
}) {
  return operators.length > 0 && grouped ? (
    <div className="divide-y divide-line">
      {catalog.covenants.filter((covenant) => bans.has(covenant.name)).map((covenant) => {
        const members = operators
          .filter((operator) => operator.covenants.includes(covenant.name))
          .sort((a, b) => b.tier - a.tier);
        if (members.length === 0) return null;

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
              {members.map((operator) => (
                <OperatorCard key={operator.name} operator={operator} bans={bans} compact dimBanned={false} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  ) : operators.length > 0 ? (
    <ul className="grid grid-cols-8 items-stretch gap-x-3 gap-y-3.5 compact:grid-cols-6 tablet:grid-cols-5 mobile:grid-cols-3 mobile:gap-x-2 mobile:gap-y-2.5">
      {operators.map((operator) => (
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
        onClick={onClearFilters}
      >
        查看全部干员
      </Button>
    </div>
  );
}
