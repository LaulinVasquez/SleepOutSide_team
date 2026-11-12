export const errorMessages = {
  401: 'You need to sign in to access this resource.',
  404: 'The page or product you requested could not be found.',
  500: 'Something went wrong. Please try again later.',
} as const;

export type ErrorStatus = keyof typeof errorMessages;
export function isErrorStatus(status: number): status is ErrorStatus {
  return status === 401 || status === 404 || status === 500;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number) {
    super(isErrorStatus(status) ? errorMessages[status] : 'The request could not be completed.');
    this.status = status;
  }
}

export function redirectForError(status: number) {
  if (typeof window === 'undefined' || !isErrorStatus(status)) return;
  // Fixed local destinations prevent open redirects and repeated error-page navigation.
  if (window.location.pathname.replace(/\/$/, '') === `/${status}`) return;
  window.location.replace(`/${status}?flash=${status}`);
}

/** Shared entry point for browser API requests, including network failures. */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(input, init);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    redirectForError(500);
    throw new ApiError(500);
  }
  if (!response.ok) {
    redirectForError(response.status);
    throw new ApiError(response.status);
  }
  return response;
}
