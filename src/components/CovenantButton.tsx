import { Toggle } from "@base-ui/react/toggle";
import type { catalog } from "../roster";

export default function CovenantButton({
  covenant,
  variant,
  pressed,
  disabled,
  onPressedChange,
}: {
  covenant: (typeof catalog.covenants)[number];
  variant: "ban" | "filter";
  pressed: boolean;
  disabled?: boolean;
  onPressedChange: () => void;
}) {
  const isBan = variant === "ban";

  return (
    <Toggle
      pressed={pressed}
      disabled={disabled}
      onPressedChange={onPressedChange}
      aria-label={`${covenant.name}，${
        isBan
          ? pressed
            ? "已 Ban，点击取消"
            : "点击 Ban"
          : pressed
            ? "已选，点击取消"
            : "点击筛选"
      }`}
      className={`group relative flex flex-col items-center gap-0.5 rounded-[3px] border-0 bg-transparent p-1 text-center text-[12px] font-medium whitespace-nowrap data-disabled:text-[#747c70] mobile:text-[11px] ${
        isBan
          ? "data-pressed:text-danger"
          : "data-pressed:bg-accent-soft data-pressed:text-accent"
      }`}
    >
      <span
        className={`inline-block box-content size-9 rounded-[50px] border-2 border-[#4aebb5] text-center text-[10px] leading-8 font-normal [font-family:sans-serif] [background:radial-gradient(#25be97,#212121_80%)] ${
          isBan
            ? "group-data-pressed:grayscale group-data-pressed:opacity-65"
            : "group-data-disabled:grayscale group-data-disabled:opacity-45"
        }`}
      >
        <img
          className="inline h-4/5 w-4/5 align-middle"
          src={covenant.logo}
          alt=""
          width="40"
          height="40"
        />
      </span>
      <span
        className={`group-hover:underline ${
          isBan
            ? "group-data-pressed:line-through group-data-pressed:decoration-1"
            : "group-data-disabled:line-through"
        }`}
      >
        {covenant.name}
      </span>
      <svg
        className={`absolute top-[3px] right-[calc(50%-22px)] hidden size-3.5 rounded-full group-data-pressed:block ${isBan ? "bg-danger-soft" : "bg-accent text-white"}`}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        {isBan ? (
          <>
            <circle cx="8" cy="8" r="5.5" />
            <path d="m4 4 8 8" />
          </>
        ) : (
          <path d="m4 8 3 3 5-6" />
        )}
      </svg>
    </Toggle>
  );
}
