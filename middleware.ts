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
    req.nextUrl.pathname + req.nextUrl.search
  );
  return NextResponse.redirect(url);
}

function redirectCustomer(req: NextRequest) {
  const url = req.nextUrl.clone();
  // Mengarahkan ke login front-end
  url.pathname = "/login";
  url.searchParams.set(
    "callbackUrl",
    req.nextUrl.pathname + req.nextUrl.search
  );
  return NextResponse.redirect(url);
}

const roleName = (r: RoleShape): string =>
  typeof r === "string" ? r : r.name ?? r.slug ?? r.role ?? "";

const isSuperadmin = (roles?: RoleShape[]): boolean =>
  Array.isArray(roles) &&
  roles.some((r) => roleName(r).toLowerCase() === "superadmin");

const isAdmin = (roles?: RoleShape[]): boolean =>
  Array.isArray(roles) &&
  roles.some((r) =>
    ["superadmin", "admin"].includes(roleName(r).toLowerCase())
  );

const isAdminOrSuperadmin = (roles?: RoleShape[]): boolean =>
  isSuperadmin(roles) || isAdmin(roles);

export async function middleware(req: NextRequest) {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as TokenWithRoles | null;

  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/store")) {
    if (!token) {
      return redirectToLogin(req);
    }
    return NextResponse.next();
  }

  if (pathname === "/me" || pathname === "/cart") {
    if (!token) {
      return redirectCustomer(req);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return redirectToLogin(req);
    }

    if (!isAdminOrSuperadmin(token.roles)) {
      return redirectToLogin(req);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/me", "/cart", "/store/:path*"],
};