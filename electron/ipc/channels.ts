export const IPC_CHANNELS = {
  // Bookmarks
  BOOKMARKS_GET_ALL: "bookmarks:getAll",
  BOOKMARKS_GET_BY_ID: "bookmarks:getById",
  BOOKMARKS_CREATE: "bookmarks:create",
  BOOKMARKS_UPDATE: "bookmarks:update",
  BOOKMARKS_DELETE: "bookmarks:delete",

  // Categories
  CATEGORIES_GET_ALL: "categories:getAll",
  CATEGORIES_GET_BY_ID: "categories:getById",
  CATEGORIES_CREATE: "categories:create",
  CATEGORIES_UPDATE: "categories:update",
  CATEGORIES_DELETE: "categories:delete",
  CATEGORIES_REORDER: "categories:reorder",

  // Tags
  TAGS_GET_ALL: "tags:getAll",
  TAGS_GET_BY_ID: "tags:getById",
  TAGS_CREATE: "tags:create",
  TAGS_UPDATE: "tags:update",
  TAGS_DELETE: "tags:delete",
  TAGS_GET_BY_BOOKMARK: "tags:getByBookmark",

  // Settings
  SETTINGS_GET: "settings:get",
  SETTINGS_SAVE: "settings:save",

  // Migrate
  MIGRATE_DATA: "migrate:fromLocalStorage",

  // NARA
  nara: {
    search: "nara:search",
    getFull: "nara:getFull",
    getChildren: "nara:getChildren",
  },
} as const;
