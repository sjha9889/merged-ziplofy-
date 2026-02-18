import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  CheckIcon,
  PlusIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

type Plan = {
  name: string;
  description: string;
  oldPrice?: string;
  price: string;
  unit: string;
  badge?: string;
  features: { label: string; emphasized?: boolean; secondary?: boolean }[];
  extras?: string[];
};

const plans: Plan[] = [
  {
    name: 'Basic',
    description: 'For solo entrepreneurs',
    oldPrice: '₹1,994',
    price: '₹20',
    unit: 'INR/month for first 3 months',
    badge: 'Most popular',
    features: [
      { label: 'Full online store', emphasized: true },
      { label: 'Sell in person with a phone or card reader' },
      { label: '10 inventory locations', emphasized: true },
      { label: 'Easy shipping labels' },
    ],
  },
  {
    name: 'Grow',
    description: 'For small teams',
    oldPrice: '₹7,447',
    price: '₹20',
    unit: 'INR/month for first 3 months',
    features: [
      { label: 'Full online store', emphasized: true },
      { label: 'Sell in person with a phone or card reader' },
      { label: '10 inventory locations', emphasized: true },
      { label: 'Shipping discounts + insurance' },
      { label: '5 staff accounts', emphasized: true },
    ],
  },
  {
    name: 'Advanced',
    description: 'As your business scales',
    oldPrice: '₹30,164',
    price: '₹20',
    unit: 'INR/month for first 3 months',
    features: [
      { label: 'Full online store', emphasized: true },
      { label: 'Sell in person with a phone or card reader' },
      { label: '10 inventory locations', emphasized: true },
      { label: 'Fully integrated shipping', secondary: true },
      { label: '15 staff accounts', emphasized: true },
      { label: 'Theme customization per market' },
      { label: 'Enhanced 24/7 chat support' },
    ],
  },
  {
    name: 'Plus',
    description: 'For more complex businesses',
    price: '₹175,000',
    unit: 'INR/month',
    features: [
      { label: 'Full online store', emphasized: true },
      { label: 'Sell in person with POS Pro for up to 200 locations', emphasized: true },
      { label: '200 inventory locations', emphasized: true },
      { label: 'Local storefronts by market' },
      { label: 'Fully integrated shipping', secondary: true },
      { label: 'Unlimited staff accounts', emphasized: true },
      { label: 'Theme customization per market' },
      { label: 'Priority 24/7 phone support', emphasized: true },
    ],
    extras: [
      'Fully customizable checkout',
      'Sell wholesale/B2B',
      'Optimize ads with Audiences',
      '9 free expansion stores',
    ],
  },
];

const faqSections = [
  {
    title: 'General',
    questions: [
      'What is Ziplofy and how does it work?',
      'How much does Ziplofy cost?',
      'How long are your contracts?',
      'Can I cancel my account at any time?',
      'Can I change my plan later on?',
      'Do you offer any discounts?',
      'In what countries can I use Ziplofy?',
      'Is Ziplofy PCI Compliant or PCI Certified?',
    ],
  },
  {
    title: 'Payment',
    questions: [
      'Are there any transaction fees?',
      'What is a third-party payment provider?',
      'Are there any credit card fees?',
    ],
  },
  {
    title: 'Store setup',
    questions: [
      'Is there a setup fee?',
      "I'm looking to switch to Ziplofy. How do I get my data over?",
      'Can I use my own domain name with Ziplofy?',
      'Do I get free web hosting when I open an online store?',
      'What are your bandwidth fees?',
    ],
  },
];

const PlanSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({});

  const toggleFaq = (sectionTitle: string, question: string) => {
    const key = `${sectionTitle}-${question}`;
    setExpandedFaqs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 py-6 px-4">
        <header className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate('/settings/plan')}
            className="mt-0.5 inline-flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Back to plan"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pick your plan</h1>
            <p className="mt-1 text-sm text-gray-500">
              Everything you need to run your business
            </p>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-4 flex-wrap text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-4 h-4" />
            World's best checkout
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-4 h-4" />
            Sell online and in person
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-4 h-4" />
            24/7 chat support
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-4 h-4" />
            Over 13,000 apps
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 flex flex-col relative"
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-900 border border-gray-200">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {plan.description}
              </p>

              <div className="mb-4">
                {plan.oldPrice && (
                  <p className="text-sm text-gray-400 line-through font-medium mb-0.5">
                    {plan.oldPrice}
                  </p>
                )}
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-xl font-semibold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-600">
                    {plan.unit}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors mb-4"
              >
                Select {plan.name}
              </button>

              <div className="flex-grow space-y-1">
                {plan.features.map((feature) =>
                  feature.secondary ? (
                    <p
                      key={feature.label}
                      className="text-xs text-gray-700 font-medium underline underline-offset-2 mb-1"
                    >
                      {feature.label}
                    </p>
                  ) : (
                    <div
                      key={feature.label}
                      className="flex items-center gap-2 text-xs text-gray-900"
                    >
                      <CheckIcon className="w-3 h-3 shrink-0" />
                      <span className={feature.emphasized ? 'font-medium' : ''}>
                        {feature.label}
                      </span>
                    </div>
                  )
                )}
                {plan.extras && (
                  <div className="mt-2 space-y-1">
                    {plan.extras.map((extra) => (
                      <div
                        key={extra}
                        className="flex items-center gap-2 text-xs text-gray-700 font-medium"
                      >
                        <PlusIcon className="w-3 h-3 shrink-0" />
                        {extra}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
          <h2 className="text-base font-semibold text-gray-900 px-5 pt-5 pb-2">
            Compare plans
          </h2>
          <p className="text-sm text-gray-500 px-5 pb-4">
            See how plans differ by feature and price.
          </p>
          <div className="border-t border-gray-200">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 bg-gray-50/80">
              <input
                type="checkbox"
                id="only-differences"
                checked={onlyDifferences}
                onChange={(e) => setOnlyDifferences(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30"
              />
              <label htmlFor="only-differences" className="text-sm font-medium text-gray-900 cursor-pointer">
                Only show differences
              </label>
            </div>

            <div className="grid grid-cols-5">
              <div className="border-r border-gray-200" />
              {plans.map((plan) => (
                <div
                  key={`compare-header-${plan.name}`}
                  className="p-3 border-r border-gray-200 last:border-r-0 flex flex-col gap-1"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {plan.name}
                  </p>
                  {plan.badge && (
                    <p className="text-xs text-gray-500 font-medium">
                      {plan.badge}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200">
              <CompareRow
                label="Pay monthly"
                values={['₹1,994 INR/mo', '₹7,447 INR/mo', '₹30,164 INR/mo', 'Starting at ₹175,000 INR/mo on a 3-year term']}
              />
              <CompareRow
                label="Pay yearly (Save up to 25%)"
                values={['₹1,499 INR/mo', '₹5,599 INR/mo', '₹22,680 INR/mo', '—']}
              />
            </div>
            <div className="text-center py-4 border-t border-gray-200">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                See all features
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
          <h2 className="text-base font-semibold text-gray-900 px-5 pt-5 pb-2">
            More ways to sell
          </h2>
          <p className="text-sm text-gray-500 px-5 pb-4">
            Add Retail or POS Pro for in-person selling.
          </p>
          <div className="border-t border-gray-200 flex flex-col md:flex-row">
            <div className="flex-1 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Retail
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                For selling at retail stores
              </p>
              <p className="text-sm text-gray-400 line-through font-medium mb-0.5">
                ₹7,000
              </p>
              <div className="flex items-baseline gap-1 flex-wrap mb-4">
                <span className="text-xl font-semibold text-gray-900">
                  ₹20
                </span>
                <span className="text-sm text-gray-600">
                  INR/month for first 3 months
                </span>
              </div>
              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Select Retail
              </button>
            </div>
            <div className="flex-1 p-5 border-t md:border-t-0 md:border-l border-gray-200">
              <p className="text-base font-semibold text-gray-900 mb-1">
                Card rates starting at
              </p>
              <p className="text-sm text-gray-500 mb-3">
                2% 3rd-party payment providers
              </p>
              <p className="text-sm font-medium text-gray-900 mb-2">
                Standout features
              </p>
              {[
                'Sell in person with POS Pro (1 location included)',
                '10 inventory locations',
                'Unlimited POS staff with roles & permissions',
                'Inventory management',
                'Rich customer profiles and insights',
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-xs text-gray-900 mb-1"
                >
                  <CheckIcon className="w-3 h-3 shrink-0" />
                  <span className={feature.includes('Unlimited') ? 'font-medium' : ''}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqSections.map((section) => (
              <div
                key={section.title}
                className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden"
              >
                <h3 className="text-base font-semibold text-gray-900 px-5 pt-4 pb-2">
                  {section.title}
                </h3>
                {section.questions.map((question, index) => {
                  const key = `${section.title}-${question}`;
                  const isExpanded = expandedFaqs[key];
                  return (
                    <div
                      key={question}
                      className={`border-t ${index === 0 ? 'border-gray-100' : 'border-gray-200'}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(section.title, question)}
                        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50/80 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {question}
                        </span>
                        <ChevronDownIcon
                          className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-4">
                          <p className="text-sm text-gray-500">
                            This is placeholder text for the answer. You can update it with actual FAQ
                            content later.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CompareRow: React.FC<{ label: string; values: string[] }> = ({ label, values }) => (
  <div className="grid grid-cols-5 border-b border-gray-200">
    <div className="border-r border-gray-200 p-3 bg-gray-50 font-medium text-sm text-gray-900">
      {label}
    </div>
    {values.map((value, index) => (
      <div
        key={`${label}-${index}`}
        className={`border-r border-gray-200 p-3 text-sm text-gray-900 font-medium ${
          index === values.length - 1 ? 'border-r-0' : ''
        }`}
      >
        {value}
      </div>
    ))}
  </div>
);

export default PlanSelectPage;
