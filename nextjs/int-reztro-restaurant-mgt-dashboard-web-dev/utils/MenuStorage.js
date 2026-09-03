import { menuDetails } from "@/data/MenuDetailsData";

const STORAGE_KEY = "menus";

const defaultMenus = Array.isArray(menuDetails) ? menuDetails : [menuDetails];

export const getMenus = () => {
  if (typeof window === "undefined") return defaultMenus;

  const savedMenus = localStorage.getItem(STORAGE_KEY);

  if (!savedMenus) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMenus));
    return defaultMenus;
  }

  try {
    const parsedMenus = JSON.parse(savedMenus);

    if (Array.isArray(parsedMenus)) return parsedMenus;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMenus));
    return defaultMenus;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMenus));
    return defaultMenus;
  }
};

export const getMenuById = (id) => {
  return getMenus().find((item) => String(item.id) === String(id));
};

export const addMenu = (data) => {
  const menus = getMenus();

  const newMenu = {
    ...data,
    id: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...menus, newMenu]));

  return newMenu;
};

export const updateMenu = (id, data) => {
  const menus = getMenus();

  const updatedMenus = menus.map((item) =>
    String(item.id) === String(id)
      ? {
          ...item,
          ...data,
          id: item.id,
        }
      : item
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMenus));

  return updatedMenus.find((item) => String(item.id) === String(id));
};

export const deleteMenu = (id) => {
  const menus = getMenus();

  const updatedMenus = menus.filter(
    (item) => String(item.id) !== String(id)
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMenus));

  return updatedMenus;
};