# Scaller Seller Registration

Eigenständige Seller-Registrierung für **Scaller / COD Manager Pakistan**. Das Projekt hat keine Laufzeitabhängigkeit zur bestehenden COD-Manager-App und ist für eine **separate Supabase-Datenbank** sowie ein eigenes **Netlify-Deployment** unter `register.scaller.ma` vorbereitet.

## Enthalten

- Öffentliche Scaller-Landingpage mit übernommenem Dark/Blue-Branding
- Registrierung und Login über Supabase Auth
- zwingende E-Mail-Verifizierung vor Zugriff auf das Seller-Formular
- Auth-Callback unter `/auth/callback`
- Seite zum erneuten Senden der Bestätigungs-E-Mail
- Seller-Formular mit Entwurfsfunktion und Statusanzeige
- serverseitig abgesicherte Einreichung über eine Supabase-RPC
- SQL-Migration mit RLS, Indizes, Status-Historie und Admin-Vorbereitung
- SPA-Redirects und Build-Konfiguration für Netlify

Nicht enthalten sind Adresse, CNIC/ID, Bankdaten, Kontoinhaber oder IBAN/Kontonummer.

## Lokales Setup

Voraussetzungen: Node.js 20 oder neuer und ein neues, separates Supabase-Projekt.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Öffne anschließend `http://localhost:5173`.

## Environment Variables

| Variable | Umgebung | Zweck |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Browser/Netlify | URL des **neuen** Seller-Registry-Supabase-Projekts |
| `VITE_SUPABASE_ANON_KEY` | Browser/Netlify | Publishable/anon key des neuen Projekts |
| `SUPABASE_SERVICE_ROLE_KEY` | nur Server | Derzeit nicht benötigt; später ausschließlich in Netlify Functions oder Supabase Edge Functions verwenden |

`SUPABASE_SERVICE_ROLE_KEY` darf niemals mit `VITE_` beginnen, im Frontend importiert oder in Git eingecheckt werden.

## Supabase einrichten

1. Ein **neues Supabase-Projekt** ausschließlich für die Seller-Registrierung erstellen.
2. Im SQL Editor den Inhalt von [`supabase/migrations/202608080001_initial_seller_registry.sql`](supabase/migrations/202608080001_initial_seller_registry.sql) ausführen. Alternativ mit der Supabase CLI gegen das neue Projekt deployen.
3. Unter **Authentication → Providers → Email**:
   - Email Provider aktivieren.
   - **Confirm email** aktivieren. Ohne diese Option ist der vorgesehene Flow nicht vollständig.
4. Unter **Authentication → URL Configuration** eintragen:
   - Site URL: `https://register.scaller.ma`
   - Redirect URL: `https://register.scaller.ma/auth/callback`
   - zusätzliche lokale Redirect URL: `http://localhost:5173/auth/callback`
5. Optional die Supabase-E-Mail-Templates auf Scaller umbenennen und die SMTP-Konfiguration für den Produktivbetrieb hinterlegen.
6. Project URL und anon/publishable key in `.env.local` und später in Netlify setzen.

Wichtig: Die Migration darf nur gegen die neue Seller-Registry-Datenbank ausgeführt werden, nicht gegen die produktive COD-Manager-Datenbank.

## Registrierungsflow

1. Ein Seller erstellt unter `/signup` ein Konto.
2. Supabase sendet eine Bestätigungs-E-Mail. Die App zeigt: „Bitte bestätige deine E-Mail-Adresse.“
3. Bei Bedarf kann der Seller die E-Mail unter `/check-email` erneut anfordern.
4. Der Link führt zu `/auth/callback`. Dort wird die PKCE-Session hergestellt und die bestätigte E-Mail geprüft.
5. Erst danach darf die geschützte Route `/register` geöffnet werden.
6. Der Seller speichert Profil und Bewerbung zunächst als `draft`.
7. Die RPC `submit_seller_application` validiert serverseitig erneut:
   - angemeldeter Benutzer,
   - bestätigte E-Mail,
   - Eigentum an der Bewerbung,
   - vollständiges Pflichtprofil,
   - erlaubter Ausgangsstatus.
8. Die Einreichung wechselt auf `submitted` und erzeugt einen Eintrag in `application_status_history`.

Die Browserprüfung allein ist nicht die Sicherheitsgrenze: RLS und die Einreichungs-RPC erzwingen die Regeln auch bei direkten API-Aufrufen.

## Datenmodell und Statusworkflow

- `seller_profiles`: Kontaktdaten und Shop-/Produktinformationen, 1:1 mit `auth.users`
- `seller_applications`: Bewerbung, Status, Nachricht, spätere interne Admin-Notizen
- `application_status_history`: unveränderliche Historie der Statuswechsel

Statuswerte:

```text
draft → submitted → under_review → approved
                              ├── rejected
                              └── needs_more_info → submitted
```

Jede Tabelle hat RLS. Seller können ausschließlich die eigenen Datensätze lesen. Ein Seller kann nur Entwürfe bzw. Bewerbungen mit `needs_more_info` bearbeiten. Statuswechsel erfolgen über abgesicherte Datenbankfunktionen.

### Admin-Vorbereitung

Die Helper-Funktion `is_admin()` erwartet künftig in Supabase Auth:

```json
{
  "app_metadata": {
    "role": "admin"
  }
}
```

Diese Metadaten dürfen nur serverseitig gesetzt werden. Ein späteres Admin-UI kann Bewerbungen lesen und `admin_set_application_status(...)` verwenden. Die Funktion speichert Reviewer, Zeitstempel, interne Notizen und Status-Historie. Die spätere Erstellung eines Sellers im Hauptsystem muss über eine serverseitige Netlify Function oder Supabase Edge Function erfolgen; das Frontend erhält dafür niemals einen Service-Role-Key.

## Netlify Deployment

1. Dieses Repository als neues Netlify-Projekt verbinden.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` in den Netlify Environment Variables setzen.
5. Custom Domain `register.scaller.ma` hinzufügen.
6. Beim DNS-Provider den von Netlify angegebenen CNAME für `register` setzen.
7. Nach Aktivierung der Domain die Supabase Auth URLs nochmals prüfen.

`netlify.toml` und `public/_redirects` sorgen dafür, dass SPA-Routen wie `/auth/callback` und `/register` direkt aufrufbar sind.

## Qualitätschecks

```bash
npm run lint
npm run build
```

## Projektgrenzen

- Keine Verbindung zur bestehenden COD-Manager-Datenbank
- Keine importierten Komponenten oder Runtime-Abhängigkeiten aus dem Hauptsystem
- Nur ein freigegebenes Branding-Bild wurde als lokale Kopie übernommen
- Marke und Links wurden von „Scalers/scalers.ma“ auf **Scaller/scaller.ma** angepasst
- Keine Secrets im Repository
