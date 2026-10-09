import type { ReactNode } from "react";
import type { Categoria } from "./types";

export const CATEGORIAS: Record<Categoria, { nome: string; cor: string; corTexto: string }> = {
  nutricao: { nome: "Nutrição", cor: "bg-verde", corTexto: "text-grafite" },
  ciclo: { nome: "Ciclo", cor: "bg-rose", corTexto: "text-white" },
  fertilidade: { nome: "Fertilidade", cor: "bg-pastel", corTexto: "text-grafite" },
  estilo_vida: { nome: "Estilo de vida", cor: "bg-grafite", corTexto: "text-white" },
};

export const LISTA_CATEGORIAS = Object.keys(CATEGORIAS) as Categoria[];

export function ehCategoria(v: unknown): v is Categoria {
  return typeof v === "string" && v in CATEGORIAS;
}

export function minutosLeitura(texto: string): number {
  return Math.max(1, Math.round(texto.trim().split(/\s+/).length / 200));
}

/**
 * Renderiza o corpo do conteúdo a partir de um formato de texto simples,
 * sem HTML (nada de dangerouslySetInnerHTML):
 *   - parágrafos separados por linha em branco
 *   - "## Título" para subtítulos
 *   - "- item" para listas
 *   - **negrito**
 */
export function renderizarCorpo(texto: string): ReactNode[] {
  const blocos = texto.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return blocos.map((bloco, i) => {
    const linhas = bloco.split("\n").map((l) => l.trim()).filter(Boolean);
    if (linhas.length === 0) return null;
    if (linhas[0].startsWith("## ")) {
      return <h2 key={i}>{negrito(linhas[0].slice(3))}</h2>;
    }
    if (linhas.every((l) => l.startsWith("- "))) {
      return (
        <ul key={i}>
          {linhas.map((l, j) => (
            <li key={j}>{negrito(l.slice(2))}</li>
          ))}
        </ul>
      );
    }
    return <p key={i}>{negrito(linhas.join(" "))}</p>;
  });
}

function negrito(texto: string): ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((parte, i) =>
    parte.startsWith("**") && parte.endsWith("**") ? <strong key={i}>{parte.slice(2, -2)}</strong> : parte,
  );
}
