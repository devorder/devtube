import { auth } from "@/auth";
import { NextResponse } from "next/server";
// This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });
//   const { pathname } = request.nextUrl;
//   const publicRoutes = [
//     "/auth/signin",
//     "/auth/signup",
//     "/api/auth",
//     "/_next",
//     "/favicon.ico",
//   ];
//   const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

//   if (isPublic) {
//     return NextResponse.next();
//   }
//   // If no token → redirect to login
//   if (!token) {
//     const loginUrl = new URL("/auth/signin", request.url);
//     loginUrl.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }
export default auth((req) => {
  const publicRoutes = [
    "/auth/signin",
    "/auth/signup",
    "/api/auth",
    "/_next",
    "/favicon.ico",
  ];
  const { pathname } = req.nextUrl;
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  if (isPublic) {
    if (req.auth) {
      const loginUrl = new URL("/", req.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
  if (!req.auth) {
    const loginUrl = new URL("/auth/signin", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
