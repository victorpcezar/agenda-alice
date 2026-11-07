"use client";

import { createContext, useContext, type ReactNode } from "react";
import { config } from "@/config/app";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ehListaAgendamentos, ehListaClientes, ehListaServicos } from "@/lib/guards";
import { gerarId } from "@/lib/id";
import type {
  Agendamento,
  Cliente,
  NovoAgendamento,
  NovoCliente,
  NovoServico,
  Resultado,
  Servico,
  StatusAgendamento,
} from "@/types/agendamento";

const SERVICOS_INICIAIS: Servico[] = [...config.servicosIniciais];
const MS_POR_MINUTO = 60_000;
const { cliente: rotuloCliente, servico: rotuloServico } = config.rotulos;

interface AgendaContexto {
  hidratado: boolean;
  servicos: Servico[];
  clientes: Cliente[];
  agendamentos: Agendamento[];
  adicionarServico: (dados: NovoServico) => void;
  removerServico: (id: string) => Resultado;
  adicionarCliente: (dados: NovoCliente) => void;
  removerCliente: (id: string) => Resultado;
  agendar: (dados: NovoAgendamento) => Resultado;
  atualizarStatus: (id: string, status: StatusAgendamento) => void;
  removerAgendamento: (id: string) => void;
}

const AgendaCtx = createContext<AgendaContexto | null>(null);

const falha = (erro: string): Resultado => ({ ok: false, erro });

export function AgendaProvider({ children }: { children: ReactNode }) {
  const prefixo = config.prefixoStorage;

  const [servicos, setServicos, servicosOk] = useLocalStorage<Servico[]>(
    `${prefixo}:servicos`,
    SERVICOS_INICIAIS,
    ehListaServicos,
  );
  const [clientes, setClientes, clientesOk] = useLocalStorage<Cliente[]>(
    `${prefixo}:clientes`,
    [],
    ehListaClientes,
  );
  const [agendamentos, setAgendamentos, agendamentosOk] = useLocalStorage<Agendamento[]>(
    `${prefixo}:agendamentos`,
    [],
    ehListaAgendamentos,
  );

  const adicionarServico = (dados: NovoServico): void => {
    setServicos((prev) => [...prev, { id: gerarId(), ...dados }]);
  };

  const removerServico = (id: string): Resultado => {
    if (agendamentos.some((a) => a.servicoId === id)) {
      return falha("Há agendamentos vinculados. Exclua-os antes de remover este item.");
    }
    setServicos((prev) => prev.filter((s) => s.id !== id));
    return { ok: true };
  };

  const adicionarCliente = (dados: NovoCliente): void => {
    setClientes((prev) => [...prev, { id: gerarId(), ...dados }]);
  };

  const removerCliente = (id: string): Resultado => {
    if (agendamentos.some((a) => a.clienteId === id)) {
      return falha("Há agendamentos vinculados. Exclua-os antes de remover este item.");
    }
    setClientes((prev) => prev.filter((c) => c.id !== id));
    return { ok: true };
  };

  const agendar = (dados: NovoAgendamento): Resultado => {
    const servico = servicos.find((s) => s.id === dados.servicoId);
    if (!servico) return falha(`Selecione o campo “${rotuloServico.singular}”.`);
    if (!clientes.some((c) => c.id === dados.clienteId)) {
      return falha(`Selecione o campo “${rotuloCliente.singular}”.`);
    }

    const inicio = new Date(dados.dataHora).getTime();
    if (Number.isNaN(inicio)) return falha("Informe uma data e hora válidas.");

    if (!config.permitirSobreposicao) {
      const fim = inicio + servico.duracaoMinutos * MS_POR_MINUTO;
      const conflito = agendamentos.some((a) => {
        if (a.status !== "pendente") return false;
        const outro = servicos.find((s) => s.id === a.servicoId);
        if (!outro) return false;
        const outroInicio = new Date(a.dataHora).getTime();
        const outroFim = outroInicio + outro.duracaoMinutos * MS_POR_MINUTO;
        return inicio < outroFim && outroInicio < fim;
      });
      if (conflito) return falha("Já existe um agendamento pendente que ocupa esse horário.");
    }

    setAgendamentos((prev) => [...prev, { id: gerarId(), ...dados, status: "pendente" }]);
    return { ok: true };
  };

  const atualizarStatus = (id: string, status: StatusAgendamento): void => {
    setAgendamentos((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const removerAgendamento = (id: string): void => {
    setAgendamentos((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AgendaCtx.Provider
      value={{
        hidratado: servicosOk && clientesOk && agendamentosOk,
        servicos,
        clientes,
        agendamentos,
        adicionarServico,
        removerServico,
        adicionarCliente,
        removerCliente,
        agendar,
        atualizarStatus,
        removerAgendamento,
      }}
    >
      {children}
    </AgendaCtx.Provider>
  );
}

export function useAgenda(): AgendaContexto {
  const ctx = useContext(AgendaCtx);
  if (!ctx) throw new Error("useAgenda deve ser usado dentro de <AgendaProvider>.");
  return ctx;
}
