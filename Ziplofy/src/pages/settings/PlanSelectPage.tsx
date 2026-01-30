import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  CheckIcon,
  PlusIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';

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
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <button
          onClick={() => navigate('/settings/plan')}
          className="flex items-center gap-2 mb-4 px-3 py-1.5 text-sm text-gray-900 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-xl font-medium text-gray-900 mb-1">
          Pick your plan
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Everything you need to run your business
        </p>

        <div className="flex flex-col md:flex-row gap-3 justify-between mb-3 text-sm text-gray-700">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="border border-gray-200 bg-white p-4 flex flex-col relative"
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-900 border border-gray-200">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-base font-medium text-gray-900 mb-1">
                {plan.name}
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                {plan.description}
              </p>

              <div className="mb-3">
                {plan.oldPrice && (
                  <p className="text-sm text-gray-400 line-through font-medium mb-1">
                    {plan.oldPrice}
                  </p>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-medium text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-900">
                    {plan.unit}
                  </span>
                </div>
              </div>

              <button className="w-full px-3 py-1.5 text-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors mb-3">
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

        <div className="mt-6">
          <h2 className="text-base font-medium text-gray-900 mb-3">
            Compare plans
          </h2>
          <div className="border border-gray-200 bg-white overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200">
              <input
                type="checkbox"
                id="only-differences"
                checked={onlyDifferences}
                onChange={(e) => setOnlyDifferences(e.target.checked)}
                className="w-4 h-4 text-gray-900 focus:ring-gray-400"
              />
              <label htmlFor="only-differences" className="text-sm text-gray-900 font-medium cursor-pointer">
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
            <div className="text-center py-3 border-t border-gray-200">
              <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-900 border border-gray-200 hover:bg-gray-50 transition-colors">
                <PlusIcon className="w-4 h-4" />
                See all features
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-base font-medium text-gray-900 mb-3">
            More ways to sell
          </h2>
          <div className="border border-gray-200 bg-white flex flex-col md:flex-row overflow-hidden">
            <div className="flex-1 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Retail
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                For selling at retail stores
              </p>
              <p className="text-sm text-gray-400 line-through font-medium mb-1">
                ₹7,000
              </p>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-xl font-medium text-gray-900">
                  ₹20
                </span>
                <span className="text-sm text-gray-900">
                  INR/month for first 3 months
                </span>
              </div>
              <button className="px-3 py-1.5 text-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors">
                Select Retail
              </button>
            </div>
            <div className="flex-1 p-4 border-t md:border-t-0 md:border-l border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-1">
                Card rates starting at
              </p>
              <p className="text-xs text-gray-600 mb-3">
                2% 3rd-party payment providers
              </p>
              <p className="text-sm font-medium text-gray-900 mb-1">
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

        <div className="mt-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">
            Frequently asked questions
          </h2>
          {faqSections.map((section) => (
            <div
              key={section.title}
              className="border border-gray-200 bg-white mb-3 overflow-hidden"
            >
              <h3 className="text-sm font-medium text-gray-900 px-4 pt-3 pb-2">
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
                      onClick={() => toggleFaq(section.title, question)}
                      className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {question}
                      </span>
                      <ChevronDownIcon
                        className={`w-4 h-4 text-gray-600 transition-transform ${
                          isExpanded ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-3">
                        <p className="text-xs text-gray-600">
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
    </GridBackgroundWrapper>
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
