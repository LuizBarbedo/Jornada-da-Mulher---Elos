import { ImageResponse } from "next/og";

/**
 * Ícone do app: o quadrado arredondado verde da marca sobre fundo branco.
 * O quadrado ocupa ~56% para respeitar a "zona segura" de ícones maskable.
 */
export function gerarIcone(tamanho: number) {
  const lado = Math.round(tamanho * 0.56);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        <div style={{ width: lado, height: lado, borderRadius: Math.round(lado * 0.28), background: "#C0D53C" }} />
      </div>
    ),
    { width: tamanho, height: tamanho },
  );
}
