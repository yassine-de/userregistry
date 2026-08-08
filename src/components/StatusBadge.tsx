import type { ApplicationStatus } from "../lib/types";

const labels: Record<ApplicationStatus, string> = {
  draft: "Entwurf",
  submitted: "Eingereicht",
  under_review: "In Prüfung",
  approved: "Genehmigt",
  rejected: "Abgelehnt",
  needs_more_info: "Weitere Angaben nötig",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`status-badge status-${status}`}>{labels[status]}</span>;
}
