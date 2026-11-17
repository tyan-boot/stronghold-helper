import { useEffect, useRef, useState } from "react";
import { Button } from "@base-ui/react/button";
import { useRegisterSW } from "virtual:pwa-register/react";

export default function PwaUpdatePrompt() {
  const registration = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const [error, setError] = useState("");
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, value) {
      registration.current = value;
    },
    onRegisterError(cause) {
      console.error("Service Worker 注册失败", cause);
    },
  });

  useEffect(() => {
    function checkForUpdate() {
      if (document.visibilityState === "visible" && navigator.onLine) {
        void registration.current?.update().catch((cause: unknown) => {
          console.error("检查网站更新失败", cause);
        });
      }
    }

    document.addEventListener("visibilitychange", checkForUpdate);
    return () => document.removeEventListener("visibilitychange", checkForUpdate);
  }, []);

  if (!needRefresh) return null;

  return (
    <aside
      aria-label="网站更新"
      className="fixed right-4 bottom-4 z-20 w-[calc(100%-2rem)] max-w-sm rounded-md border border-line bg-surface p-4"
    >
      <div role="status">
        <h2 className="text-[14px] font-[650]">发现新版本</h2>
        <p className="mt-1 text-[13px] text-muted">
          更新将刷新页面，当前 Ban 位和筛选会重置。
        </p>
      </div>
      {error && <p role="alert" className="mt-2 text-[13px] text-danger">{error}</p>}
      <div className="mt-3 flex justify-end gap-2">
        <Button
          className="min-h-9 rounded-sm border border-line px-3 hover:bg-surface-soft"
          onClick={() => {
            setError("");
            setNeedRefresh(false);
          }}
        >
          稍后
        </Button>
        <Button
          className="min-h-9 rounded-sm bg-accent px-3 text-white hover:bg-[#354a2e]"
          onClick={() => {
            setError("");
            void updateServiceWorker(true).catch(() => {
              setError("更新失败，请重试或关闭页面后重新打开。");
            });
          }}
        >
          立即更新
        </Button>
      </div>
    </aside>
  );
}
