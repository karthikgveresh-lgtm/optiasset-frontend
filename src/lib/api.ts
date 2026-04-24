/**
 * Secure API Utility (Total Lockdown Edition)
 * Forces HTTPS and removes trailing slashes globally.
 */

export const getApiUrl = () => {
  // 1. Get base URL from environment or fallback
  let url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  // 2. FORCE HTTPS for Railway production
  if (url.includes("railway.app")) {
    url = url.replace("http://", "https://");
    if (!url.startsWith("https://")) {
      url = "https://" + url;
    }
  }
  
  // 3. Remove any trailing slashes to prevent 404/Mixed Content issues
  return url.replace(/\/+$/, "");
};

export const secureFetch = async (path: string, options: RequestInit = {}) => {
  const baseUrl = getApiUrl();
  
  // Ensure path starts with / and doesn't end with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const finalPath = cleanPath.replace(/\/+$/, "");
  
  const finalUrl = `${baseUrl}${finalPath}`;
  
  console.log(`[OptiAsset Sync] Fetching: ${finalUrl}`);
  
  return fetch(finalUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};
