import type { ApplicationStatus } from "../lib/types";
import { useI18n } from "../contexts/i18n";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { t } = useI18n();
  return <span className={`status-badge status-${status}`}>{t(`status.${status}`)}</span>;
}
