import React, { useState } from 'react';
import { UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';

interface User {
  _id: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: string;
}

const UsersPage: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // Mock data - replace with actual data fetching
  const users: User[] = [
    {
      _id: '1',
      email: 'developer200419@gmail.com',
      status: 'active',
      role: 'Store owner',
    },
  ];

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedUsers(new Set(users.map((u) => u._id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const isAllSelected = users.length > 0 && selectedUsers.size === users.length;
  const isIndeterminate = selectedUsers.size > 0 && selectedUsers.size < users.length;

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5 text-gray-900" />
            <h1 className="text-xl font-medium text-gray-900">Users</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
              Export
            </button>
            <button className="px-3 py-1.5 text-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors">
              Add users
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="border border-gray-200 bg-white overflow-hidden">
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
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-gray-900 focus:ring-gray-400"
                    />
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-900">User</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-900">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        className="w-4 h-4 text-gray-900 focus:ring-gray-400"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-sm text-gray-900 truncate max-w-[300px]">
                        {user.email}
                      </p>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700">
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <ShieldCheckIcon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-900">{user.role}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // Handle learn more click
            }}
            className="text-xs text-gray-700 hover:underline"
          >
            Learn more about users
          </a>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default UsersPage;
