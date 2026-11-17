import { Dialog } from "@base-ui/react/dialog";
import type { ReactNode } from "react";
import traitsData from "../data/operator-traits.json";
import { tierLabels, type Operator } from "../roster";

const traitsByName = new Map(traitsData.operators.map((trait) => [trait.name, trait]));

export default function OperatorTraitsDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog.Root<Operator>>
      {({ payload: operator }) => {
        const trait = operator && traitsByName.get(operator.name);

        return (
          <>
            {children}
            {operator && trait && (
              <Dialog.Portal>
                <Dialog.Backdrop className="fixed inset-0 z-30 bg-black/50" />
                <Dialog.Viewport className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto p-4">
                  <Dialog.Popup className="max-h-full w-full max-w-2xl overflow-y-auto rounded-md border border-line bg-surface p-6 mobile:p-4">
                    <div className="flex items-start gap-3">
                      <img className="size-16 shrink-0 object-contain" src={operator.image} alt="" width="64" height="64" />
                      <div className="min-w-0 flex-1">
                        <Dialog.Title className="text-[20px] font-[650] wrap-anywhere mobile:text-[18px]">
                          {operator.name} · 特质
                        </Dialog.Title>
                        <Dialog.Description className="mt-1 text-[13px] text-muted">
                          {tierLabels[operator.tier - 1]} 阶 · {operator.profession} · {trait.type}
                        </Dialog.Description>
                      </div>
                      <Dialog.Close className="min-h-11 shrink-0 rounded-sm border border-line px-3 text-[13px] hover:border-accent hover:text-accent">
                        关闭
                      </Dialog.Close>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-6 border-t border-line pt-5 mobile:gap-5">
                      <section>
                        {trait.elite && <h3 className="mb-2 text-[14px] text-muted">普通特质</h3>}
                        <p className="text-[14px] leading-relaxed whitespace-pre-line">{trait.normal}</p>
                      </section>
                      {trait.elite && (
                        <section>
                          <h3 className="mb-2 text-[14px] text-accent">精锐特质</h3>
                          <p className="text-[14px] leading-relaxed whitespace-pre-line">{trait.elite}</p>
                        </section>
                      )}
                    </div>

                    <div className="mt-6 border-t border-line pt-3 text-[12px]">
                      <a href={traitsData.source} target="_blank" rel="noreferrer">在 PRTS 查看来源</a>
                    </div>
                  </Dialog.Popup>
                </Dialog.Viewport>
              </Dialog.Portal>
            )}
          </>
        );
      }}
    </Dialog.Root>
  );
}
