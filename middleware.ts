import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const currentUserCookie = request.cookies.get('sb-toutaiuryudexvqnptvf-auth-token')?.value;
  const pathname = request.nextUrl.pathname;
  if (currentUserCookie) {
    try {
      const currentUser = JSON.parse(currentUserCookie);
      if (pathname.startsWith('/first-website/player')) {
        // if (currentUser.user.identities[0].identity_data.role != "player") {
        //   return NextResponse.redirect(new URL('/first-website', request.url));
        // }
      } else if (pathname.startsWith('/first-website/admin')) {
        if (currentUser.user.identities[0].identity_data.role != "admin") {
          return NextResponse.redirect(new URL('/first-website', request.url));
        }
      } 
    } catch (error) {
      console.error('Failed to parse current user cookie:', error);
    }
  } else {
    if (pathname.startsWith('/first-website/player') || pathname.startsWith('/first-website/admin')) {
      return NextResponse.redirect(new URL('/first-website', request.url));
    }
    console.log('No current user cookie found.');
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}