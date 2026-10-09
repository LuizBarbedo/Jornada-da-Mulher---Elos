export type Perfil = {
  id: string;
  nome: string | null;
  data_nascimento: string | null;
  data_ultima_menstruacao: string | null;
  duracao_ciclo_dias: number;
  fase_jornada: "tentante" | "gestante" | "lactante";
  nome_exibicao_comunidade: string | null;
  created_at: string;
};

export type TipoRegistro = "menstruacao" | "sintoma" | "humor" | "observacao";

export type RegistroCiclo = {
  id: string;
  data: string;
  tipo: TipoRegistro;
  valor: string | null;
  texto_livre: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  autor_nome: string;
  texto: string;
  created_at: string;
  ativo: boolean;
  denuncias_count: number;
};

export type Comentario = {
  id: string;
  post_id: string;
  user_id: string;
  autor_nome: string;
  texto: string;
  created_at: string;
  ativo: boolean;
};

export type Categoria = "nutricao" | "ciclo" | "fertilidade" | "estilo_vida";

export type Conteudo = {
  id: string;
  titulo: string;
  categoria: Categoria;
  resumo: string | null;
  conteudo: string;
  url_imagem: string | null;
  publicado: boolean;
  created_at: string;
  updated_at: string;
};

/** Estado padrão devolvido pelos Server Actions de formulário. */
export type EstadoForm = { erro?: string; sucesso?: string } | undefined;
