export const Permission = [
  "members:list",
  "members:create",
  "members:edit",
  "members:delete",
] as const;

export type Permission = (typeof Permission)[number];

const DEFAULT_PERMISSION_TABLE = new Map<string, Permission[]>([
  ["Owner", [...Permission]],
  [
    "Admin",
    ["members:list", "members:create", "members:edit", "members:delete"],
  ],
  ["Staff", []],
]);

export class AccessControl {
  allowed = new Set<string>();
  loaded: boolean = false;
  role: string = "";

  /* Load permission table of a given role */
  async load(role: string) {
    /* Prevent loading if the permission list is loaded */
    if (this.loaded) return true;
    /* Defer loading if role is not defined */
    if (role === "") {
      throw new Error(`Role "${role}" is not defined`);
    }
    this.role = role;
    const permissions = DEFAULT_PERMISSION_TABLE.get(role);
    if (!permissions) {
      throw new Error("Role not found in default permission table");
    }
    permissions.forEach((p) => {
      this.allowed.add(p);
    });
    this.loaded = true;
  }

  async can(role: string, resource: string, action: string) {
    if (role !== this.role) {
      this.loaded = false;
      this.load(role);
    }
    const key = resource + ":" + action;
    if (this.allowed.has(key)) {
      return true;
    } else {
      return false;
    }
  }
}

export const acl = new AccessControl();
