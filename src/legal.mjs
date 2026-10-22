// Impressum / Datenschutz (DE) and Imprint / Privacy (EN). Same wording and the same open fields as the
// Hair & Beauty pillar (2026-10-18); only the image credit names this page's example. `[fehlt]` marks
// stay until the launch fields in content/launch.json are set.
import { esc } from './render.mjs';

const LEGAL_CSP = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'";

const miss = (v, lang) => (v ? esc(v) : `<mark>[${lang === 'de' ? 'fehlt' : 'missing'}]</mark>`);

export function renderLegal({ kind, lang, launch, base, other, updated }) {
  const de = lang === 'de';
  const l = launch.legal;
  const head = (title, alt) => `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>${title} — Convenium</title>
  <meta http-equiv="Content-Security-Policy" content="${LEGAL_CSP}">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
  <link rel="alternate" hreflang="${de ? 'en' : 'de'}" href="${other}">
  <link rel="stylesheet" href="${base}assets/kit/fonts/fonts.css">
  <link rel="stylesheet" href="${base}styles.css">
</head>
<body class="legal-page">
  <header class="legal-header"><a class="legal-mark" href="${base}">Convenium</a><a href="${other}" hreflang="${de ? 'en' : 'de'}" lang="${de ? 'en' : 'de'}">${de ? 'EN' : 'DE'}</a></header>
  <main class="legal" id="inhalt">
    <p class="legal-draft">${de ? 'Entwurf – noch nicht veröffentlicht' : 'Draft – not yet published'}</p>`;
  const foot = `
    <p class="legal-updated">${de ? 'Stand' : 'Last updated'}: ${updated}</p>
    <p><a href="${base}">← ${de ? 'Zur Startseite' : 'Back to the start page'}</a></p>
  </main>
</body>
</html>
`;

  if (kind === 'imprint') {
    const rows = de ? [
      ['Medieninhaber und Diensteanbieter', `${miss(l.owner, lang)} · Convenium`],
      ['Unternehmensgegenstand', esc(l.business.de)],
      ['Anschrift', miss(l.address, lang)],
      ['E-Mail', `<a href="mailto:${esc(launch.email)}">${esc(launch.email)}</a>`],
      ['Telefon', `<a href="tel:${esc(launch.phone.replace(/\s/g, ''))}">${esc(launch.phone)}</a>`],
      ['Gewerbe', miss(l.gewerbe, lang)],
      ['Gewerbebehörde', miss(l.authority, lang)],
      ['Kammerzugehörigkeit', miss(l.chamber, lang)],
      ['Berufsrecht', 'Gewerbeordnung (GewO), abrufbar unter <a href="https://www.ris.bka.gv.at" rel="noopener noreferrer">www.ris.bka.gv.at</a>']
    ] : [
      ['Media owner and service provider', `${miss(l.owner, lang)} · Convenium`],
      ['Business purpose', esc(l.business.en)],
      ['Address', miss(l.address, lang)],
      ['Email', `<a href="mailto:${esc(launch.email)}">${esc(launch.email)}</a>`],
      ['Phone', `<a href="tel:${esc(launch.phone.replace(/\s/g, ''))}">${esc(launch.phone)}</a>`],
      ['Trade licence', miss(l.gewerbe, lang)],
      ['Trade authority', miss(l.authority, lang)],
      ['Chamber membership', miss(l.chamber, lang)],
      ['Professional regulations', 'Austrian Trade Regulation Act (GewO), available at <a href="https://www.ris.bka.gv.at" rel="noopener noreferrer">www.ris.bka.gv.at</a>']
    ];
    return head(de ? 'Impressum' : 'Legal notice') + `
    <h1>${de ? 'Impressum' : 'Legal notice'}</h1>
      <p class="legal-lead">${de ? 'Informationen gemäß § 5 E-Commerce-Gesetz, § 63 Gewerbeordnung und Offenlegung gemäß § 25 Mediengesetz.' : 'Information under § 5 Austrian E-Commerce Act, § 63 Trade Regulation Act and disclosure under § 25 Media Act.'}</p>
      <dl class="legal-list">
        ${rows.map(([dt, dd]) => `<dt>${dt}</dt><dd>${dd}</dd>`).join('\n        ')}
      </dl>
      <p>${de ? 'Grundlegende Richtung: Information über die Webdesign-Leistungen von Convenium.' : 'Editorial line: information about Convenium’s web design services.'}</p>
      <p>${de ? 'Bildnachweis: SAVRA ist eine Konzeptwebsite von Convenium, kein Kundenauftrag; die gezeigte Aufnahme ist ein Bildschirmfoto dieser Website.' : 'Image credits: SAVRA is a Convenium concept website, not a client commission; the capture shown is a screenshot of that website.'}</p>` + foot;
  }

  return head(de ? 'Datenschutz' : 'Privacy') + (de ? `
    <h1>Datenschutz</h1>
      <h2>Verantwortlicher</h2>
      <p>${miss(l.owner, lang)}, ${miss(l.address, lang)}, E-Mail: ${esc(launch.email)}.</p>
      <h2>Hosting und Server-Logs</h2>
      <p>Diese Website wird über GitHub Pages bereitgestellt (GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA). Beim Aufruf verarbeitet GitHub technisch notwendige Daten – IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browser- und Systemangaben –, um die Seite auszuliefern und vor Missbrauch zu schützen. Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren und stabilen Bereitstellung (Art. 6 Abs. 1 lit. f DSGVO). GitHub ist nach dem EU-US Data Privacy Framework zertifiziert; die Übermittlung in die USA stützt sich auf den Angemessenheitsbeschluss der Europäischen Kommission vom 10. Juli 2023. Wie lange GitHub diese Logs speichert, legt GitHub fest; wir selbst haben keinen Zugriff darauf.</p>
      <h2>Ihre Anfrage per E-Mail</h2>
      <p>Das Anfrageformular sendet nichts über diese Website. Es bereitet nur einen Text vor, den Sie kopieren können. Wenn Sie uns schreiben, verarbeiten wir Ihre Angaben, um die Anfrage zu beantworten und gegebenenfalls ein Angebot zu erstellen (Art. 6 Abs. 1 lit. b DSGVO). Wir löschen die Korrespondenz, wenn sie nicht mehr benötigt wird; kommt ein Auftrag zustande, bewahren wir sie für die gesetzlichen Fristen auf (in der Regel sieben Jahre, § 132 BAO).</p>
      <h2>Keine Cookies, kein Tracking</h2>
      <p>Diese Website setzt keine Cookies, speichert nichts im lokalen Speicher Ihres Browsers und verwendet keine Analyse- oder Werbedienste. Schriften, Bilder, Videos und Skripte werden vom selben Server geladen, es werden keine Drittanbieter eingebunden. Der Link zur Konzeptwebsite öffnet eine eigenständige Seite.</p>
      <h2>Ihre Rechte</h2>
      <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Wenden Sie sich dazu an die oben genannte E-Mail-Adresse. Sie können sich außerdem bei der Österreichischen Datenschutzbehörde beschweren: Barichgasse 40–42, 1030 Wien, www.dsb.gv.at.</p>` : `
    <h1>Privacy</h1>
      <h2>Controller</h2>
      <p>${miss(l.owner, lang)}, ${miss(l.address, lang)}, email: ${esc(launch.email)}.</p>
      <h2>Hosting and server logs</h2>
      <p>This website is served by GitHub Pages (GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA). When you visit, GitHub processes technically necessary data – IP address, date and time, the page requested, browser and system details – to deliver the page and protect it from abuse. The legal basis is our legitimate interest in secure and stable delivery (Art. 6(1)(f) GDPR). GitHub is certified under the EU-US Data Privacy Framework; transfers to the USA rely on the European Commission’s adequacy decision of 10 July 2023. How long GitHub keeps these logs is set by GitHub; we have no access to them ourselves.</p>
      <h2>Your inquiry by email</h2>
      <p>The inquiry form sends nothing through this website. It only prepares a text you can copy. When you write to us, we process your details to answer the inquiry and, where relevant, prepare a proposal (Art. 6(1)(b) GDPR). We delete the correspondence once it is no longer needed; if a contract follows, we keep it for the statutory period (usually seven years, § 132 Austrian Federal Fiscal Code).</p>
      <h2>No cookies, no tracking</h2>
      <p>This website sets no cookies, stores nothing in your browser’s local storage and uses no analytics or advertising services. Fonts, images, videos and scripts are loaded from the same server; no third parties are embedded. The link to the concept website opens a separate site.</p>
      <h2>Your rights</h2>
      <p>You have the right of access, rectification, erasure, restriction of processing, data portability and objection (Art. 15–21 GDPR). Contact us at the email address above. You may also lodge a complaint with the Austrian Data Protection Authority: Barichgasse 40–42, 1030 Vienna, www.dsb.gv.at.</p>`) + foot;
}
