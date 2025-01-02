export const apiClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const sessionToken = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: sessionToken ? `Bearer ${sessionToken}` : "",
    ...options?.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "Request failed";
    try {
      const error = await response.json();
      errorMessage = error?.message || errorMessage;
      // eslint-disable-next-line no-empty
    } catch {}
    throw new Error(errorMessage);
  }

  try {
    const contentType = response.headers.get("Content-Type") || "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error("Failed to parse response JSON:", e.message);
  }

  return null as T;
};
