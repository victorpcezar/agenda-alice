import type { Frequencia } from "@/types/agendamento";

export const OPCOES_FREQUENCIA: ReadonlyArray<{ valor: Frequencia; rotulo: string }> = [
  { valor: "semanal", rotulo: "Toda semana" },
  { valor: "quinzenal", rotulo: "A cada 15 dias" },
  { valor: "mensal", rotulo: "Todo mês" },
];

export const ROTULOS_FREQUENCIA: Record<Frequencia, string> = {
  semanal: "Toda semana",
  quinzenal: "A cada 15 dias",
  mensal: "Todo mês",
};

export const OPCOES_OCORRENCIAS: readonly number[] = [4, 8, 12, 24];
export const OCORRENCIAS_PADRAO = 12;
export const LIMITE_OCORRENCIAS = 52;

export function ehFrequencia(valor: string): valor is Frequencia {
  return valor === "semanal" || valor === "quinzenal" || valor === "mensal";
}

const REGEX_ISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;

function paraISO(d: Date): string {
  const p = (n: number): string => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/**
 * Gera `quantidade` datas (a primeira é a própria data inicial), no mesmo horário.
 * Cada data é calculada a partir da inicial, sem acumular erro.
 * Mensal mantém o dia do mês; em meses mais curtos usa o último dia (31/01 -> 28/02).
 */
export function gerarDatas(inicioISO: string, frequencia: Frequencia, quantidade: number): string[] {
  const m = REGEX_ISO.exec(inicioISO);
  if (!m) return [];
  const [ano, mes, dia, hora, minuto] = m.slice(1).map(Number);

  const datas: string[] = [];
  for (let i = 0; i < quantidade; i += 1) {
    if (frequencia === "mensal") {
      const ultimoDiaDoMes = new Date(ano, mes - 1 + i + 1, 0).getDate();
      datas.push(paraISO(new Date(ano, mes - 1 + i, Math.min(dia, ultimoDiaDoMes), hora, minuto)));
    } else {
      const passoEmDias = frequencia === "semanal" ? 7 : 14;
      datas.push(paraISO(new Date(ano, mes - 1, dia + passoEmDias * i, hora, minuto)));
    }
  }
  return datas;
}
