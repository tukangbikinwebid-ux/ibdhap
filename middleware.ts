import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

type RoleObject = { name?: string; slug?: string; role?: string };
type RoleShape = string | RoleObject;
type TokenWithRoles = JWT & { roles?: RoleShape[] };

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set(
    "callbackUrl",
    req.nextUrl.pathname + req.nextUrl.search,
  );
  return NextResponse.redirect(url);
}

// Helper roles (tetap sama)
const roleName = (r: RoleShape): string =>
  typeof r === "string" ? r : (r.name ?? r.slug ?? r.role ?? "");

const isSuperadmin = (roles?: RoleShape[]): boolean =>
  Array.isArray(roles) &&
  roles.some((r) => roleName(r).toLowerCase() === "superadmin");

const isAdmin = (roles?: RoleShape[]): boolean =>
  Array.isArray(roles) &&
  roles.some((r) =>
    ["superadmin", "admin"].includes(roleName(r).toLowerCase()),
  );

const isAdminOrSuperadmin = (roles?: RoleShape[]): boolean =>
  isSuperadmin(roles) || isAdmin(roles);

export async function middleware(req: NextRequest) {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as TokenWithRoles | null;

  const pathname = req.nextUrl.pathname;

  const publicPaths = ["/auth/login", "/register", "/login"];

  // Jika user mengakses halaman public, biarkan lewat
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!token) {
    return redirectToLogin(req);
  }


  if (pathname.startsWith("/admin")) {
    if (!isAdminOrSuperadmin(token.roles)) {
      // User sudah login tapi bukan admin -> Redirect ke home atau halaman unauthorized
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
};