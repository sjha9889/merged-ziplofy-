import { useEffect, useState, type FormEvent } from 'react';
import { useStorefrontAuth } from '@render-store/sdk';
import { BeautyFooter } from './BeautyFooter';
import { BeautyHeader } from './BeautyHeader';
import { B, inputStyle } from './beautyTokens';

export const BeautyPreferencesPage = () => {
  const { user, checkAuth, updateUser, loading } = useStorefrontAuth();
  const [language, setLanguage] = useState('en');
  const [agreedToMarketingEmails, setAgreedToMarketingEmails] = useState(false);
  const [agreedToSmsMarketing, setAgreedToSmsMarketing] = useState(false);
  const [collectTax, setCollectTax] = useState<'collect' | 'dont_collect' | 'collect_unless_exempt'>('collect');

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
    setLanguage(user.language || 'en');
    setAgreedToMarketingEmails(Boolean(user.agreedToMarketingEmails));
    setAgreedToSmsMarketing(Boolean(user.agreedToSmsMarketing));
    setCollectTax(user.collectTax);
  }, [user]);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    await updateUser(user._id, { language, agreedToMarketingEmails, agreedToSmsMarketing, collectTax });
  };

  const labelStyle = { fontFamily: B.sans, fontSize: 14, color: B.ink, display: 'grid', gap: 8 } as const;
  const selectStyle = { ...inputStyle, cursor: 'pointer' as const };

  return (
    <main style={{ minHeight: '100vh', background: B.cream, color: B.ink }}>
      <BeautyHeader />
      <section style={{ padding: '48px 28px 80px' }}>
        <div
          style={{
            maxWidth: 560,
            margin: '0 auto',
            background: B.white,
            borderRadius: B.radiusLg,
            padding: '40px 36px',
            border: `1px solid ${B.line}`,
            boxShadow: B.shadowSm,
          }}
        >
          <h1 style={{ fontFamily: B.serif, fontSize: 32, fontWeight: 600, margin: '0 0 8px' }}>Preferences</h1>
          <p style={{ fontFamily: B.sans, fontSize: 14, color: B.inkMuted, margin: '0 0 28px' }}>Fine-tune how we stay in touch and handle tax.</p>
          <form onSubmit={(e) => void onSave(e)} style={{ display: 'grid', gap: 22 }}>
            <label style={labelStyle}>
              Language
              <input value={language} onChange={(e) => setLanguage(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ ...labelStyle, gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 12 }}>
              <input type="checkbox" checked={agreedToMarketingEmails} onChange={(e) => setAgreedToMarketingEmails(e.target.checked)} style={{ width: 18, height: 18 }} />
              Email editorial and offers
            </label>
            <label style={{ ...labelStyle, gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 12 }}>
              <input type="checkbox" checked={agreedToSmsMarketing} onChange={(e) => setAgreedToSmsMarketing(e.target.checked)} style={{ width: 18, height: 18 }} />
              SMS reminders and launches
            </label>
            <label style={labelStyle}>
              Tax preference
              <select
                value={collectTax}
                onChange={(e) => setCollectTax(e.target.value as 'collect' | 'dont_collect' | 'collect_unless_exempt')}
                style={selectStyle}
              >
                <option value="collect">Collect</option>
                <option value="dont_collect">Do not collect</option>
                <option value="collect_unless_exempt">Collect unless exempt</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={loading}
              style={{
                fontFamily: B.sans,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: 8,
                background: loading ? '#c4bbb8' : `linear-gradient(135deg, ${B.ink} 0%, #3d2f33 100%)`,
                color: B.white,
                border: 'none',
                padding: '14px 24px',
                borderRadius: 999,
                cursor: loading ? 'wait' : 'pointer',
              }}
            >
              {loading ? 'Saving…' : 'Save preferences'}
            </button>
          </form>
        </div>
      </section>
      <BeautyFooter />
    </main>
  );
};
