import {
  ChevronRightIcon,
  CloudArrowDownIcon,
  CodeBracketIcon,
  LinkIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface ResourcesSectionProps {
  onOpenShortcutsModal: () => void;
}

export default function ResourcesSection({ onOpenShortcutsModal }: ResourcesSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium text-gray-900 mb-4">Resources</h2>

      <div className="mb-2">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors">
          <LinkIcon className="w-4 h-4 text-gray-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-900">Change log</p>
          </div>
          <button className="px-3 py-1.5 text-sm text-gray-900 border border-gray-200 hover:bg-gray-100 transition-colors">
            View change log
          </button>
        </div>
      </div>

      <hr className="my-2 border-gray-200" />

      <div className="mb-2">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors">
          <QuestionMarkCircleIcon className="w-4 h-4 text-gray-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-900">Ziplofy Help Center</p>
          </div>
          <button className="px-3 py-1.5 text-sm text-gray-900 border border-gray-200 hover:bg-gray-100 transition-colors">
            Get help
          </button>
        </div>
      </div>

      <hr className="my-2 border-gray-200" />

      <div className="mb-2">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors">
          <CodeBracketIcon className="w-4 h-4 text-gray-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-900">Hire a Ziplofy Partner</p>
          </div>
          <button className="px-3 py-1.5 text-sm text-gray-900 border border-gray-200 hover:bg-gray-100 transition-colors">
            Hire a Partner
          </button>
        </div>
      </div>

      <hr className="my-2 border-gray-200" />

      <div className="mb-2">
        <button
          onClick={onOpenShortcutsModal}
          className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors text-left"
        >
          <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6H18m0 0h.75m-.75 3h.75m-.75 3h.75M9.813 15v4.687c0 .414.336.75.75.75h4.125a.75.75 0 00.75-.75V15m0 0h-3.375M9.813 15h3.375m0 0H21M9.813 9.813H5.25a2.25 2.25 0 00-2.25 2.25v7.5c0 1.036.84 1.875 1.875 1.875h15.75c1.035 0 1.875-.84 1.875-1.875v-7.5a2.25 2.25 0 00-2.25-2.25h-4.563zM12.375 9.813V8.625c0-1.036-.84-1.875-1.875-1.875h-1.5c-1.036 0-1.875.84-1.875 1.875v1.188m7.5 0V8.625c0-1.036.84-1.875 1.875-1.875h1.5c1.035 0 1.875.84 1.875 1.875v1.188m-7.5 0h7.5" />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-gray-900">Keyboard shortcuts</p>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-gray-600 shrink-0" />
        </button>
      </div>

      <hr className="my-2 border-gray-200" />

      <div>
        <button
          onClick={() => navigate('/settings/general/activity')}
          className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors text-left"
        >
          <CloudArrowDownIcon className="w-4 h-4 text-gray-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-900">Store activity log</p>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-gray-600 shrink-0" />
        </button>
      </div>
    </div>
  );
}

