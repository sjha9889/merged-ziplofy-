import { useEffect, useState, type FormEvent } from 'react';
import { useStorefrontAuth } from '@render-store/sdk';
import { GamingFooter } from './GamingFooter';
import { GamingHeader } from './GamingHeader';

export const GamingPreferencesPage = () => {
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

  return (
    <main style={{ minHeight: '100vh', background: '#030712', color: '#f3f3f3' }}>
      <GamingHeader />
      <section style={{ maxWidth: 600, margin: '30px auto', border: '1px solid #2b3648', padding: 16 }}>
        <h1>Preferences</h1>
        <form onSubmit={(e) => void onSave(e)} style={{ display: 'grid', gap: 10 }}>
          <label>
            Language <input value={language} onChange={(e) => setLanguage(e.target.value)} />
          </label>
          <label>
            <input type="checkbox" checked={agreedToMarketingEmails} onChange={(e) => setAgreedToMarketingEmails(e.target.checked)} />
            Email marketing opt-in
          </label>
          <label>
            <input type="checkbox" checked={agreedToSmsMarketing} onChange={(e) => setAgreedToSmsMarketing(e.target.checked)} />
            SMS marketing opt-in
          </label>
          <label>
            Tax preference
            <select
              value={collectTax}
              onChange={(e) => setCollectTax(e.target.value as 'collect' | 'dont_collect' | 'collect_unless_exempt')}
            >
              <option value="collect">Collect</option>
              <option value="dont_collect">Do not collect</option>
              <option value="collect_unless_exempt">Collect unless exempt</option>
            </select>
          </label>
          <button type="submit" disabled={loading} style={{ background: '#7cf7b1', border: 0, padding: 10 }}>
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </form>
      </section>
      <GamingFooter />
    </main>
  );
};
