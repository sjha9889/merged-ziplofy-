import React, { useEffect } from 'react';
import { PlusIcon, ArrowUpTrayIcon, MagnifyingGlassIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import { useStoreRoles } from '../../contexts/store-roles.context';
import { useStore } from '../../contexts/store.context';

type RoleRow = {
  id: string;
  name: string;
  users: number;
};

const RolesPage: React.FC = () => {
  const navigate = useNavigate();
  const { roles, loading, fetchByStoreId } = useStoreRoles();
  const { activeStoreId } = useStore();
  const rows: RoleRow[] = React.useMemo(
    () => roles.map((r) => ({ id: r._id, name: r.name, users: 0 })),
    [roles]
  );
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeStoreId) {
      fetchByStoreId(activeStoreId).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStoreId]);

  const toggleRow = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const allSelected = rows.every((r) => selected[r.id]);
    const next: Record<string, boolean> = {};
    rows.forEach((r) => {
      next[r.id] = !allSelected;
    });
    setSelected(next);
  };

  const selectedCount = rows.filter((r) => selected[r.id]).length;
  const isAllSelected = rows.length > 0 && selectedCount === rows.length;
  const isIndeterminate = rows.length > 0 && selectedCount > 0 && selectedCount < rows.length;

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-medium text-gray-900">Roles</h1>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <ArrowUpTrayIcon className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => navigate('/settings/users/roles/new')}
              className="px-3 py-1.5 text-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors flex items-center gap-1.5"
            >
              <PlusIcon className="w-4 h-4" />
              Add role
            </button>
          </div>
        </div>

        <div className="border border-gray-200 bg-white">
          <div className="flex items-center gap-2 p-3">
            <button className="px-3 py-1 text-xs border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
              All
            </button>
            <div className="flex-1" />
            <button className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition-colors">
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition-colors">
              <ArrowsUpDownIcon className="w-4 h-4" />
            </button>
          </div>
          <hr className="border-gray-200" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="w-12 px-3 py-2 text-left">
                    <input
                      type="checkbox"
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = isIndeterminate;
                        }
                      }}
                      checked={isAllSelected}
                      onChange={toggleAll}
                      className="w-4 h-4 text-gray-900 focus:ring-gray-400"
                      aria-label="select all roles"
                    />
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-900">Name</th>
                  <th className="px-3 py-2 text-right text-sm font-medium text-gray-900">Users</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-sm text-gray-600 text-center">
                      Loading...
                    </td>
                  </tr>
                )}
                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-sm text-gray-600 text-center">
                      Currently you have no roles added.
                    </td>
                  </tr>
                )}
                {!loading &&
                  rows.length > 0 &&
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/settings/users/roles/${row.id}`)}
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(selected[row.id])}
                          onChange={() => toggleRow(row.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 text-gray-900 focus:ring-gray-400"
                          aria-label={`select role ${row.name}`}
                        />
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900">{row.name}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right">{row.users}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 text-center border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Learn more about <a href="#" className="text-gray-700 hover:underline">roles</a>
            </p>
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default RolesPage;
