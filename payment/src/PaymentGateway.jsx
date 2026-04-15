import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&family=Sora:wght@600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pg-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f0f4f8;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }

  .pg-card {
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04);
    width: 100%;
    max-width: 420px;
    overflow: hidden;
    border: 1px solid #e8edf2;
  }

  /* Header */
  .pg-header {
    padding: 1.5rem 1.5rem 1.25rem;
    background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%);
    position: relative;
    overflow: hidden;
  }
  .pg-header::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }
  .pg-header::after {
    content: '';
    position: absolute;
    bottom: -40px; left: -20px;
    width: 120px; height: 120px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }

  .pg-merchant-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1.25rem;
    position: relative;
    z-index: 1;
  }
  .pg-avatar {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    border: 2px solid rgba(255,255,255,0.3);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Sora', sans-serif;
    font-weight: 700; font-size: 15px; color: #fff;
    flex-shrink: 0;
    backdrop-filter: blur(4px);
  }
  .pg-merchant-name {
    font-size: 16px; font-weight: 600; color: #fff; display: block;
  }
  .pg-merchant-sub {
    font-size: 12px; color: rgba(255,255,255,0.7); display: block; margin-top: 1px;
  }

  .pg-amount-block {
    text-align: center;
    position: relative; z-index: 1;
  }
  .pg-amount-label {
    font-size: 11px;
    color: rgba(255,255,255,0.65);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .pg-amount-value {
    font-family: 'Sora', sans-serif;
    font-size: 42px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 2px;
  }
  .pg-amount-symbol {
    font-size: 24px;
    margin-top: 6px;
    font-weight: 600;
  }
  .pg-amount-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 11px;
    color: rgba(255,255,255,0.85);
    margin-top: 10px;
    backdrop-filter: blur(4px);
  }

  /* Tabs */
  .pg-body { padding: 1.25rem 1.5rem 1.5rem; }

  .pg-tabs {
    display: flex;
    gap: 4px;
    background: #f1f5f9;
    border-radius: 14px;
    padding: 4px;
    margin-bottom: 1.25rem;
  }
  .pg-tab {
    flex: 1;
    padding: 8px 0;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    border-radius: 11px;
    cursor: pointer;
    border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s ease;
  }
  .pg-tab.active {
    background: #ffffff;
    color: #1e40af;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
    font-weight: 600;
  }

  /* QR Section */
  .qr-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 0.5rem 0;
  }
  .qr-frame {
    position: relative;
    width: 196px; height: 196px;
    border: 2px solid #e2e8f0;
    border-radius: 18px;
    padding: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .qr-canvas { width: 100%; height: 100%; display: block; }
  .qr-logo-overlay {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 36px; height: 36px;
    border-radius: 9px;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }
  .qr-upi-id {
    font-size: 13px;
    color: #64748b;
    text-align: center;
  }
  .qr-upi-id strong { color: #1e293b; font-weight: 600; }

  .qr-timer {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 20px;
    border: 1px solid #bfdbfe;
    transition: background 0.3s, color 0.3s, border-color 0.3s;
  }
  .qr-timer.expired {
    background: #fef2f2;
    color: #dc2626;
    border-color: #fecaca;
  }
  .qr-note {
    font-size: 12px;
    color: #94a3b8;
    text-align: center;
    line-height: 1.5;
  }

  /* Apps Section */
  .apps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 1rem;
  }
  .app-btn {
    border: 1.5px solid #e8edf2;
    border-radius: 16px;
    padding: 14px 8px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    background: #fff;
    transition: all 0.18s ease;
    position: relative;
    font-family: 'DM Sans', sans-serif;
  }
  .app-btn:hover {
    border-color: #bfdbfe;
    background: #f8faff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(30,64,175,0.08);
  }
  .app-btn.selected {
    border-color: #2563eb;
    background: #eff6ff;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  }
  .app-btn-check {
    position: absolute;
    top: 7px; right: 7px;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: #2563eb;
    display: flex; align-items: center; justify-content: center;
  }
  .app-icon {
    width: 48px; height: 48px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }
  .app-name {
    font-size: 11.5px;
    color: #475569;
    font-weight: 500;
    text-align: center;
    line-height: 1.2;
  }
  .app-hint {
    font-size: 12px;
    color: #94a3b8;
    text-align: center;
    min-height: 18px;
    margin-bottom: 0.25rem;
  }

  /* UPI ID Section */
  .upi-label {
    font-size: 13px;
    color: #475569;
    font-weight: 500;
    display: block;
    margin-bottom: 8px;
  }
  .upi-input {
    width: 100%;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 11px 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #1e293b;
    background: #fff;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .upi-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  }
  .upi-input.valid { border-color: #16a34a; }
  .upi-input.invalid { border-color: #dc2626; }

  .upi-status {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 6px;
    min-height: 16px;
    transition: color 0.2s;
  }
  .upi-status.valid { color: #16a34a; }
  .upi-status.invalid { color: #dc2626; }

  .or-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 1rem 0 0.75rem;
    color: #94a3b8;
    font-size: 12px;
  }
  .or-divider::before, .or-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  .quick-chips {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .quick-chip {
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    padding: 5px 13px;
    font-size: 12px;
    cursor: pointer;
    background: #f8fafc;
    color: #475569;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    transition: all 0.15s;
  }
  .quick-chip:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #1d4ed8;
  }

  /* Pay Button */
  .pay-btn {
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    background: linear-gradient(135deg, #1e40af, #2563eb);
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    font-family: 'Sora', sans-serif;
    border: none;
    cursor: pointer;
    margin-top: 1rem;
    transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
    box-shadow: 0 4px 12px rgba(37,99,235,0.35);
    letter-spacing: 0.01em;
  }
  .pay-btn:hover:not(:disabled) {
    opacity: 0.93;
    box-shadow: 0 6px 16px rgba(37,99,235,0.4);
    transform: translateY(-1px);
  }
  .pay-btn:active:not(:disabled) { transform: scale(0.98); }
  .pay-btn:disabled {
    background: #93c5fd;
    cursor: not-allowed;
    box-shadow: none;
  }
  .pay-btn.processing {
    background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
    cursor: wait;
  }

  /* Footer */
  .pg-footer {
    padding: 0.875rem 1.5rem;
    border-top: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #fafbfc;
  }
  .secure-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
  }

  /* Success */
  .success-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 2rem 2.5rem;
    text-align: center;
    gap: 12px;
  }
  .success-ring {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: #f0fdf4;
    border: 3px solid #86efac;
    display: flex; align-items: center; justify-content: center;
    animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes scaleIn {
    from { transform: scale(0.5); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  .success-title {
    font-family: 'Sora', sans-serif;
    font-size: 22px; font-weight: 700;
    color: #1e293b;
  }
  .success-sub { font-size: 15px; color: #475569; }
  .success-ref {
    font-size: 12px; color: #64748b;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    padding: 6px 18px;
    font-weight: 500;
    margin-top: 4px;
  }
  .reset-btn {
    margin-top: 1.25rem;
    padding: 11px 28px;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    background: transparent;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    color: #1e293b;
    font-weight: 500;
    transition: all 0.15s;
  }
  .reset-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  /* Spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }

  /* Paid-details modal */
  .pg-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .pg-modal {
    background: #fff;
    border-radius: 20px;
    width: 100%;
    max-width: 380px;
    max-height: min(90vh, 520px);
    overflow: auto;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.2);
    border: 1px solid #e8edf2;
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp {
    from { transform: translateY(12px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .pg-modal-head {
    padding: 1.25rem 1.25rem 0.75rem;
    border-bottom: 1px solid #f1f5f9;
  }
  .pg-modal-title {
    font-family: 'Sora', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #1e293b;
  }
  .pg-modal-sub {
    font-size: 13px;
    color: #64748b;
    margin-top: 4px;
    line-height: 1.45;
  }
  .pg-modal-body { padding: 1rem 1.25rem 1.25rem; }
  .paid-field { margin-bottom: 14px; }
  .paid-field:last-of-type { margin-bottom: 0; }
  .paid-label {
    font-size: 13px;
    font-weight: 500;
    color: #475569;
    display: block;
    margin-bottom: 6px;
  }
  .paid-input {
    width: 100%;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 12px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #1e293b;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .paid-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  }
  .paid-input.err { border-color: #dc2626; }
  .paid-err {
    font-size: 11px;
    color: #dc2626;
    margin-top: 4px;
    min-height: 14px;
  }
  .pg-modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 1.25rem;
  }
  .paid-cancel {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .paid-cancel:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
  .paid-submit {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #1e40af, #2563eb);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(37,99,235,0.3);
    transition: opacity 0.15s, transform 0.1s;
  }
  .paid-submit:hover:not(:disabled) {
    opacity: 0.95;
    transform: translateY(-1px);
  }
  .paid-submit:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
  .paid-api-banner {
    font-size: 13px;
    color: #b91c1c;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 10px 12px;
    margin-bottom: 14px;
    line-height: 1.45;
  }
`;

// ── QR Canvas ────────────────────────────────────────────────────────────────
function QRCanvas({ value }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;

    QRCode.toCanvas(canvas, value, {
      width: 172,
      margin: 1,
      color: {
        dark: "#111827",
        light: "#ffffff",
      },
    }).catch(() => {
      // Keep the UI stable even if QR generation fails.
    });
  }, [value]);

  return <canvas ref={canvasRef} className="qr-canvas" />;
}

// ── UPI App Icons ─────────────────────────────────────────────────────────────
const UPI_APPS = [
  {
    id: "gpay", name: "GPay",
    icon: (
      <svg viewBox="0 0 48 48" width="38" height="38">
        <path d="M24 9.5c3.9 0 7.4 1.4 10.1 3.7l-4.1 4.1C28.4 15.6 26.3 15 24 15c-5 0-9.2 3.3-10.7 7.8H8.7A15.5 15.5 0 0124 9.5z" fill="#EA4335"/>
        <path d="M34.6 34.7A15.4 15.4 0 0124 38.5c-6.5 0-12.1-4-14.6-9.8l5.6-4.4c1.5 4.5 5.7 7.7 10.7 7.7 2.4 0 4.6-.7 6.3-2z" fill="#34A853"/>
        <path d="M39.3 24c0-1-.1-2-.3-3H24v5.7h8.6c-.4 2-1.5 3.7-3 4.9l4.7 3.7A15.3 15.3 0 0039.3 24z" fill="#4285F4"/>
        <path d="M13.3 22.8A9.5 9.5 0 0113 21c0-.6.1-1.3.3-1.8l-5.6-4.4A15.5 15.5 0 008.5 21c0 1.3.2 2.6.5 3.7z" fill="#FBBC05"/>
      </svg>
    ),
    bg: "#fff", border: "1px solid #e8eaed",
  },
  {
    id: "phonepe", name: "PhonePe",
    icon: (
      <svg viewBox="0 0 48 48" width="38" height="38">
        <circle cx="24" cy="24" r="22" fill="#5f259f"/>
        <text x="24" y="30" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="16" fill="#fff">Pe</text>
      </svg>
    ),
    bg: "#5f259f",
  },
  {
    id: "paytm", name: "Paytm",
    icon: (
      <svg viewBox="0 0 48 48" width="38" height="38">
        <circle cx="24" cy="24" r="22" fill="#00baf2"/>
        <text x="24" y="30" textAnchor="middle" fontFamily="Arial Black" fontWeight="900" fontSize="12" fill="#fff">PTM</text>
      </svg>
    ),
    bg: "#00baf2",
  },
  {
    id: "bhim", name: "BHIM",
    icon: (
      <svg viewBox="0 0 48 48" width="38" height="38">
        <circle cx="24" cy="24" r="22" fill="#ff6600"/>
        <text x="24" y="30" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="11" fill="#fff">BHIM</text>
      </svg>
    ),
    bg: "#ff6600",
  },
  {
    id: "amazon", name: "Amazon Pay",
    icon: (
      <svg viewBox="0 0 48 48" width="38" height="38">
        <circle cx="24" cy="24" r="22" fill="#232f3e"/>
        <text x="24" y="27" textAnchor="middle" fontFamily="Arial" fontWeight="700" fontSize="9" fill="#ff9900">amazon</text>
        <path d="M14 33 Q24 37 34 33" stroke="#ff9900" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    bg: "#232f3e",
  },
  {
    id: "cred", name: "CRED",
    icon: (
      <svg viewBox="0 0 48 48" width="38" height="38">
        <circle cx="24" cy="24" r="22" fill="#1c1c1c"/>
        <text x="24" y="30" textAnchor="middle" fontFamily="Arial" fontWeight="800" fontSize="12" fill="#fff">CRED</text>
      </svg>
    ),
    bg: "#1c1c1c",
  },
];

/** Must match header / pay button (₹1,899) */
const MERCHANT_UPI = "zarastore@upi";
const MERCHANT_NAME = "Zara Store";
const AMOUNT_INR = "1899.00";
const ORDER_ID = "ZS-20480";

/**
 * NPCI-style UPI params; each app uses its own URL scheme so the OS opens that app.
 * Falls back to generic upi://pay if unknown.
 */
function buildUpiQueryString({ pa, pn, am, cu, tn, tr }) {
  const p = new URLSearchParams();
  p.set("pa", pa);
  p.set("pn", pn);
  p.set("am", am);
  p.set("cu", cu);
  if (tn) p.set("tn", tn);
  if (tr) p.set("tr", tr);
  return p.toString();
}

function getAppDeepLink(appId, queryString) {
  const withQs = (scheme) => `${scheme}${queryString}`;
  switch (appId) {
    case "gpay":
      return withQs("tez://pay?");
    case "phonepe":
      return withQs("phonepe://pay?");
    case "paytm":
      return withQs("paytmmp://pay?");
    case "bhim":
      return withQs("bhim://pay?");
    case "amazon":
      return withQs("amazonpay://pay?");
    case "cred":
      return withQs("credpay://pay?");
    default:
      return withQs("upi://pay?");
  }
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PaymentGateway() {
  const [tab, setTab] = useState("qr");
  const [selectedApp, setSelectedApp] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [upiValidity, setUpiValidity] = useState("idle"); // idle | valid | invalid
  const [countdown, setCountdown] = useState(300);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPaidForm, setShowPaidForm] = useState(false);
  const [payerName, setPayerName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [payerUtr, setPayerUtr] = useState("");
  const [paidFormErrors, setPaidFormErrors] = useState({});
  const [paidFormApiError, setPaidFormApiError] = useState("");
  const [refNo] = useState(() => {
    const id = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `UPI/2603/${id}`;
  });

  const openUpiPayment = useCallback((appId) => {
    const qs = buildUpiQueryString({
      pa: MERCHANT_UPI,
      pn: MERCHANT_NAME,
      am: AMOUNT_INR,
      cu: "INR",
      tn: `Order ${ORDER_ID}`,
      tr: refNo,
    });
    const url = getAppDeepLink(appId, qs);
    window.location.assign(url);
  }, [refNo]);
  const qrUpiPayload = `upi://pay?${buildUpiQueryString({
    pa: MERCHANT_UPI,
    pn: MERCHANT_NAME,
    am: AMOUNT_INR,
    cu: "INR",
    tn: `Order ${ORDER_ID}`,
    tr: refNo,
  })}`;

  // Countdown timer
  useEffect(() => {
    if (success) return;
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, success]);

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const validateUpi = useCallback((val) => {
    if (!val) return setUpiValidity("idle");
    const ok = /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(val) || /^\d{10}@[a-zA-Z]{2,}$/.test(val);
    setUpiValidity(ok ? "valid" : "invalid");
  }, []);

  const handleUpiChange = (e) => {
    const v = e.target.value;
    setUpiId(v);
    validateUpi(v.trim());
  };

  const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  const validatePaidDetails = () => {
    const err = {};
    const name = payerName.trim();
    if (name.length < 2) err.name = "Enter your full name";
    const email = payerEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Enter a valid email address";
    const utr = payerUtr.replace(/\s/g, "");
    if (!/^\d{10,18}$/.test(utr)) err.utr = "UTR must be 10–18 digits (check your UPI app)";
    setPaidFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handlePaidFormSubmit = async (e) => {
    e.preventDefault();
    if (!validatePaidDetails()) return;
    setPaidFormApiError("");
    setShowPaidForm(false);
    setProcessing(true);
    try {
      const res = await fetch(`${apiBase}/api/payments/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payerName.trim(),
          email: payerEmail.trim(),
          utr: payerUtr.replace(/\D/g, ""),
          referenceId: refNo,
          amountPaise: 189900,
          merchantName: "Zara Store",
          orderId: "ZS-20480",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 400 && data.details && typeof data.details === "object") {
          setPaidFormErrors({
            name: data.details.name || "",
            email: data.details.email || "",
            utr: data.details.utr || "",
          });
          setPaidFormApiError("Please fix the highlighted fields.");
          setShowPaidForm(true);
          return;
        }
        if (res.status === 409) {
          setPaidFormApiError(data.message || "This UTR was already submitted.");
          setShowPaidForm(true);
          return;
        }
        setPaidFormApiError(data.message || "Payment could not be recorded. Try again.");
        setShowPaidForm(true);
        return;
      }
      setSuccess(true);
    } catch {
      setPaidFormApiError(
        "Could not reach the API. Run npm run dev:all or npm run backend:dev from the project folder."
      );
      setShowPaidForm(true);
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenPaidForm = () => {
    setPaidFormErrors({});
    setPaidFormApiError("");
    setShowPaidForm(true);
  };

  const handleClosePaidForm = () => {
    if (processing) return;
    setShowPaidForm(false);
  };

  const handleReset = () => {
    setSuccess(false);
    setTab("qr");
    setSelectedApp(null);
    setUpiId("");
    setUpiValidity("idle");
    setCountdown(300);
    setShowPaidForm(false);
    setPayerName("");
    setPayerEmail("");
    setPayerUtr("");
    setPaidFormErrors({});
    setPaidFormApiError("");
  };

  const canPay =
    tab === "qr" ? true :
    tab === "apps" ? !!selectedApp :
    upiValidity === "valid";

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="pg-root">
        <div className="pg-card">

          {/* ── Success Screen ── */}
          {success ? (
            <div className="success-screen">
              <div className="success-ring">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="success-title">Payment Successful!</div>
              <div className="success-sub">₹1,899 paid to Zara Store</div>
              <div className="success-ref">{refNo}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                {payerEmail.trim()
                  ? `Confirmation will be sent to ${payerEmail.trim()}`
                  : "Confirmation sent to your UPI app"}
              </div>
              <button className="reset-btn" onClick={handleReset}>
                Make another payment
              </button>
            </div>
          ) : (
            <>
              {/* ── Header ── */}
              <div className="pg-header">
                <div className="pg-merchant-row">
                  <div className="pg-avatar">ZS</div>
                  <div>
                    <span className="pg-merchant-name">Zara Store</span>
                    <span className="pg-merchant-sub">Order #ZS-20480 · 3 items</span>
                  </div>
                </div>
                <div className="pg-amount-block">
                  <div className="pg-amount-label">Total Amount</div>
                  <div className="pg-amount-value">
                    <span className="pg-amount-symbol">₹</span>
                    <span>1,899</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div className="pg-amount-badge">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      Secure UPI Payment
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Body ── */}
              <div className="pg-body">
                {/* Tabs */}
                <div className="pg-tabs">
                  {["qr", "apps", "id"].map((t) => (
                    <button
                      key={t}
                      className={`pg-tab ${tab === t ? "active" : ""}`}
                      onClick={() => setTab(t)}
                    >
                      {t === "qr" ? "QR Code" : t === "apps" ? "UPI Apps" : "UPI ID"}
                    </button>
                  ))}
                </div>

                {/* ── QR Tab ── */}
                {tab === "qr" && (
                  <div className="qr-wrap">
                    <div className="qr-frame">
                      <QRCanvas value={qrUpiPayload} />
                      <div className="qr-logo-overlay">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                      </div>
                    </div>
                    <div className="qr-upi-id">Scan to pay · <strong>zarastore@upi</strong></div>
                    <div className={`qr-timer ${countdown === 0 ? "expired" : ""}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {countdown > 0 ? `Expires in ${fmtTime(countdown)}` : "QR Expired"}
                    </div>
                    <div className="qr-note">Open any UPI app &amp; scan to complete payment</div>
                    <button
                      className={`pay-btn ${processing ? "processing" : ""}`}
                      onClick={handleOpenPaidForm}
                      disabled={processing || countdown === 0}
                    >
                      {processing ? <><span className="spinner"/>Processing...</> : "I've Paid"}
                    </button>
                  </div>
                )}

                {/* ── Apps Tab ── */}
                {tab === "apps" && (
                  <>
                    <div className="apps-grid">
                      {UPI_APPS.map((app) => (
                        <button
                          type="button"
                          key={app.id}
                          className={`app-btn ${selectedApp === app.id ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedApp(app.id);
                            openUpiPayment(app.id);
                          }}
                        >
                          {selectedApp === app.id && (
                            <div className="app-btn-check">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </div>
                          )}
                          <div className="app-icon" style={{ background: app.bg, border: app.border }}>
                            {app.icon}
                          </div>
                          <span className="app-name">{app.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="app-hint">
                      {selectedApp
                        ? `Opens ${UPI_APPS.find((a) => a.id === selectedApp)?.name} with ₹1,899 for ${MERCHANT_NAME}. Tap Pay to open again.`
                        : "Tap an app to open it with your payment amount"}
                    </div>
                    <button
                      type="button"
                      className="pay-btn"
                      onClick={() => openUpiPayment(selectedApp)}
                      disabled={!selectedApp}
                    >
                      Pay ₹1,899
                    </button>
                  </>
                )}

                {/* ── UPI ID Tab ── */}
                {tab === "id" && (
                  <>
                    <label className="upi-label">Enter your UPI ID</label>
                    <input
                      className={`upi-input ${upiValidity === "valid" ? "valid" : upiValidity === "invalid" ? "invalid" : ""}`}
                      type="text"
                      placeholder="yourname@bankname"
                      value={upiId}
                      onChange={handleUpiChange}
                      autoComplete="off"
                    />
                    <div className={`upi-status ${upiValidity}`}>
                      {upiValidity === "idle" && "e.g. rahul@okicici, 9876543210@upi"}
                      {upiValidity === "valid" && "✓ Looks good!"}
                      {upiValidity === "invalid" && "Enter a valid UPI ID"}
                    </div>
                    <div className="or-divider">or use a handle</div>
                    <div className="quick-chips">
                      {["@paytm", "@okicici", "@ybl", "@upi"].map((h) => (
                        <button
                          key={h}
                          className="quick-chip"
                          onClick={() => {
                            const base = upiId.split("@")[0] || "user";
                            const v = base + h;
                            setUpiId(v);
                            validateUpi(v);
                          }}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                    <button
                      className={`pay-btn ${processing ? "processing" : ""}`}
                      onClick={handlePay}
                      disabled={!canPay || processing}
                    >
                      {processing ? <><span className="spinner"/>Processing...</> : "Pay ₹1,899"}
                    </button>
                  </>
                )}
              </div>

              {/* ── Footer ── */}
              <div className="pg-footer">
                <div className="secure-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  256-bit SSL secured
                </div>
                <span style={{ color: "#e2e8f0", fontSize: 14 }}>|</span>
                <svg width="34" height="16" viewBox="0 0 80 36">
                  <rect width="80" height="36" rx="6" fill="#097939"/>
                  <text x="40" y="24" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="16" fill="#fff">UPI</text>
                </svg>
              </div>
            </>
          )}
        </div>
      </div>

      {showPaidForm && (
        <div
          className="pg-modal-overlay"
          role="presentation"
          onClick={(e) => e.target === e.currentTarget && handleClosePaidForm()}
        >
          <div className="pg-modal" role="dialog" aria-labelledby="paid-form-title" aria-modal="true">
            <div className="pg-modal-head">
              <div id="paid-form-title" className="pg-modal-title">Confirm your payment</div>
              <p className="pg-modal-sub">
                Enter the details from your UPI receipt so we can match your payment.
              </p>
            </div>
            <form className="pg-modal-body" onSubmit={handlePaidFormSubmit} noValidate>
              {paidFormApiError ? (
                <div className="paid-api-banner" role="alert">
                  {paidFormApiError}
                </div>
              ) : null}
              <div className="paid-field">
                <label className="paid-label" htmlFor="paid-name">Full name</label>
                <input
                  id="paid-name"
                  className={`paid-input ${paidFormErrors.name ? "err" : ""}`}
                  type="text"
                  autoComplete="name"
                  placeholder="As per bank / UPI"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                />
                <div className="paid-err">{paidFormErrors.name || ""}</div>
              </div>
              <div className="paid-field">
                <label className="paid-label" htmlFor="paid-email">Email ID</label>
                <input
                  id="paid-email"
                  className={`paid-input ${paidFormErrors.email ? "err" : ""}`}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={payerEmail}
                  onChange={(e) => setPayerEmail(e.target.value)}
                />
                <div className="paid-err">{paidFormErrors.email || ""}</div>
              </div>
              <div className="paid-field">
                <label className="paid-label" htmlFor="paid-utr">UTR number</label>
                <input
                  id="paid-utr"
                  className={`paid-input ${paidFormErrors.utr ? "err" : ""}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="12-digit reference from UPI app"
                  value={payerUtr}
                  onChange={(e) => setPayerUtr(e.target.value.replace(/\D/g, "").slice(0, 18))}
                  maxLength={18}
                />
                <div className="paid-err">{paidFormErrors.utr || ""}</div>
              </div>
              <div className="pg-modal-actions">
                <button type="button" className="paid-cancel" onClick={handleClosePaidForm}>
                  Cancel
                </button>
                <button type="submit" className="paid-submit" disabled={processing}>
                  Submit and continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
