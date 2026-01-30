import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BellIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import { useNotificationOptions } from '../../contexts/notification-options.context';
import { useNotificationCategories } from '../../contexts/notification-categories.context';
import type { NotificationOption } from '../../contexts/notification-options.context';

interface NotificationSection {
  title: string;
  items: NotificationOption[];
}

const CustomerNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId, categorySlug } = useParams<{ categoryId: string; categorySlug: string }>();
  const { options, loading, fetchByCategoryId } = useNotificationOptions();
  const { categories, fetchAll: fetchCategories, loading: categoriesLoading } = useNotificationCategories();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const isCustomerCategory = categorySlug?.includes('customer');

  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      fetchCategories().catch(() => {
        // handled in context
      });
    }
  }, [categories.length, categoriesLoading, fetchCategories]);

  useEffect(() => {
    if (categoryId) {
      fetchByCategoryId(categoryId).catch(() => {
        // handled in context
      });
    }
  }, [categoryId, fetchByCategoryId]);

  useEffect(() => {
    if (!isCustomerCategory) {
      return;
    }
    const initialExpanded: { [key: string]: boolean } = {};
    const segments = new Set(options.map((opt) => opt.segment).filter(Boolean));
    segments.forEach((segment) => {
      if (segment) {
        initialExpanded[segment] = true;
      }
    });
    setExpandedSections(initialExpanded);
  }, [options, isCustomerCategory]);

  const categoryName = useMemo(() => {
    if (!categoryId) return 'Notifications';
    const match = categories.find((c) => c._id === categoryId);
    if (match?.name) return match.name;
    if (categorySlug) {
      return categorySlug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return 'Notifications';
  }, [categories, categoryId, categorySlug]);

  const groupedSections: NotificationSection[] = useMemo(() => {
    if (!isCustomerCategory) {
      return [];
    }
    const segmentMap = new Map<string, NotificationOption[]>();

    options.forEach((option) => {
      const segment = option.segment || 'other';
      if (!segmentMap.has(segment)) {
        segmentMap.set(segment, []);
      }
      segmentMap.get(segment)!.push(option);
    });

    const segmentNameMap: { [key: string]: string } = {
      orders: 'Order processing',
      localpickup: 'Local pick up',
      localdelivery: 'Local delivery',
      giftcards: 'Gift cards',
      storecredit: 'Store credit',
      orderexceptions: 'Order exceptions',
      payments: 'Payments',
      shippingupdated: 'Shipping updated',
      returns: 'Returns',
      accounts_and_outreach: 'Accounts and outreach',
      other: 'Other',
    };

    return Array.from(segmentMap.entries()).map(([segment, items]) => {
      let formattedTitle = segmentNameMap[segment] || segment;
      if (!segmentNameMap[segment]) {
        formattedTitle = segment.replace(/_/g, ' ');
        if (/[A-Z]/.test(formattedTitle)) {
          formattedTitle = formattedTitle
            .split(/(?=[A-Z])/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        }
        formattedTitle = formattedTitle
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }

      return {
        title: formattedTitle,
        items: items.sort((a, b) => a.optionName.localeCompare(b.optionName)),
      };
    });
  }, [options, isCustomerCategory]);

  const simpleOptions = useMemo(() => {
    if (isCustomerCategory) return [];
    return [...options].sort((a, b) => a.optionName.localeCompare(b.optionName));
  }, [options, isCustomerCategory]);

  const handleToggleSection = useCallback((sectionTitle: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  }, []);

  const buildOptionPath = (option: NotificationOption): string => {
    if (!categoryId || !categorySlug) {
      return '/settings/notifications';
    }
    return `/settings/notifications/${categoryId}/${categorySlug}/${option._id}`;
  };

  if (!categoryId) {
    return (
      <GridBackgroundWrapper>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <p className="text-sm text-gray-900">Notification category not found.</p>
        </div>
      </GridBackgroundWrapper>
    );
  }

  if (loading) {
    return (
      <GridBackgroundWrapper>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="flex justify-center mt-8">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </GridBackgroundWrapper>
    );
  }

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/settings/notifications')}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <BellIcon className="w-5 h-5" />
            </button>
            <ChevronRightIcon className="w-4 h-4 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-900">
              {categoryName}
            </h1>
          </div>
          {isCustomerCategory && (
            <button
              onClick={() => {
                navigate('/settings/notifications/customer/templates');
              }}
              className="px-3 py-1.5 border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Customize email templates
            </button>
          )}
        </div>

        {isCustomerCategory ? (
          groupedSections.length > 0 ? (
            <div className="border border-gray-200 p-4 bg-white/95">
              {groupedSections.map((section, sectionIndex) => {
                const sectionKey = section.title.toLowerCase().replace(/\s+/g, '');
                const isExpanded = expandedSections[sectionKey] ?? true;

                return (
                  <div key={sectionIndex} className={sectionIndex < groupedSections.length - 1 ? 'mb-4 pb-4 border-b border-gray-200' : ''}>
                    <button
                      onClick={() => handleToggleSection(sectionKey)}
                      className="w-full flex items-center justify-between py-2 hover:bg-transparent transition-colors"
                    >
                      <h2 className="text-sm font-medium text-gray-900 flex-1 text-left">
                        {section.title}
                      </h2>
                      {isExpanded ? (
                        <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                      )}
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pl-0 mt-2">
                        {section.items.map((item, itemIndex) => (
                          <div
                            key={item._id}
                            className={itemIndex < section.items.length - 1 ? 'mb-1 pb-1 border-b border-gray-100' : ''}
                          >
                            <button
                              onClick={() => navigate(buildOptionPath(item))}
                              className="w-full flex items-center justify-between py-2 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-900 mb-0.5">
                                  {item.optionName}
                                </p>
                                {item.optionDesc && (
                                  <p className="text-xs text-gray-600">{item.optionDesc}</p>
                                )}
                              </div>
                              <ChevronRightIcon className="w-4 h-4 text-gray-500 ml-3 shrink-0" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-gray-200 p-4 bg-white/95">
              <p className="text-xs text-gray-600">No notification options found.</p>
            </div>
          )
        ) : (
          <div className="border border-gray-200 p-4 bg-white/95">
            {simpleOptions.length > 0 ? (
              simpleOptions.map((item, index) => (
                <React.Fragment key={item._id}>
                  <button
                    onClick={() => navigate(buildOptionPath(item))}
                    className="w-full flex items-center justify-between py-2 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 mb-0.5">
                        {item.optionName}
                      </p>
                      {item.optionDesc && (
                        <p className="text-xs text-gray-600">{item.optionDesc}</p>
                      )}
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-500 ml-3 shrink-0" />
                  </button>
                  {index < simpleOptions.length - 1 && (
                    <div className="h-px bg-gray-200 my-2" />
                  )}
                </React.Fragment>
              ))
            ) : (
              <p className="text-xs text-gray-600">No notification options found.</p>
            )}
          </div>
        )}
      </div>
    </GridBackgroundWrapper>
  );
};

export default CustomerNotificationsPage;
