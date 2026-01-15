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
      const count = objects.length;

      if (count === 0) return;

      if (count > 30) {
        const confirmed = window.confirm(
          `You are about to download ${count} files.\n\nThis may take some time and put load on the server.\n\nDo you want to continue?`
        );
        if (!confirmed) return;
      }

      setBusy?.(true);
      try {
        const delay = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        for (const object of objects) {
          try {
            const res = await fetch(object.href!);
            const blob = await res.blob();

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            const originalName = object.href!.split("/").pop() ?? "download";
            a.download = `${recordId}-${originalName}`;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url);
            await delay(300);
          } catch (e) {
            console.error("Download failed", e);
            window.open(object.href!, "_blank");
          }
        }
      } finally {
        setBusy?.(false);
      }
    },
    [recordId, setBusy]
  );

  return { download };
}
