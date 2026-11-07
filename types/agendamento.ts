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

export type Frequencia = "semanal" | "quinzenal" | "mensal";

export interface Agendamento {
  id: string;
  clienteId: string;
  servicoId: string;
  dataHora: string; // Ex: "2026-11-10T14:30"
  status: "pendente" | "concluido" | "cancelado";
  recorrente?: boolean; // Se é um horário fixo
  frequencia?: Frequencia; // Preenchido quando recorrente
  serieId?: string; // Liga as ocorrências da mesma série (permite cancelar "daqui em diante")
}

export type StatusAgendamento = Agendamento["status"];
export type NovoServico = Omit<Servico, "id">;
export type NovoCliente = Omit<Cliente, "id">;
export type NovoAgendamento = Omit<Agendamento, "id" | "status" | "serieId">;

export type Resultado = { ok: true; mensagem?: string } | { ok: false; erro: string };
