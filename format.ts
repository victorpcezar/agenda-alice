export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ehHoje(iso: string): boolean {
  const data = new Date(iso);
  const hoje = new Date();
  return (
    data.getFullYear() === hoje.getFullYear() &&
    data.getMonth() === hoje.getMonth() &&
    data.getDate() === hoje.getDate()
  );
}

export function formatarTelefone(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function contarDigitos(valor: string): number {
  return valor.replace(/\D/g, "").length;
}

export function mascararData(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function mascararHora(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}:${d.slice(2)}`;
}

/** Converte "10/11/2026" + "14:30" em "2026-11-10T14:30". Retorna null se for inválido. */
export function paraDataHoraISO(data: string, hora: string): string | null {
  const dm = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data);
  const hm = /^(\d{2}):(\d{2})$/.exec(hora);
  if (!dm || !hm) return null;

  const dia = Number(dm[1]);
  const mes = Number(dm[2]);
  const ano = Number(dm[3]);
  const h = Number(hm[1]);
  const min = Number(hm[2]);

  // Rejeita datas inexistentes, como 31/02 ou 25:99.
  const teste = new Date(ano, mes - 1, dia, h, min);
  const valido =
    teste.getFullYear() === ano &&
    teste.getMonth() === mes - 1 &&
    teste.getDate() === dia &&
    teste.getHours() === h &&
    teste.getMinutes() === min;

  return valido ? `${dm[3]}-${dm[2]}-${dm[1]}T${hm[1]}:${hm[2]}` : null;
}

export function formatarDataCurta(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
