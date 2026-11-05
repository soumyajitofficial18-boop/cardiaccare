import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const dashboardPaths = {
  admin: "/admin/dashboard",
  doctor: "/doctor/dashboard",
  user: "/dashboard",
};
const publicPages = new Set([
  "/",
  "/about",
  "/services",
  "/how-it-works",
  "/faq",
  "/portals",
]);
const portalEntryPaths = new Set([
  "/login",
  "/signup",
  "/user/login",
  "/user/register",
  "/doctor/login",
  "/doctor/register",
  "/admin/login",
  "/admin/register",
]);
const patientPaths = [
  "/dashboard",
  "/profile",
  "/doctors",
  "/hospitals",
  "/labs",
  "/appointments",
];

function redirectTo(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
  error?: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  if (error) url.searchParams.set("error", error);
  const redirectResponse = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });
  return redirectResponse;
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const isPortalEntry = portalEntryPaths.has(pathname);
  const isPublicRoute =
    isPortalEntry ||
    pathname === "/auth/callback" ||
    publicPages.has(pathname);

  if (!user) {
    if (isPublicRoute) return response;
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname =
      pathname === "/admin" || pathname.startsWith("/admin/")
        ? "/admin/login"
        : pathname === "/doctor" || pathname.startsWith("/doctor/")
          ? "/doctor/login"
          : "/user/login";
    loginUrl.search = "";
    const redirectResponse = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  let { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!error && !profile) {
    const { data: role, error: initializeError } =
      await supabase.rpc("ensure_my_profile");
    if (!initializeError && role) {
      profile = { role };
    } else if (initializeError) {
      error = initializeError;
    }
  }

  if (error) {
    if (isPortalEntry && request.nextUrl.searchParams.has("error")) {
      return response;
    }
    return redirectTo(request, response, "/login", "profile_lookup");
  }

  const destination = dashboardPaths[profile?.role];
  if (!destination) {
    return isPortalEntry || publicPages.has(pathname)
      ? response
      : redirectTo(request, response, "/login", "profile_missing");
  }

  if (isPortalEntry) {
    return redirectTo(request, response, destination);
  }

  if (
    (pathname === "/admin" || pathname.startsWith("/admin/")) &&
    profile.role !== "admin"
  ) {
    return redirectTo(request, response, destination);
  }

  if (
    (pathname === "/doctor" || pathname.startsWith("/doctor/")) &&
    profile.role !== "doctor"
  ) {
    return redirectTo(request, response, destination);
  }

  if (
    patientPaths.some(
      (patientPath) =>
        pathname === patientPath || pathname.startsWith(`${patientPath}/`),
    ) &&
    profile.role !== "user"
  ) {
    return redirectTo(request, response, destination);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
