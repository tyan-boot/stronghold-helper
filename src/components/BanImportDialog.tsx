import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Progress } from "@base-ui/react/progress";
import type { RecognitionProgress } from "../recognizeBans";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import { catalog } from "../roster";

registerPlugin(FilePondPluginFileValidateType);

export default function BanImportDialog({
  onImport,
}: {
  onImport: (names: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<RecognitionProgress | null>(null);
  const [error, setError] = useState("");
  const available = new Set(catalog.covenants.map((item) => item.name));

  async function recognize() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { recognizeBans } = await import("../recognizeBans");
      setResult(await recognizeBans(file, setProgress));
    } catch (cause) {
      console.error(cause);
      setError("识别失败，请检查图片和网络后重试。");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  function changeOpen(next: boolean) {
    if (loading && !next) return;
    setOpen(next);
    if (!next) {
      setFile(null);
      setResult(null);
      setError("");
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      <Dialog.Trigger className="inline-flex min-h-9 items-center gap-1.5 rounded-sm border border-line bg-surface px-2.5 text-[13px] font-medium hover:border-accent hover:text-accent mobile:min-h-8 mobile:text-[12px]">
        导入图片
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-30 bg-black/50" />
        <Dialog.Viewport className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto p-4">
          <Dialog.Popup className="max-h-full w-full max-w-xl overflow-y-auto rounded-md border border-line bg-surface p-6 mobile:p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-[20px] font-[650]">
                  导入 Ban 截图
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-[13px] text-muted">
                  选择截图后识别，确认结果将替换当前 Ban
                  位。图片仅在浏览器本地处理。
                </Dialog.Description>
              </div>
              <Dialog.Close
                disabled={loading}
                className="min-h-8 min-w-8 rounded-sm text-[20px] leading-none hover:bg-surface-soft"
                aria-label="关闭"
              >
                ×
              </Dialog.Close>
            </div>

            <div className="mt-5">
              <FilePond
                credits={false}
                allowMultiple={false}
                allowProcess={false}
                allowPaste
                disabled={loading}
                acceptedFileTypes={["image/*"]}
                labelIdle={
                  '拖拽图片到此处、<span class="filepond--label-action">选择图片</span>，或按 Ctrl+V 粘贴'
                }
                labelFileTypeNotAllowed="请选择图片文件"
                fileValidateTypeLabelExpectedTypes="支持常见图片格式"
                labelButtonRemoveItem="移除图片"
                onupdatefiles={(items) => {
                  setFile((items[0]?.file as File) ?? null);
                  setResult(null);
                  setError("");
                }}
              />
            </div>

            <p className="text-[12px] text-muted" role="status">
              {loading && (
                progress?.stage === "downloading" ? "正在下载模型…" :
                progress?.stage === "initializing" ? "模型已下载，正在初始化识别引擎…" :
                progress?.stage === "recognizing" ? "正在识别图片…" : "正在准备识别…"
              )}
            </p>
            {progress?.stage === "downloading" && (
              <Progress.Root
                value={progress.total ? Math.min(100, progress.loaded / progress.total * 100) : null}
                className="mt-2"
              >
                <div className="mb-1.5 flex justify-between gap-3 text-[12px] text-muted tabular-nums">
                  <Progress.Label>模型下载进度</Progress.Label>
                  <span>
                    {progress.total && `${Math.min(100, Math.floor(progress.loaded / progress.total * 100))}% · `}
                    {(progress.loaded / 1024 / 1024).toFixed(1)} MiB
                    {progress.total ? ` / ${(progress.total / 1024 / 1024).toFixed(1)} MiB` : " 已接收"}
                  </span>
                </div>
                <Progress.Track className="h-1.5 overflow-hidden rounded-sm bg-surface-soft">
                  <Progress.Indicator className="h-full bg-accent data-indeterminate:w-1/3 data-indeterminate:animate-pulse motion-reduce:animate-none" />
                </Progress.Track>
              </Progress.Root>
            )}
            {error && (
              <p role="alert" className="mt-3 text-danger">
                {error}
              </p>
            )}

            {result && (
              <div
                className="mt-5 border-t border-line pt-4"
                aria-live="polite"
              >
                <h3 className="text-[14px] font-[650]">识别结果</h3>
                {[
                  { kind: "primary", label: "核心盟约" },
                  { kind: "secondary", label: "附加盟约" },
                ].map((group) => {
                  const covenants = catalog.covenants.filter(
                    (item) => item.kind === group.kind && result.includes(item.name),
                  );
                  return (
                    <div key={group.kind} className="mt-2 grid grid-cols-[max-content_1fr] items-center gap-3">
                      <h4 className="text-[20px] font-[650]">{group.label}</h4>
                      {covenants.length ? (
                        <ul className="flex flex-wrap gap-2">
                          {covenants.map((covenant) => (
                            <li key={covenant.name} className="relative flex min-w-[52px] flex-col items-center gap-0.5 text-[12px] font-medium text-danger">
                              <span className="inline-block box-content size-9 rounded-[50px] border-2 border-[#4aebb5] text-center text-[10px] leading-8 opacity-65 grayscale [font-family:sans-serif] [background:radial-gradient(#25be97,#212121_80%)]">
                                <img className="inline h-4/5 w-4/5 align-middle" src={covenant.logo} alt="" width="40" height="40" />
                              </span>
                              <span className="line-through decoration-1">{covenant.name}</span>
                              <svg className="absolute top-[3px] right-[calc(50%-22px)] size-3.5 rounded-full bg-danger-soft" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <circle cx="8" cy="8" r="5.5" />
                                <path d="m4 4 8 8" />
                              </svg>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[12px] text-muted">未识别到</p>
                      )}
                    </div>
                  );
                })}
                {result.some((name) => !available.has(name)) && (
                  <p className="mt-2 text-[12px] text-danger">
                    {result.filter((name) => !available.has(name)).join("、")}
                    不在当前盟约目录中，无法导入。
                  </p>
                )}
                <p className="mt-2 text-[12px] text-muted">
                  请核对截图，未识别到的盟约不会被设置为 Ban。
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2 border-t border-line pt-4">
              <Dialog.Close
                disabled={loading}
                className="min-h-9 rounded-sm border border-line px-4 hover:bg-surface-soft"
              >
                取消
              </Dialog.Close>
              <button
                type="button"
                disabled={!file || loading}
                onClick={() => {
                  if (result) {
                    onImport(result.filter((name) => available.has(name)));
                    changeOpen(false);
                  } else {
                    void recognize();
                  }
                }}
                className="min-h-9 rounded-sm bg-accent px-4 text-white enabled:hover:bg-[#354a2e] disabled:bg-[#e4e7e1]"
              >
                {loading ? "识别中…" : result ? "导入" : "识别"}
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
