import { redirect } from "next/navigation";
import { getUsuaria } from "@/lib/auth";

export default async function Raiz() {
  redirect((await getUsuaria()) ? "/inicio" : "/boas-vindas");
}
