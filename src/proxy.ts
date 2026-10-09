import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Tudo, exceto arquivos estáticos, ícones, manifest e service worker
    "/((?!_next/static|_next/image|favicon.ico|icone|manifest.webmanifest|sw.js|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
