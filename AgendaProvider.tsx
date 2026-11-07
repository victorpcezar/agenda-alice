"use client";

import { createContext, useContext, type ReactNode } from "react";
import { config } from "@/config/app";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatarDataCurta } from "@/lib/format";
import { ehListaAgendamentos, ehListaClientes, ehListaServicos } from "@/lib/guards";
import { gerarId } from "@/lib/id";
import { gerarDatas, LIMITE_OCORRENCIAS } from "@/lib/recorrencia";
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
  /** `ocorrencias` só vale para horários fixos (recorrente + frequencia). */
  agendar: (dados: NovoAgendamento, ocorrencias?: number) => Resultado;
  atualizarStatus: (id: string, status: StatusAgendamento) => void;
  /** Cancela este agendamento e, se for de uma série, os próximos ainda pendentes. */
  cancelarAPartirDe: (id: string) => void;
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

  const agendar = (dados: NovoAgendamento, ocorrencias = 1): Resultado => {
    const servico = servicos.find((s) => s.id === dados.servicoId);
    if (!servico) return falha(`Selecione o campo “${rotuloServico.singular}”.`);
    if (!clientes.some((c) => c.id === dados.clienteId)) {
      return falha(`Selecione o campo “${rotuloCliente.singular}”.`);
    }
    if (Number.isNaN(new Date(dados.dataHora).getTime())) return falha("Informe uma data e hora válidas.");

    const frequencia = dados.recorrente ? dados.frequencia : undefined;
    if (dados.recorrente && !frequencia) return falha("Escolha a frequência do horário fixo.");

    const quantidade = Math.min(Math.max(Math.trunc(ocorrencias), 1), LIMITE_OCORRENCIAS);
    const datas = frequencia ? gerarDatas(dados.dataHora, frequencia, quantidade) : [dados.dataHora];

    // Intervalos já ocupados por agendamentos pendentes.
    const ocupados = agendamentos.flatMap((a) => {
      if (a.status !== "pendente") return [];
      const outro = servicos.find((s) => s.id === a.servicoId);
      if (!outro) return [];
      const inicio = new Date(a.dataHora).getTime();
      return [{ inicio, fim: inicio + outro.duracaoMinutos * MS_POR_MINUTO }];
    });

    const duracaoMs = servico.duracaoMinutos * MS_POR_MINUTO;
    const serieId = frequencia ? gerarId() : undefined;
    const novos: Agendamento[] = [];
    const puladas: string[] = [];

    for (const dataHora of datas) {
      const inicio = new Date(dataHora).getTime();
      const fim = inicio + duracaoMs;
      const conflito = !config.permitirSobreposicao && ocupados.some((o) => inicio < o.fim && o.inicio < fim);
      if (conflito) {
        puladas.push(dataHora);
        continue;
      }

      const novo: Agendamento = {
        id: gerarId(),
        clienteId: dados.clienteId,
        servicoId: dados.servicoId,
        dataHora,
        status: "pendente",
      };
      if (frequencia && serieId) {
        novo.recorrente = true;
        novo.frequencia = frequencia;
        novo.serieId = serieId;
      }
      novos.push(novo);
    }

    if (novos.length === 0) {
      return falha(
        frequencia
          ? "Todos os horários dessa série já estão ocupados."
          : "Já existe um agendamento pendente que ocupa esse horário.",
      );
    }

    setAgendamentos((prev) => [...prev, ...novos]);
    if (!frequencia) return { ok: true };

    const criados = `${novos.length} agendamentos criados.`;
    return {
      ok: true,
      mensagem:
        puladas.length === 0
          ? criados
          : `${criados} Datas puladas por conflito de horário: ${puladas.map(formatarDataCurta).join(", ")}.`,
    };
  };

  const atualizarStatus = (id: string, status: StatusAgendamento): void => {
    setAgendamentos((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const cancelarAPartirDe = (id: string): void => {
    setAgendamentos((prev) => {
      const alvo = prev.find((a) => a.id === id);
      if (!alvo) return prev;
      return prev.map((a): Agendamento => {
        const mesmaSerie = alvo.serieId !== undefined && a.serieId === alvo.serieId;
        const proximaPendente = mesmaSerie && a.status === "pendente" && a.dataHora >= alvo.dataHora;
        return a.id === alvo.id || proximaPendente ? { ...a, status: "cancelado" } : a;
      });
    });
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
        cancelarAPartirDe,
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
