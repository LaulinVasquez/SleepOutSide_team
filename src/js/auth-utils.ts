export function resolvePostLoginRedirect(
  redirect: string | null,
  referrer: string,
  currentHref: string,
): string {
  const currentUrl = new URL(currentHref);
  const destination = redirect || (referrer && referrer !== currentHref ? referrer : "/");

  try {
    const resolvedUrl = new URL(destination, currentUrl.origin);
    const isLoginPage = resolvedUrl.pathname.replace(/\/+$/, "") === "/login";

    if (resolvedUrl.origin !== currentUrl.origin || isLoginPage) {
      return "/";
    }

    return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
  } catch {
    return "/";
  }
}
