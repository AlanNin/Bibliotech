// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoutes = ["/dashboard(.*)", "/publish"];

const isProtectedRoute = createRouteMatcher(protectedRoutes);

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) auth().protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
