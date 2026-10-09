export const MOTIVOS_DENUNCIA = [
  "Ofensivo ou desrespeitoso",
  "Informação de saúde perigosa",
  "Propaganda ou spam",
  "Outro motivo",
] as const;

const CORES_AVATAR = ["bg-verde text-grafite", "bg-grafite text-white", "bg-pastel text-grafite", "bg-rose text-white"];

/** Cor estável do avatar a partir do id da autora. */
export function corAvatar(id: string): string {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return CORES_AVATAR[h % CORES_AVATAR.length];
}
