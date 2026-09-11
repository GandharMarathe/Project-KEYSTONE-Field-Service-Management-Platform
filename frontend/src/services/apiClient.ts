export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, "Unable to connect to the server. Please try again.");
  }

  if (response.status === 204) return undefined as T;
  const payload: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    const body = payload as { message?: string; fieldErrors?: Record<string, string> } | undefined;
    throw new ApiError(response.status, body?.message ?? errorMessage(response.status), body?.fieldErrors);
  }
  return payload as T;
}

function errorMessage(status: number) {
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 404) return "The requested resource could not be found.";
  if (status === 409) return "This operation cannot be performed because the work order is in an invalid state for this action.";
  if (status >= 500) return "Something went wrong on the server. Please try again later.";
  return "Unable to complete this request. Please review the form and try again.";
}
