export const APP_NAVIGATE_EVENT = "app:navigate";

export const navigateTo = (path: string) => {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname === path) {
    return;
  }

  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event(APP_NAVIGATE_EVENT));
};
