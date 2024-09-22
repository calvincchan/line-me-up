export const Permission = [
  "dashboard:list",
  "member:list",
  "member:create",
  "member:edit",
  "member:delete",
] as const;

export type Permission = (typeof Permission)[number];

const DEFAULT_PERMISSION_TABLE = new Map<string, Set<Permission>>([
  ["Owner", new Set<Permission>([...Permission])],
  [
    "Admin",
    new Set([
      "dashboard:list",
      "member:list",
      "member:create",
      "member:edit",
      "member:delete",
    ]),
  ],
  [
    "Staff",
    new Set([
      "dashboard:list",
    ]),
  ],
]);

export class AccessControl {
  async can(role: string, resource: string, action: string) {
    console.log("🚀 ~ AccessControl ~ can", action, resource, role);
    const allowed = DEFAULT_PERMISSION_TABLE.get(role);
    if (!allowed) {
      throw new Error(`Role "${role}" is not defined`);
    }
    const key = resource + ":" + action as Permission;
    if (allowed.has(key)) {
      return true;
    } else {
      return false;
    }
  }
}

export const acl = new AccessControl();
