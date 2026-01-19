// useDownloadObjects.ts
import { useCallback, useRef, useState } from "react";
import { loadSettings } from "../services/settings.service";

type DownloadItem = { href?: string };

export function useDownloadObjects(recordId: string) {
  const [progress, setProgress] = useState<number>(0);
  const [busy, setBusy] = useState(false);
  const cancelledRef = useRef(false);

  const download = useCallback(
    async (items: DownloadItem[]) => {
      const objects = items.filter((o) => o.href);
      if (objects.length === 0 || busy) return;

      setBusy(true);
      setProgress(0);
      cancelledRef.current = false;

      try {
        const settings = await loadSettings();
        const basePath = settings.downloadPath;

        for (let i = 0; i < objects.length; i++) {
          if (cancelledRef.current) break;

          const filename = `${recordId}-${objects[i].href!.split("/").pop()}`;

          // Track per-file progress and combine with total
          let fileProgress = 0;
          const cleanup = window.electronAPI.downloads.onProgress(
            (received, total) => {
              if (total > 0) {
                fileProgress = received / total;
                const totalProgress = (i + fileProgress) / objects.length;
                setProgress(totalProgress);
              }
            },
          );

          await window.electronAPI.downloads.start({
            url: objects[i].href!,
            filename,
            directory: basePath,
          });

          cleanup();
        }
      } catch (err) {
        console.error("Download failed:", err);
      } finally {
        setBusy(false);
        setProgress(0);
      }
    },
    [recordId, busy],
  );

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    window.electronAPI.downloads.cancel();
  }, []);

  return { download, cancel, progress, busy };
}
