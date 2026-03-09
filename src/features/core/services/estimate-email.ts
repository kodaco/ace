import { AppFeature, EstimateResult } from "@/features/core/models";

// ─────────────────────────────────────────────────────────────────────────────
// Active strategy — change this to "api" once you have an email provider set up
// ─────────────────────────────────────────────────────────────────────────────
const ACTIVE_STRATEGY: "mailto" | "api" = "mailto";

// ─────────────────────────────────────────────────────────────────────────────
// Formatters
// ─────────────────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatWeeks(weeks: number): string {
  if (weeks >= 8) {
    return `${Math.ceil(weeks / 4.33)} months`;
  }
  return `${Math.ceil(weeks)} weeks`;
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML email page builder
// Opens in a new tab. Includes a copy-to-clipboard button and a mailto link
// so the user can paste the styled estimate into their email client.
// ─────────────────────────────────────────────────────────────────────────────

function buildHtmlPage(
  estimate: EstimateResult,
  selectedFeatures: AppFeature[],
  toEmail: string,
): string {
  const avgCost = Math.round((estimate.minCost + estimate.maxCost) / 2);
  const avgWeeks = (estimate.minWeeks + estimate.maxWeeks) / 2;
  const launchWeeks = avgWeeks + 4;

  const featureChips = selectedFeatures
    .map(
      (f) =>
        `<li style="background:rgba(99,102,241,0.09);color:#4338ca;font-size:0.8rem;font-weight:500;padding:3px 12px;border-radius:20px;list-style:none;">${f.name}</li>`,
    )
    .join("\n      ");

  const mailtoHref = toEmail
    ? `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent("App Cost Estimate")}`
    : `mailto:?subject=${encodeURIComponent("App Cost Estimate")}`;

  // Inline JS for the copy button — runs entirely in the opened tab
  const copyScript = `
    async function copyEstimate() {
      const el = document.getElementById('estimate-card');
      try {
        const html = el.outerHTML;
        await navigator.clipboard.write([
          new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }) })
        ]);
        const btn = document.getElementById('copy-btn');
        btn.textContent = '✓ Copied!';
        setTimeout(() => btn.textContent = 'Copy Estimate', 2000);
      } catch {
        // Fallback: select the content so user can manually copy
        const range = document.createRange();
        range.selectNode(el);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
    }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>App Cost Estimate</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      background: #f5f5f5;
      color: #111827;
      min-height: 100vh;
    }

    /* ── Action bar ── */
    .action-bar {
      position: sticky; top: 0; z-index: 10;
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
      padding: 12px 24px;
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.06);
    }
    .action-bar-left { font-size: 0.875rem; color: #6b7280; }
    .action-bar-right { display: flex; gap: 10px; }
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 18px; border-radius: 8px;
      font-size: 0.875rem; font-weight: 600; text-decoration: none; cursor: pointer;
      border: none; font-family: inherit;
    }
    .btn-primary { background: #6366f1; color: #fff; }
    .btn-primary:hover { background: #4f46e5; }
    .btn-outlined {
      background: transparent; color: #6366f1;
      border: 1.5px solid #6366f1;
    }
    .btn-outlined:hover { background: rgba(99,102,241,0.06); }

    /* ── Instructions ── */
    .instructions {
      max-width: 620px; margin: 20px auto 0; padding: 0 16px;
      font-size: 0.8rem; color: #9ca3af; text-align: center; line-height: 1.6;
    }

    /* ── Estimate card ── */
    .container { max-width: 620px; margin: 20px auto 48px; padding: 0 16px; }

    #estimate-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 28px;
    }

    .card-title {
      font-size: 1.35rem; font-weight: 700; color: #111827; margin-bottom: 4px;
    }
    .card-subtitle {
      font-size: 0.875rem; color: #6b7280; margin-bottom: 18px;
    }

    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 18px 0; }

    .mode-row { display: flex; justify-content: flex-end; margin-bottom: 18px; }
    .mode-badge {
      background: #6366f1; color: #fff;
      font-size: 0.75rem; font-weight: 700; letter-spacing: 0.02em;
      padding: 4px 14px; border-radius: 20px;
    }

    .field-label {
      font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.08em; color: #6b7280; margin-bottom: 4px;
    }
    .cost-value { font-size: 2rem; font-weight: 700; color: #111827; margin-bottom: 18px; }
    .time-value { font-size: 1.25rem; font-weight: 600; color: #111827; }

    /* ── Launch prep callout ── */
    .launch-callout {
      margin-top: 20px;
      background: rgba(99,102,241,0.06);
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 10px;
      padding: 14px 16px;
      display: flex; gap: 12px; align-items: flex-start;
    }
    .launch-icon { font-size: 1rem; flex-shrink: 0; margin-top: 2px; }
    .launch-body { flex: 1; }
    .launch-text {
      font-size: 0.875rem; color: #4b5563; line-height: 1.65; margin-bottom: 10px;
    }
    .launch-text strong { color: #111827; }
    .launch-equation {
      display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 0.8rem;
    }
    .pill {
      background: rgba(99,102,241,0.1); color: #6366f1;
      font-weight: 600; padding: 3px 10px; border-radius: 6px;
    }
    .pill-dark {
      background: #6366f1; color: #fff;
      font-weight: 700; padding: 3px 10px; border-radius: 6px;
    }
    .eq-op { color: #6b7280; }

    /* ── Details ── */
    .details-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
    .details-list li { font-size: 0.875rem; color: #374151; }
    .details-list li strong { font-weight: 600; color: #111827; }

    /* ── Features ── */
    .features-label {
      font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.08em; color: #6b7280; margin-bottom: 10px;
    }
    .features-chips {
      display: flex; flex-wrap: wrap; gap: 6px; padding: 0; list-style: none;
    }

    /* ── Footer ── */
    .disclaimer {
      margin-top: 14px;
      font-size: 0.75rem; color: #9ca3af; text-align: center; line-height: 1.6;
    }
  </style>
</head>
<body>

<div class="action-bar">
  <span class="action-bar-left">Your estimate is ready to share</span>
  <div class="action-bar-right">
    <button class="btn btn-outlined" id="copy-btn" onclick="copyEstimate()">Copy Estimate</button>
    <a class="btn btn-primary" href="${mailtoHref}">&#9993; Open Email Client</a>
  </div>
</div>

<p class="instructions">
  Click <strong>Copy Estimate</strong>, then paste into Gmail, Outlook, or Apple Mail to preserve the formatting.
  Or click <strong>Open Email Client</strong> to pre-fill the recipient and paste manually.
</p>

<div class="container">
  <div id="estimate-card">

    <div class="card-title">Estimate Summary</div>
    <div class="card-subtitle">
      ${estimate.featureCount} feature${estimate.featureCount !== 1 ? "s" : ""} selected
      &nbsp;&middot;&nbsp;
      ${formatCurrency(estimate.hourlyRate)}/hr rate
    </div>

    <hr class="divider" />

    <div class="mode-row">
      <span class="mode-badge">Midpoint</span>
    </div>

    <div>
      <div class="field-label">Estimated Development Cost</div>
      <div class="cost-value">${formatCurrency(avgCost)}</div>
    </div>

    <div>
      <div class="field-label">Estimated Timeframe</div>
      <div class="time-value">${formatWeeks(avgWeeks)}</div>
    </div>

    <div style="margin-top:16px;padding:12px 14px;border-radius:8px;background:#f9fafb;border:1px solid #e5e7eb;display:flex;gap:10px;align-items:flex-start;">
      <div>
        <div class="field-label" style="margin-bottom:4px;">Estimated Annual Maintenance</div>
        <div style="font-size:1rem;font-weight:600;color:#111827;">
          ${formatCurrency(estimate.maintMinCost)} to ${formatCurrency(estimate.maintMaxCost)}<span style="font-weight:400;color:#6b7280;font-size:0.85em;"> /yr</span>
        </div>
        <div style="font-size:0.78rem;color:#6b7280;margin-top:3px;">Covers updates, bug fixes, and security patches after launch.</div>
      </div>
    </div>

    <div class="launch-callout">
      <span class="launch-icon">&#128640;</span>
      <div class="launch-body">
        <p class="launch-text">
          <strong>Plan for launch prep.</strong>
          App store reviews and web hosting setup typically take at least 4 weeks on top of your build time.
        </p>
        <div class="launch-equation">
          <span class="pill">${formatWeeks(avgWeeks)} build</span>
          <span class="eq-op">+</span>
          <span class="pill">4 weeks prep</span>
          <span class="eq-op">=</span>
          <span class="pill-dark">${formatWeeks(launchWeeks)} to launch</span>
        </div>
      </div>
    </div>

    <hr class="divider" />

    <ul class="details-list">
      <li><strong>Development cost:</strong> ${formatCurrency(estimate.minCost)} &ndash; ${formatCurrency(estimate.maxCost)}</li>
      <li><strong>Timeframe:</strong> ${formatWeeks(estimate.minWeeks)} &ndash; ${formatWeeks(estimate.maxWeeks)}</li>
      <li><strong>Development hours:</strong> ${estimate.totalMinHours} &ndash; ${estimate.totalMaxHours} hrs</li>
      <li><strong>Annual maintenance:</strong> ${formatCurrency(estimate.maintMinCost)} &ndash; ${formatCurrency(estimate.maintMaxCost)}/yr (${estimate.maintMinHours} &ndash; ${estimate.maintMaxHours} hrs)</li>
    </ul>

    <hr class="divider" />

    <div class="features-label">Features Included</div>
    <ul class="features-chips">
      ${featureChips}
    </ul>

  </div>

  <p class="disclaimer">
    Estimates are for planning purposes only. Actual costs vary based on team experience, scope, and complexity.<br/>
    Generated by ace calculator.
  </p>
</div>

<script>${copyScript}</script>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Strategy: mailto
// NOTE: The mailto: protocol does not support HTML bodies — email clients
// render only plain text. Instead, we open a styled HTML page in a new tab
// so the user can copy the formatted estimate and paste it into their email
// client (Gmail, Outlook, and Apple Mail all preserve pasted HTML formatting).
// ─────────────────────────────────────────────────────────────────────────────

function mailtoStrategy(
  estimate: EstimateResult,
  selectedFeatures: AppFeature[],
  toEmail: string,
): void {
  const html = buildHtmlPage(estimate, selectedFeatures, toEmail);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

// ─────────────────────────────────────────────────────────────────────────────
// Strategy: api (stub — activate when you have an email provider account)
//
// TO ACTIVATE:
//   1. Sign up for an email provider (e.g. Resend at resend.com, or SendGrid)
//   2. Install their SDK:  yarn add resend
//   3. Create a server action at:
//      src/features/core/actions/send-estimate-email.ts
//      that calls the provider API with `estimate`, `selectedFeatures`, `toEmail`
//   4. Import that action below and call it
//   5. Change ACTIVE_STRATEGY above to "api"
// ─────────────────────────────────────────────────────────────────────────────

/* istanbul ignore next */
async function apiStrategy(
  _estimate: EstimateResult,
  _selectedFeatures: AppFeature[],
  _toEmail: string,
): Promise<void> {
  // TODO: uncomment and fill in when your email provider is ready:
  //
  // import { sendEstimateEmail } from "@/features/core/actions/send-estimate-email";
  // await sendEstimateEmail({ estimate: _estimate, features: _selectedFeatures, to: _toEmail });

  /* istanbul ignore next */
  throw new Error(
    "API email strategy is not yet configured. " +
      "See estimate-email.ts for setup instructions.",
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export function shareEstimateByEmail(
  estimate: EstimateResult,
  selectedFeatures: AppFeature[],
  toEmail: string,
): void {
  /* istanbul ignore else */
  if (ACTIVE_STRATEGY === "mailto") {
    mailtoStrategy(estimate, selectedFeatures, toEmail);
  } else {
    /* istanbul ignore next */
    void apiStrategy(estimate, selectedFeatures, toEmail);
  }
}
