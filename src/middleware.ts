import { NextRequest, NextResponse } from "next/server";
import { decode, getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { cookies } = request;
  let token: any = await getToken({ req: request });

  if (!token) {
    const sessionTokenValue = cookies.get("next-auth.session-token")?.value;
    if (sessionTokenValue) {
      token = await decode({
        token: sessionTokenValue,
        secret: process.env.NEXTAUTH_SECRET || "OdXFNuFU4BJOmfkYMYhy195IMcM",
      });
    }
  }

  if (request.nextUrl.pathname === "/dashboardAdmin" || request.nextUrl.pathname.startsWith("/dashboardAdmin/")) {
    if (!token?.admin) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (!token && !["/", "/login"].includes(request.nextUrl.pathname)) {
    return new NextResponse(
      JSON.stringify({ message: "Access denied." }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set("x-user-token", JSON.stringify(token));
  return response;
}

export const config = {
  matcher: ["/dashboardAdmin/:path*", "/dashboardAdmin", "/login", "/"],
};
