// components/Loader.tsx
import styles from "./Loader.module.css";

type LoaderSize = "small" | "medium" | "large";

interface LoaderProps {
  size?: LoaderSize;
  fullscreen?: boolean;
}

export const Loader = ({
  size = "medium",
  fullscreen = false,
}: LoaderProps) => {
  const spinner = <div className={`${styles.spinner} ${styles[size]}`} />;

  if (fullscreen) {
    return <div className={styles.fullscreen}>{spinner}</div>;
  }

  return <div className={styles.container}>{spinner}</div>;
};
