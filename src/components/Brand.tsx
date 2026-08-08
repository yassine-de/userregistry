import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Scaller Startseite">
      <span className="brand-mark"><Sparkles aria-hidden="true" /></span>
      <span className="brand-copy">
        <strong>Scaller</strong>
        <small>Scale Beyond Borders</small>
      </span>
    </Link>
  );
}
