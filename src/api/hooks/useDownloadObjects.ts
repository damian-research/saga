// useDownloadObjects.ts
import { useCallback } from "react";

type DownloadItem = {
  href?: string;
};

type Options = {
  recordId: string;
  setBusy?: (value: boolean) => void;
};

export function useDownloadObjects({ recordId, setBusy }: Options) {
  const download = useCallback(
    async (items: DownloadItem[]) => {
      const objects = items.filter((o) => o.href);
      if (objects.length === 0) return;

      setBusy?.(true);

      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      try {
        for (const object of objects) {
          try {
            const originalName = object.href!.split("/").pop() ?? "download";

            await window.electronAPI.downloads.downloadFile({
              url: object.href!,
              filename: `${recordId}-${originalName}`,
            });

            await delay(300);
          } catch (e) {
            console.warn("Download failed:", object.href, e);
          }
        }
      } finally {
        setBusy?.(false);
      }
    },
    [recordId, setBusy],
  );

  return { download };
}
