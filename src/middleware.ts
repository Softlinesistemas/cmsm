import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  let token: any = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const rawToken = authHeader.split(" ")[1];
    token = await decode({
      token: rawToken,
      secret: process.env.NEXTAUTH_SECRET!,
    });
  }

  if (!token && !request.nextUrl.pathname.startsWith("/")) {
    return new NextResponse(JSON.stringify({ message: "Access denied." }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // if (request.nextUrl.pathname.startsWith("/login")) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  const response = NextResponse.next();
  response.headers.set("x-user-token", JSON.stringify(token));

  return response;
}

export const config = {
  matcher: ["/login"],
};
