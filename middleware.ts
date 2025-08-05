import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_KEY = "your-super-secret-jwt-key-here";

const PUBLIC_PATHS_EXACT = [
  "/",
  "/favicon.ico",
  "/logo.png",
  "/bounties",
  "/projects",
];

const PUBLIC_PATHS_DYNAMIC_PREFIXES = ["/bio/", "/store/"];

const AUTH_PATHS = ["/auth/signin", "/auth/signup"];

const PROTECTED_DASHBOARD_PREFIXES: { [key: string]: string } = {
  "/admin": "admin",
  "/dashboard/company": "company",
  "/dashboard/freelancer": "freelancer",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log(`Middleware check for: ${pathname}`);

  const isContentPublicPath =
    PUBLIC_PATHS_EXACT.includes(pathname) ||
    PUBLIC_PATHS_DYNAMIC_PREFIXES.some(
      (prefix) => pathname.substring(0, prefix.length) === prefix
    );

  if (isContentPublicPath) {
    return NextResponse.next();
  }

  const tokenCookie = req.cookies.get("auth-token");
  const token = tokenCookie ? tokenCookie.value : null;

  const isAuthPath = AUTH_PATHS.includes(pathname);
  if (isAuthPath) {
    if (token) {
      try {
        await jwtVerify(token, new TextEncoder().encode(JWT_SECRET_KEY));
        return NextResponse.redirect(new URL("/", req.url));
      } catch (err) {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    console.log("No token found for protected path, redirecting to login.");
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET_KEY)
    );
    const userType = payload.userType as string;

    for (const prefix in PROTECTED_DASHBOARD_PREFIXES) {
      if (pathname.substring(0, prefix.length) === prefix) {
        const requiredUserType = PROTECTED_DASHBOARD_PREFIXES[prefix];
        if (userType !== requiredUserType) {
          console.log(
            `Access Denied: User type "${userType}" tried to access ${prefix} dashboard.`
          );
          return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.log("Invalid token for protected path, redirecting to login.");
    const response = NextResponse.redirect(new URL("/auth/signin", req.url));
    response.cookies.delete("auth-token");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (your favicon)
     * - Any file with a common static asset extension
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|js|css|map|json)$).*)",
  ],
};
