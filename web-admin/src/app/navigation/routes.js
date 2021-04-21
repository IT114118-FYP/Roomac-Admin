const routes = {
  HOME: "/home",
  categories: {
    MANAGE: "/categories",
    NEW: "/categories/new",
    DETAILED: "/categories/:id",
  },
  resources: {
    MANAGE: "/resources",
    NEW: "/resources/new",
    DETAILED: "/resources/:id",
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
  bookings: {
    MANAGE: "/bookings",
    DETAILED: "/bookings/:id",
    NEW: "/bookings/new",
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
    bookings: ":bookings",
  },
};

export const permissionTags = {
  [routes.users.NEW]: TAG.CRUD.CREATE + TAG.routes.users,
  [routes.users.MANAGE]: TAG.CRUD.READ + TAG.routes.users,
  [routes.users.DETAILED]: TAG.CRUD.CREATE + TAG.routes.users,
};

export default routes;
