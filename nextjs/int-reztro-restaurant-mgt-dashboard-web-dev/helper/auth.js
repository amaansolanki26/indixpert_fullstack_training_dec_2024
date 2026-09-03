export const isAuthenticated = () => {

  if (typeof window === "undefined") return false;

  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("isLoggedIn="))
    ?.split("=")[1] === "true";
};

export const login = () => {

  document.cookie =
    "isLoggedIn=true; path=/";
};

export const logout = () => {

  document.cookie =
    "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
};