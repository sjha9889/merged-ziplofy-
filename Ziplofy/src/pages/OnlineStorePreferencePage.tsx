import {
  ArrowLeftIcon,
  GlobeAltIcon,
  LockClosedIcon,
  PhotoIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';

type Tab = 'All' | 'Active' | 'Expired';

export default function OnlineStorePreferencePage() {
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [messageToYourVisitorsInput, setMessageToYourVisitorsInput] = useState<string>('');
  const [homePageTitleInput, setHomePageTitleInput] = useState<string>('');
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const [createNewSignatureModalOpen, setCreateNewSignatureModalOpen] = useState<boolean>(false);

  const [signatureInput, setSignatureInput] = useState<string>('');
  const [domainInput, setDomainInput] = useState<string>('');
  const [expiresInInput, setExpiresInInput] = useState<string>('');

  const handleChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
  }, []);

  const handleMessageToYourVisitorsInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageToYourVisitorsInput(e.target.value);
  }, []);

  const handleHomePageTitleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHomePageTitleInput(e.target.value);
  }, []);

  const handleMetaDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetaDescription(e.target.value);
  }, []);

  const handleChangeActiveTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  const handleToggleNewSignatureModal = useCallback(() => {
    setCreateNewSignatureModalOpen((prev) => !prev);
  }, []);

  const handleSignatureInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSignatureInput(e.target.value);
  }, []);

  const handleDomainInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDomainInput(e.target.value);
  }, []);

  const handleExpiresInInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiresInInput(e.target.value);
  }, []);

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all';
  const labelClass = 'block text-sm font-medium text-gray-900 mb-1.5';
  const hintClass = 'text-xs text-gray-500 mt-1.5';

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
        {/* Page Header */}
        <div className="mb-6">
          <Link
            to="/online-store"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Online Store
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Store preferences</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure store access, SEO, and security settings
          </p>
        </div>

        {/* Store Access */}
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <LockClosedIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Store access</h2>
                <p className="text-sm text-gray-500">Password protection and visitor messaging</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 mb-6">
              <p className="text-sm font-medium text-gray-900">Password protection</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Restrict access to visitors with the password
              </p>
              <p className="text-xs text-gray-500 mt-3 p-3 bg-white rounded-md border border-gray-100">
                To let anyone access your online store, pick a plan and then remove your password
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <label className={labelClass}>Password</label>
                <input
                  value={passwordInput}
                  onChange={handleChangePassword}
                  className={inputClass}
                  type="password"
                  placeholder="Enter store password"
                />
                <p className={hintClass}>{passwordInput.length} of 100 characters used</p>
              </div>
              <div>
                <label className={labelClass}>Message to your visitors</label>
                <textarea
                  value={messageToYourVisitorsInput}
                  onChange={handleMessageToYourVisitorsInputChange}
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder="e.g. We're launching soon! Enter the password to preview."
                />
                <p className={hintClass}>{messageToYourVisitorsInput.length} of 5,000 characters used</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Sharing Image and SEO */}
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <PhotoIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Social sharing and SEO</h2>
                <p className="text-sm text-gray-500">Home page title and meta description</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center min-h-[180px]">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <PhotoIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">Add image</p>
                <p className="text-xs text-gray-500 mt-0.5">Recommended: 1200 × 628 pixels</p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Upload image
                </button>
              </div>
              <div className="flex flex-col gap-5">
                <div>
                  <label className={labelClass}>Home page title</label>
                  <input
                    className={inputClass}
                    value={homePageTitleInput}
                    onChange={handleHomePageTitleInputChange}
                    type="text"
                    placeholder="e.g. My Store - Quality Products"
                  />
                  <p className={hintClass}>{homePageTitleInput.length} of 70 characters used</p>
                </div>
                <div>
                  <label className={labelClass}>Meta description</label>
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={3}
                    value={metaDescription}
                    onChange={handleMetaDescriptionChange}
                    placeholder="Brief description for search engines"
                  />
                  <p className={hintClass}>{metaDescription.length} of 320 characters used</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">VSJIksjkfjoasfd.myZiplofy.com</p>
          </div>
        </div>

        {/* Automatic Redirection */}
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <GlobeAltIcon className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Automatic redirection</h2>
                <p className="text-sm text-gray-500">Match visitor location and language</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">Country/Region</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Displays a storefront that matches the visitor's location
                  </p>
                </div>
                <button
                  type="button"
                  className="w-11 h-6 rounded-full bg-gray-200 relative transition-colors"
                >
                  <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">Language</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Displays the language that matches a visitor's browser, when available
                  </p>
                </div>
                <button
                  type="button"
                  className="w-11 h-6 rounded-full bg-gray-200 relative transition-colors"
                >
                  <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Spam Protection */}
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Spam protection</h2>
                <p className="text-sm text-gray-500">
                  Enabling hCaptcha can protect your store from spam. Some customers may need to
                  complete the hCaptcha task.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50/50 transition-colors">
                <p className="text-sm font-medium text-gray-900">
                  Enable on contact and comment forms
                </p>
                <button
                  type="button"
                  className="w-11 h-6 rounded-full bg-gray-200 relative transition-colors"
                >
                  <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50/50 transition-colors">
                <p className="text-sm font-medium text-gray-900">
                  Enable on login, create account and password recovery pages
                </p>
                <button
                  type="button"
                  className="w-11 h-6 rounded-full bg-gray-200 relative transition-colors"
                >
                  <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Crawler Access */}
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Crawler access</h2>
                <p className="text-sm text-gray-500">Authorize external tools to crawl your store</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Use the buttons to copy the full values for Signature, Signature-input, and
              Signature-Agent, then paste them into your http crawler requests.
            </p>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200 bg-gray-50/50 p-1">
                {(['All', 'Active', 'Expired'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleChangeActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex flex-col justify-center items-center gap-3 p-12 min-h-[260px] bg-gray-50/30">
                <p className="text-sm font-medium text-gray-900">Manage crawler access</p>
                <p className="text-xs text-gray-500 text-center max-w-sm">
                  Create signatures that allow trusted tools to crawl your store
                </p>
                <button
                  type="button"
                  onClick={handleToggleNewSignatureModal}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create signature
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Signature Modal */}
      <Modal
        open={createNewSignatureModalOpen}
        onClose={handleToggleNewSignatureModal}
        title="Create new signature"
        maxWidth="md"
        actions={
          <>
            <button
              type="button"
              onClick={handleToggleNewSignatureModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Create signature
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <p className="text-sm text-gray-500">
            These details can't be changed after the signature is created
          </p>
          <div className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>Signature name</label>
              <input
                value={signatureInput}
                onChange={handleSignatureInputChange}
                type="text"
                className={inputClass}
                placeholder="e.g. My Crawler"
              />
              <p className={hintClass}>{signatureInput.length} of 100 characters used</p>
            </div>
            <div>
              <label className={labelClass}>Domain</label>
              <input
                value={domainInput}
                onChange={handleDomainInputChange}
                type="text"
                className={inputClass}
                placeholder="e.g. example.com"
              />
            </div>
            <div>
              <label className={labelClass}>Expires in</label>
              <input
                value={expiresInInput}
                onChange={handleExpiresInInputChange}
                type="text"
                className={inputClass}
                placeholder="e.g. 30 days"
              />
              <p className={hintClass}>Expires on Dec 25, 2025</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
