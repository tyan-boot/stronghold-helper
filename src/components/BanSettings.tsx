import { Button } from "@base-ui/react/button";
import { catalog } from "../roster";
import BanImportDialog from "./BanImportDialog";
import CovenantButton from "./CovenantButton";

export default function BanSettings({
  bans,
  onToggleBan,
  onClearBans,
  onImport,
}: {
  bans: ReadonlySet<string>;
  onToggleBan: (name: string, kind: string) => void;
  onClearBans: () => void;
  onImport: (names: string[]) => void;
}) {
  return (
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
          <BanImportDialog onImport={onImport} />
        </div>
        <Button
          className="inline-flex min-h-9 items-center justify-center gap-[7px] rounded-sm border border-line bg-surface px-2.5 py-[5px] text-[13px] whitespace-nowrap enabled:hover:border-danger enabled:hover:bg-danger-soft enabled:hover:text-danger disabled:bg-[#f7f8f5] mobile:border-0 mobile:px-1 mobile:text-[11px]"
          onClick={onClearBans}
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
                  onPressedChange={() => onToggleBan(item.name, item.kind)}
                />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
