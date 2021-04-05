const routes = {
  HOME: "/home",
  categories: {
    MANAGEC: "/categories",
    MANAGE: "/categories/:id",
    NEW: "/categories/new",
    DETAILED: "/categories/resource/:id",
    NEWR: "/categories/:id/new",
  },
  users: {
    MANAGE: "/users",
    NEW: "/users/new",
    DETAILED: "/users/:id",
  },
  programs: {
    MANAGE: "/programs",
    DETAILED: "/programs/:id",
    NEW: "/programs/new",
  },
  branches: {
    MANAGE: "/branches",
    DETAILED: "/branches/:id",
    NEW: "/branches/new",
  },
  tos: {
    MANAGE: "/tos",
    DETAILED: "/tos/:id",
    NEW: "/tos/new",
  },
};

export const TAG = {
  CRUD: {
    UPDATE: "update",
    DELETE: "delete",
    CREATE: "create",
    READ: "read",
    GRANT: "grant",
    REVOKE: "revoke",
  },
  routes: {
    categories: ":categories",
    programs: ":programs",
    users: ":users",
    branches: ":branches",
    roles: ":roles",
    tos: ":tos",
    resources: ":resources",
    permissions: ":permissions",
  },
};

export const permissionTags = {
  [routes.users.NEW]: TAG.CRUD.CREATE + TAG.routes.users,
  [routes.users.MANAGE]: TAG.CRUD.READ + TAG.routes.users,
  [routes.users.DETAILED]: TAG.CRUD.CREATE + TAG.routes.users,
};

export default routes;
