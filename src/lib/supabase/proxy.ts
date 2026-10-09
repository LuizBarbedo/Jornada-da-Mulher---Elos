import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ROTAS_PUBLICAS = ["/", "/boas-vindas", "/cadastro", "/entrar", "/termos", "/offline", "/admin/login"];
const ROTAS_SO_DESLOGADA = ["/boas-vindas", "/cadastro", "/entrar"];

function ehPublica(pathname: string) {
  return ROTAS_PUBLICAS.includes(pathname) || pathname.startsWith("/auth/");
}

/** Renova a sessão do Supabase e faz o redirecionamento otimista de rotas. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  // Não coloque código entre createServerClient e getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const redirecionar = (destino: string) => {
    const url = request.nextUrl.clone();
    url.pathname = destino;
    url.search = "";
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  };

  if (!user && !ehPublica(pathname)) {
    return redirecionar(pathname.startsWith("/admin") ? "/admin/login" : "/entrar");
  }
  if (user && ROTAS_SO_DESLOGADA.includes(pathname)) {
    return redirecionar("/inicio");
  }

  return response;
}
