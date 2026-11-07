export interface Servico {
  id: string;
  nome: string;
  preco: number;
  duracaoMinutos: number;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
}

export interface Agendamento {
  id: string;
  clienteId: string;
  servicoId: string;
  dataHora: string; // Ex: "2026-11-10T14:30"
  status: "pendente" | "concluido" | "cancelado";
}

export type StatusAgendamento = Agendamento["status"];
export type NovoServico = Omit<Servico, "id">;
export type NovoCliente = Omit<Cliente, "id">;
export type NovoAgendamento = Omit<Agendamento, "id" | "status">;

export type Resultado = { ok: true } | { ok: false; erro: string };
