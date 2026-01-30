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
        // Fetch user's role with permissions
        const response = await axios.get('/auth/me');
        const userData = response.data.data || response.data;
        
        console.log('🔍 User data from /auth/me:', userData);
        console.log('🔍 User role:', userData.role);
        console.log('🔍 User role type:', typeof userData.role);
        
        // Check if role is a string (role name) or object (role with permissions)
        if (typeof userData.role === 'string') {
          console.log('🔍 Role is a string (role name):', userData.role);
          // If role is just a string, we need to fetch the full role data
          // For now, let's assume super-admin has all permissions
          if (userData.role === 'super-admin' || userData.superAdmin) {
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
          } else {
            console.log('🔍 Non-super-admin user, need to fetch role permissions from backend');
            // For non-super-admin users, we need to fetch the role permissions
            try {
              const roleResponse = await axios.get('/roles');
              console.log('🔍 Fetched roles:', roleResponse.data);
              
              if (roleResponse.data.success && roleResponse.data.data) {
                const userRole = roleResponse.data.data.find((role: any) => role.name === userData.role);
                console.log('🔍 Found user role:', userRole);
                
                if (userRole && userRole.permissions) {
                  const userPermissions: UserPermissions = {};
                  
                  userRole.permissions.forEach((permission: any) => {
                    console.log('🔍 Processing role permission:', permission);
                    userPermissions[permission.section] = {
                      permissions: permission.permissions || [],
                      subsections: permission.subsections?.reduce((acc: any, sub: any) => {
                        acc[sub.subsection] = sub.permissions || [];
                        return acc;
                      }, {})
                    };
                  });
                  
                  console.log('🔍 Processed role permissions:', userPermissions);
                  setPermissions(userPermissions);
                } else {
                  console.log('🔍 No permissions found for role');
                  setPermissions({});
                }
              } else {
                console.log('🔍 Failed to fetch roles');
                setPermissions({});
              }
            } catch (roleError) {
              console.error('Error fetching role permissions:', roleError);
              setPermissions({});
            }
          }
        } else if (userData.role && userData.role.permissions) {
          console.log('🔍 Role is an object with permissions:', userData.role.permissions);
          const userPermissions: UserPermissions = {};
          
          userData.role.permissions.forEach((permission: any) => {
            console.log('🔍 Processing permission:', permission);
            userPermissions[permission.section] = {
              permissions: permission.permissions || [],
              subsections: permission.subsections?.reduce((acc: any, sub: any) => {
                acc[sub.subsection] = sub.permissions || [];
                return acc;
              }, {})
            };
          });
          
          console.log('🔍 Processed user permissions:', userPermissions);
          setPermissions(userPermissions);
        } else {
          console.log('🔍 No role permissions found, userData.role:', userData.role);
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
        console.log(`🔍 No subsection permissions found for: ${subsection}`);
        return false;
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
        console.log(`🔍 No subsection permissions found for: ${subsection}`);
        return false;
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
