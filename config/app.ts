import type { Servico } from "@/types/agendamento";

interface Rotulo {
  singular: string;
  plural: string;
  /** Texto de exemplo exibido nos campos de cadastro. */
  exemplo: string;
}

interface ConfigApp {
  nomeNegocio: string;
  descricao: string;
  /** Prefixo das chaves do localStorage. Mude ao reutilizar o projeto para não misturar dados. */
  prefixoStorage: string;
  /** false = um único profissional: dois agendamentos pendentes não podem ocupar o mesmo horário. */
  permitirSobreposicao: boolean;
  rotulos: {
    agenda: string;
    cliente: Rotulo;
    servico: Rotulo;
  };
  /** Serviços criados na primeira abertura do app (antes de existir algo salvo). */
  servicosIniciais: Servico[];
}

/**
 * Ponto único de adaptação do app.
 *
 * Exemplo para manicure:
 *   nomeNegocio: "Studio da Ana"
 *   servico.exemplo: "Esmaltação em gel"
 *   servicosIniciais: [{ id: "srv-1", nome: "Mão", preco: 35, duracaoMinutos: 45 }, ...]
 *
 * Exemplo para clínica: cliente -> { singular: "Paciente", plural: "Pacientes", ... }
 */
export const config: ConfigApp = {
  nomeNegocio: "Minha Agenda",
  descricao: "Agendamentos, clientes e serviços.",
  prefixoStorage: "agenda",
  permitirSobreposicao: false,
  rotulos: {
    agenda: "Agenda",
    cliente: { singular: "Cliente", plural: "Clientes", exemplo: "Maria Souza" },
    servico: { singular: "Serviço", plural: "Serviços", exemplo: "Atendimento completo" },
  },
  servicosIniciais: [
    { id: "srv-exemplo-1", nome: "Atendimento rápido", preco: 40, duracaoMinutos: 30 },
    { id: "srv-exemplo-2", nome: "Atendimento completo", preco: 80, duracaoMinutos: 60 },
  ],
};
