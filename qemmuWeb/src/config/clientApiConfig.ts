export const apiClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const sessionToken = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: sessionToken
      ? `Bearer ${sessionToken.replace(/"/g, "")}`
      : "",
    ...options?.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  try {
    const contentType = response.headers.get("Content-Type") || "";
    const header = response.headers.get("authorization") || "";

    if (
      url == "/auth/login" ||
      url == "/auth/update" ||
      url.includes("/api/v1/user/change/organization")
    ) {
      localStorage.setItem("token", header.split(" ")[1]);
    }

    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }
  } catch (e: any) {
    console.error("Failed to parse response JSON:", e.message);
  }

  return null as T;
};
