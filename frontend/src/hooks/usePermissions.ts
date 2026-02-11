import { useAdminAuth } from '../contexts/admin-auth.context';
import { useState, useEffect } from 'react';
import axios from '../config/axios';

interface UserPermissions {
  [section: string]: {
    permissions: string[];
    subsections?: {
      [subsection: string]: string[];
    };
  };
}

export const usePermissions = () => {
  const { user } = useAdminAuth();
  const [permissions, setPermissions] = useState<UserPermissions>({});
  const [loading, setLoading] = useState(true);

  // Debug user data from useAdminAuth
  console.log('🔍 usePermissions - user from useAdminAuth:', user);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!user) {
        console.log('🔍 No user found, setting loading to false');
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching permissions for user:', user);

      try {
        // Fetch user's role with permissions - backend now includes roleWithPermissions for uniform resolution
        const response = await axios.get('/auth/me');
        const userData = response.data.data || response.data;
        
        console.log('🔍 User data from /auth/me:', userData);
        console.log('🔍 User role:', userData.role);
        console.log('🔍 Role with permissions:', userData.roleWithPermissions ? 'present' : 'absent');
        
        // Helper to convert role permissions to UserPermissions format
        const buildPermissionsFromRole = (rolePermissions: any[]): UserPermissions => {
          const userPermissions: UserPermissions = {};
          if (!Array.isArray(rolePermissions)) return userPermissions;
          rolePermissions.forEach((permission: any) => {
            if (permission?.section) {
              userPermissions[permission.section] = {
                permissions: permission.permissions || [],
                subsections: permission.subsections?.reduce((acc: any, sub: any) => {
                  if (sub?.subsection) acc[sub.subsection] = sub.permissions || [];
                  return acc;
                }, {} as Record<string, string[]>)
              };
            }
          });
          return userPermissions;
        };
        
        // Priority 1: Super-admin has all permissions (check before roleWithPermissions since super-admin role may have empty permissions)
        if (userData.role === 'super-admin' || userData.superAdmin || userData.roleWithPermissions?.isSuperAdmin) {
          console.log('🔍 Super admin detected, granting all permissions');
          const allPermissions: UserPermissions = {
            "Client List": { permissions: ["view", "edit", "upload"] },
            "Payment": { permissions: ["view", "edit", "upload"] },
            "Invoice": { permissions: ["view", "edit", "upload"] },
            "User Management": { 
              permissions: ["view", "edit", "upload"],
              subsections: {
                "Manage User": ["view", "edit", "upload"],
                "Roles and Permission": ["view", "edit", "upload"]
              }
            },
            "Membership": { 
              permissions: ["view", "edit", "upload"],
              subsections: {
                "Membership Plan": ["view", "edit", "upload"]
              }
            },
            "Developer": { 
              permissions: ["view", "edit", "upload"],
              subsections: {
                "Dev Admin": ["view", "edit", "upload"],
                "Theme Developer": ["view", "edit", "upload"],
                "Support Developer": ["view", "edit", "upload"],
                "Hire Developer Requests": ["view", "edit", "upload"]
              }
            },
            "Support": { 
              permissions: ["view", "edit", "upload"],
              subsections: {
                "Domain": ["view", "edit", "upload"],
                "Ticket": ["view", "edit", "upload"],
                "Raise Task": ["view", "edit", "upload"],
                "Live Support": ["view", "edit", "upload"]
              }
            }
          };
          setPermissions(allPermissions);
          return;
        }
        
        // Priority 2: Use roleWithPermissions from /auth/me (single source of truth for non-super-admin)
        if (userData.roleWithPermissions?.permissions && Array.isArray(userData.roleWithPermissions.permissions)) {
          console.log('🔍 Using roleWithPermissions from /auth/me');
          const perms = buildPermissionsFromRole(userData.roleWithPermissions.permissions);
          console.log('🔍 Processed permissions:', perms);
          setPermissions(perms);
          return;
        }
        
        // Priority 3: Fallback - fetch /roles and find user's role by name (legacy)
        console.log('🔍 Fallback: fetching role permissions from /roles');
        try {
          const roleResponse = await axios.get('/roles', { params: { limit: 100 } });
          if (roleResponse.data.success && roleResponse.data.data) {
            const userRole = roleResponse.data.data.find((r: any) => r.name === userData.role);
            if (userRole?.permissions) {
              setPermissions(buildPermissionsFromRole(userRole.permissions));
            } else {
              setPermissions({});
            }
          } else {
            setPermissions({});
          }
        } catch (roleError) {
          console.error('Error fetching role permissions:', roleError);
          setPermissions({});
        }
      } catch (error) {
        console.error('Error fetching user permissions:', error);
        // Fallback: if user is super-admin, grant all permissions
        if (user.roleName === 'super-admin' || localStorage.getItem('isSuperAdmin') === 'true') {
          console.log('🔍 Fallback: Super admin detected, granting all permissions');
          const allPermissions: UserPermissions = {
            "Client List": { permissions: ["view", "edit", "upload"] },
            "Payment": { permissions: ["view", "edit", "upload"] },
            "Invoice": { permissions: ["view", "edit", "upload"] },
            "User Management": { 
              permissions: ["view", "edit", "upload"],
              subsections: {
                "Manage User": ["view", "edit", "upload"],
                "Roles and Permission": ["view", "edit", "upload"]
              }
            },
            "Membership": { 
              permissions: ["view", "edit", "upload"],
              subsections: {
                "Membership Plan": ["view", "edit", "upload"]
              }
            },
            "Developer": { 
              permissions: ["view", "edit", "upload"],
              subsections: {
                "Dev Admin": ["view", "edit", "upload"],
                "Theme Developer": ["view", "edit", "upload"],
                "Support Developer": ["view", "edit", "upload"],
                "Hire Developer Requests": ["view", "edit", "upload"]
              }
            },
            "Support": { 
              permissions: ["view", "edit", "upload"],
              subsections: {
                "Domain": ["view", "edit", "upload"],
                "Ticket": ["view", "edit", "upload"],
                "Raise Task": ["view", "edit", "upload"],
                "Live Support": ["view", "edit", "upload"]
              }
            }
          };
          setPermissions(allPermissions);
        } else {
          setPermissions({});
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserPermissions();
  }, [user]);

  // Check if user has view permission for a section
  const hasViewPermission = (section: string, subsection?: string): boolean => {
    if (!user) {
      console.log(`🔍 No user found for section: ${section}`);
      return false;
    }

    // Super admin has all permissions
    if (user.roleName === 'super-admin' || localStorage.getItem('isSuperAdmin') === 'true') {
      console.log(`🔍 Super admin has view permission for: ${section}`);
      return true;
    }

    const sectionPermissions = permissions[section];
    console.log(`🔍 Checking view permission for ${section}:`, sectionPermissions);

    if (!sectionPermissions) {
      console.log(`🔍 No permissions found for section: ${section}`);
      return false;
    }

    // If checking subsection permission
    if (subsection) {
      const subsectionPermissions = sectionPermissions.subsections?.[subsection];
      console.log(`🔍 Checking subsection ${subsection} permissions:`, subsectionPermissions);

      if (!subsectionPermissions) {
        console.log(`🔍 No subsection permissions found for: ${subsection}. Falling back to section-level view permission.`);
        const fallback = sectionPermissions.permissions.includes('view') ||
                         sectionPermissions.permissions.includes('edit') ||
                         sectionPermissions.permissions.includes('upload');
        return fallback;
      }

      // If user has edit or upload permission, they automatically have view permission
      const hasPermission = subsectionPermissions.includes('view') ||
             subsectionPermissions.includes('edit') ||
             subsectionPermissions.includes('upload');
      console.log(`🔍 Subsection ${subsection} has view permission:`, hasPermission);
      return hasPermission;
    }

    // Check section-level permission
    // If user has edit or upload permission, they automatically have view permission
    const hasPermission = sectionPermissions.permissions.includes('view') ||
           sectionPermissions.permissions.includes('edit') ||
           sectionPermissions.permissions.includes('upload');
    console.log(`🔍 Section ${section} has view permission:`, hasPermission);
    return hasPermission;
  };

  const hasEditPermission = (section: string, subsection?: string): boolean => {
    if (!user) {
      console.log(`🔍 No user found for section: ${section}`);
      return false;
    }

    // Super admin has all permissions
    if (user.roleName === 'super-admin' || localStorage.getItem('isSuperAdmin') === 'true') {
      console.log(`🔍 Super admin has edit permission for: ${section}`);
      return true;
    }

    const sectionPermissions = permissions[section];
    console.log(`🔍 Checking edit permission for ${section}:`, sectionPermissions);

    if (!sectionPermissions) {
      console.log(`🔍 No permissions found for section: ${section}`);
      return false;
    }

    // If checking subsection permission
    if (subsection) {
      const subsectionPermissions = sectionPermissions.subsections?.[subsection];
      console.log(`🔍 Checking subsection ${subsection} edit permissions:`, subsectionPermissions);

      if (!subsectionPermissions) {
        console.log(`🔍 No subsection edit permissions found for: ${subsection}. Falling back to section-level edit permission.`);
        const fallback = sectionPermissions.permissions.includes('edit');
        return fallback;
      }

      const hasPermission = subsectionPermissions.includes('edit');
      console.log(`🔍 Subsection ${subsection} has edit permission:`, hasPermission);
      return hasPermission;
    }

    // Check section-level permission
    const hasPermission = sectionPermissions.permissions.includes('edit');
    console.log(`🔍 Section ${section} has edit permission:`, hasPermission);
    return hasPermission;
  };

  const hasUploadPermission = (section: string, subsection?: string): boolean => {
    if (!user) {
      console.log(`🔍 No user found for section: ${section}`);
      return false;
    }

    // Super admin has all permissions
    if (user.roleName === 'super-admin' || localStorage.getItem('isSuperAdmin') === 'true') {
      console.log(`🔍 Super admin has upload permission for: ${section}`);
      return true;
    }

    const sectionPermissions = permissions[section];
    console.log(`🔍 Checking upload permission for ${section}:`, sectionPermissions);

    if (!sectionPermissions) {
      console.log(`🔍 No permissions found for section: ${section}`);
      return false;
    }

    // If checking subsection permission
    if (subsection) {
      const subsectionPermissions = sectionPermissions.subsections?.[subsection];
      console.log(`🔍 Checking subsection ${subsection} upload permissions:`, subsectionPermissions);

      if (!subsectionPermissions) {
        console.log(`🔍 No subsection permissions found for: ${subsection}`);
        // Fallback: allow if section-level upload is granted
        const fallback = sectionPermissions.permissions.includes('upload');
        console.log(`🔍 Fallback to section-level upload:`, fallback);
        return fallback;
      }

      // Allow upload if either subsection OR section-level has upload
      const hasPermission = subsectionPermissions.includes('upload') || sectionPermissions.permissions.includes('upload');
      console.log(`🔍 Subsection ${subsection} has upload permission:`, hasPermission);
      return hasPermission;
    }

    // Check section-level permission
    const hasPermission = sectionPermissions.permissions.includes('upload');
    console.log(`🔍 Section ${section} has upload permission:`, hasPermission);
    return hasPermission;
  };

  // Comprehensive permission check for a specific section/subsection
  const getPermissionDetails = (section: string, subsection?: string) => {
    return {
      canView: hasViewPermission(section, subsection),
      canEdit: hasEditPermission(section, subsection),
      canUpload: hasUploadPermission(section, subsection),
      hasAnyPermission: hasViewPermission(section, subsection) || hasEditPermission(section, subsection) || hasUploadPermission(section, subsection)
    };
  };

  return {
    permissions,
    loading,
    hasViewPermission,
    hasEditPermission,
    hasUploadPermission,
    getPermissionDetails,
    user
  };
};
