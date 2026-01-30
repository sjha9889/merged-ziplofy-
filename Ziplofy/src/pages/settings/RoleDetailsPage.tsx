import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import { usePermissions } from '../../contexts/permissions.context';
import { useStoreRoles } from '../../contexts/store-roles.context';
import { useStore } from '../../contexts/store.context';
import toast from 'react-hot-toast';

interface PermissionTreeNode {
  key: string;
  name: string;
  isLeaf: boolean;
  parentKey?: string | null;
  order?: number;
  resource?: string;
  children: PermissionTreeNode[];
}

const RoleDetailsPage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const { permissions, loading, error, fetchAll } = usePermissions();
  const { roles, fetchByStoreId, update } = useStoreRoles();
  const { activeStoreId } = useStore();

  const role = useMemo(() => roles.find((r) => r._id === roleId), [roles, roleId]);

  useEffect(() => {
    if (permissions.length === 0 && !loading) {
      fetchAll().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!role && activeStoreId) {
      fetchByStoreId(activeStoreId).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStoreId, role]);

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedLeafKeys, setSelectedLeafKeys] = useState<Set<string>>(new Set());
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!role) return;
    setRoleName(role.name || '');
    setRoleDescription(role.description || '');
    setSelectedLeafKeys(new Set(role.permissions || []));
  }, [role]);

  const tree = useMemo<PermissionTreeNode[]>(() => {
    const nodes = new Map<string, PermissionTreeNode>();
    permissions.forEach((p) => {
      nodes.set(p.key, {
        key: p.key,
        name: p.name,
        isLeaf: p.isLeaf ?? true,
        parentKey: p.parentKey ?? null,
        order: p.order,
        resource: p.resource,
        children: [],
      });
    });
    const roots: PermissionTreeNode[] = [];
    nodes.forEach((node) => {
      if (node.parentKey && nodes.has(node.parentKey)) {
        nodes.get(node.parentKey)!.children.push(node);
      } else {
        roots.push(node);
      }
    });
    const sortChildren = (arr: PermissionTreeNode[]) => {
      arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name));
      arr.forEach((child) => sortChildren(child.children));
    };
    sortChildren(roots);
    return roots;
  }, [permissions]);

  const allLeafKeys = useMemo(() => {
    const keys: string[] = [];
    const collect = (node: PermissionTreeNode) => {
      if (node.isLeaf || node.children.length === 0) {
        keys.push(node.key);
      } else {
        node.children.forEach(collect);
      }
    };
    tree.forEach(collect);
    return keys;
  }, [tree]);

  useEffect(() => {
    if (!allLeafKeys.length) return;
    const validSet = new Set(allLeafKeys);
    setSelectedLeafKeys((prev) => {
      const next = new Set<string>();
      prev.forEach((key) => {
        if (validSet.has(key)) {
          next.add(key);
        }
      });
      return next;
    });
  }, [allLeafKeys]);

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const getDescendantLeafKeys = (node: PermissionTreeNode): string[] => {
    if (node.isLeaf || node.children.length === 0) {
      return [node.key];
    }
    return node.children.flatMap(getDescendantLeafKeys);
  };

  const getLeafCounts = (node: PermissionTreeNode) => {
    const leaves = getDescendantLeafKeys(node);
    const selected = leaves.filter((key) => selectedLeafKeys.has(key));
    return {
      total: leaves.length,
      selected: selected.length,
      checked: selected.length === leaves.length && leaves.length > 0,
      indeterminate: selected.length > 0 && selected.length < leaves.length,
    };
  };

  const toggleNodeSelection = (node: PermissionTreeNode) => {
    const leafKeys = getDescendantLeafKeys(node);
    setSelectedLeafKeys((prev) => {
      const next = new Set(prev);
      const allSelected = leafKeys.every((key) => next.has(key));
      if (allSelected) {
        leafKeys.forEach((key) => next.delete(key));
      } else {
        leafKeys.forEach((key) => next.add(key));
      }
      return next;
    });
  };

  const filteredTree = useMemo(() => {
    const treeRoots = tree;
    if (!searchTerm.trim()) return treeRoots;
    const term = searchTerm.toLowerCase();
    const filterNode = (node: PermissionTreeNode): PermissionTreeNode | null => {
      const matches = node.name.toLowerCase().includes(term) || node.key.toLowerCase().includes(term);
      const filteredChildren = node.children
        .map(filterNode)
        .filter((child): child is PermissionTreeNode => Boolean(child));
      if (matches || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    };
    return treeRoots
      .map(filterNode)
      .filter((node): node is PermissionTreeNode => Boolean(node));
  }, [tree, searchTerm]);

  const selectedLeafArray = useMemo(() => Array.from(selectedLeafKeys).sort(), [selectedLeafKeys]);
  const originalLeafArray = useMemo(
    () => (role ? [...(role.permissions || [])].sort() : []),
    [role]
  );

  const isDirty = useMemo(() => {
    if (!role) return false;
    const nameChanged = roleName.trim() !== (role.name || '');
    const descriptionChanged = roleDescription.trim() !== (role.description || '');
    const permissionsChanged =
      selectedLeafArray.length !== originalLeafArray.length ||
      selectedLeafArray.some((key, index) => key !== originalLeafArray[index]);
    return nameChanged || descriptionChanged || permissionsChanged;
  }, [role, roleName, roleDescription, originalLeafArray, selectedLeafArray]);

  const handleSave = useCallback(async () => {
    if (!role || !roleId) return;
    const trimmedName = roleName.trim();
    const trimmedDescription = roleDescription.trim();
    if (!trimmedName) {
      toast.dismiss();
      toast.error('Role name is required');
      return;
    }
    if (selectedLeafKeys.size === 0) {
      toast.dismiss();
      toast.error('Select at least one permission');
      return;
    }
    try {
      setSaving(true);
      toast.dismiss();
      await update(roleId, {
        name: trimmedName,
        description: trimmedDescription,
        permissions: Array.from(selectedLeafKeys),
      });
      toast.dismiss();
      toast.success('Role updated');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update role';
      toast.dismiss();
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }, [role, roleId, roleName, roleDescription, selectedLeafKeys, update]);

  const renderNode = (node: PermissionTreeNode, depth = 0): React.ReactNode => {
    const hasChildren = node.children.length > 0;
    const state = getLeafCounts(node);
    const expanded = expandedKeys.has(node.key) || !hasChildren;
    const indent = depth * 1.5;

    return (
      <div key={node.key}>
        <div
          className="flex items-center py-1.5"
          style={{ paddingLeft: `${indent}rem` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(node.key)}
              className="p-0.5 text-gray-600 hover:text-gray-700 mr-1"
            >
              {expanded ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-6 mr-1" />
          )}
          <input
            type="checkbox"
            ref={(input) => {
              if (input) {
                input.indeterminate = !state.checked && state.indeterminate;
              }
            }}
            checked={state.checked}
            onChange={() => toggleNodeSelection(node)}
            className="w-4 h-4 text-gray-900 focus:ring-gray-400 mr-2"
          />
          <span className="text-sm text-gray-900">
            {node.name}
          </span>
          {hasChildren && (
            <span className="text-xs text-gray-600 ml-auto mr-2">
              {state.selected}/{state.total}
            </span>
          )}
        </div>
        {hasChildren && (
          <div className={expanded ? 'block' : 'hidden'}>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-medium text-gray-900">{roleName || 'Role'}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/settings/users/roles')}
              className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to roles
            </button>
            <button
              disabled={!isDirty || selectedLeafKeys.size === 0 || !role || saving}
              onClick={handleSave}
              className="px-3 py-1.5 text-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* Role meta form */}
        <div className="border border-gray-200 bg-white p-4 mb-4">
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Name</label>
              <input
                type="text"
                value={roleName}
                onChange={(event) => setRoleName(event.target.value)}
                className="w-full border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Description</label>
              <textarea
                rows={2}
                value={roleDescription}
                onChange={(event) => setRoleDescription(event.target.value)}
                className="w-full border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-y"
              />
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="border border-gray-200 bg-white p-4">
          <h2 className="text-base font-medium text-gray-900 mb-1">Permissions</h2>
          <p className="text-xs text-gray-600 mb-3">
            Selected permissions for this role.
          </p>
          {loading && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              <span className="text-sm">Loading permissions…</span>
            </div>
          )}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}
          {!loading && !error && (
            <div className="flex flex-col gap-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 pl-10 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                />
              </div>
              <div>{filteredTree.map((node) => renderNode(node))}</div>
            </div>
          )}
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default RoleDetailsPage;
