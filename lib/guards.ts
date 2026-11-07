import type { Agendamento, Cliente, Servico } from "@/types/agendamento";

const STATUS_VALIDOS: readonly string[] = ["pendente", "concluido", "cancelado"];

function ehObjeto(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function ehServico(v: unknown): v is Servico {
  return (
    ehObjeto(v) &&
    typeof v.id === "string" &&
    typeof v.nome === "string" &&
    typeof v.preco === "number" &&
    typeof v.duracaoMinutos === "number"
  );
}

export function ehCliente(v: unknown): v is Cliente {
  return (
    ehObjeto(v) &&
    typeof v.id === "string" &&
    typeof v.nome === "string" &&
    typeof v.telefone === "string"
  );
}

export function ehAgendamento(v: unknown): v is Agendamento {
  return (
    ehObjeto(v) &&
    typeof v.id === "string" &&
    typeof v.clienteId === "string" &&
    typeof v.servicoId === "string" &&
    typeof v.dataHora === "string" &&
    typeof v.status === "string" &&
    STATUS_VALIDOS.includes(v.status)
  );
}

function listaDe<T>(guarda: (v: unknown) => v is T) {
  return (v: unknown): v is T[] => Array.isArray(v) && v.every(guarda);
}

// Definidos no escopo do módulo para manter a identidade estável entre renders.
export const ehListaServicos = listaDe(ehServico);
export const ehListaClientes = listaDe(ehCliente);
export const ehListaAgendamentos = listaDe(ehAgendamento);
