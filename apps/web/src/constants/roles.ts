export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  COLLEGE_ADMIN: "COLLEGE_ADMIN",
  DEPARTMENT_COORDINATOR: "DEPARTMENT_COORDINATOR",
  ACHIEVEMENT_COORDINATOR: "ACHIEVEMENT_COORDINATOR",
} as const;

export type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_OPTIONS = [
  {
    label: "Super Admin",
    value: USER_ROLES.SUPER_ADMIN,
  },
  {
    label: "College Admin",
    value: USER_ROLES.COLLEGE_ADMIN,
  },
  {
    label: "Department Coordinator",
    value: USER_ROLES.DEPARTMENT_COORDINATOR,
  },
  {
    label: "Achievement Coordinator",
    value: USER_ROLES.ACHIEVEMENT_COORDINATOR,
  },
];