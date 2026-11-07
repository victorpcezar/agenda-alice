"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { config } from "@/config/app";
import { useAgenda } from "@/context/AgendaProvider";
import {
  ehHoje, formatarDataHora, formatarMoeda, mascararData, mascararHora, paraDataHoraISO,
} from "@/lib/format";
import type { StatusAgendamento } from "@/types/agendamento";
import {
  Aba, Acoes, Botao, Campo, Descricao, Destaque, Filtros, Formulario, Info, ItemLista,
  Input, Lista, Mensagem, Pagina, Painel, Select, Selo, Suave, Titulo, TituloPainel, Vazio,
} from "@/styles/ui";

type Filtro = "todos" | StatusAgendamento;

const { rotulos } = config;

const FILTROS: ReadonlyArray<{ valor: Filtro; rotulo: string }> = [
  { valor: "pendente", rotulo: "Pendentes" },
  { valor: "concluido", rotulo: "Concluídos" },
  { valor: "cancelado", rotulo: "Cancelados" },
  { valor: "todos", rotulo: "Todos" },
];

export default function AgendaPage() {
  const {
    hidratado, clientes, servicos, agendamentos,
    agendar, atualizarStatus, removerAgendamento,
  } = useAgenda();

  const [clienteId, setClienteId] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("pendente");
  const [erro, setErro] = useState<string | null>(null);

  const clientePorId = useMemo(() => new Map(clientes.map((c) => [c.id, c])), [clientes]);
  const servicoPorId = useMemo(() => new Map(servicos.map((s) => [s.id, s])), [servicos]);

  const resumoHoje = useMemo(() => {
    let pendentes = 0;
    let recebido = 0;
    for (const a of agendamentos) {
      if (!ehHoje(a.dataHora)) continue;
      if (a.status === "pendente") pendentes += 1;
      if (a.status === "concluido") recebido += servicoPorId.get(a.servicoId)?.preco ?? 0;
    }
    return { pendentes, recebido };
  }, [agendamentos, servicoPorId]);

  const visiveis = useMemo(
    () =>
      agendamentos
        .filter((a) => filtro === "todos" || a.status === filtro)
        .sort((a, b) => a.dataHora.localeCompare(b.dataHora)),
    [agendamentos, filtro],
  );

  const salvar = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!clienteId || !servicoId) {
      return setErro(`Selecione ${rotulos.cliente.singular.toLowerCase()} e ${rotulos.servico.singular.toLowerCase()}.`);
    }

    const dataHora = paraDataHoraISO(data, hora);
    if (!dataHora) return setErro("Informe uma data (DD/MM/AAAA) e uma hora (HH:MM) válidas.");

    const resultado = agendar({ clienteId, servicoId, dataHora });
    if (!resultado.ok) return setErro(resultado.erro);

    setData("");
    setHora("");
    setErro(null);
    setFiltro("pendente");
  };

  const semCadastro = hidratado && (clientes.length === 0 || servicos.length === 0);

  return (
    <Pagina>
      <Titulo>{rotulos.agenda}</Titulo>
      <Descricao>
        {hidratado
          ? `Hoje: ${resumoHoje.pendentes} pendente${resumoHoje.pendentes === 1 ? "" : "s"} e ${formatarMoeda(resumoHoje.recebido)} recebidos.`
          : "Carregando..."}
      </Descricao>

      <Painel>
        <TituloPainel>Novo agendamento</TituloPainel>
        {semCadastro ? (
          <Vazio>
            Para agendar, cadastre antes pelo menos um registro em{" "}
            <Link href="/clientes">{rotulos.cliente.plural}</Link> e em{" "}
            <Link href="/servicos">{rotulos.servico.plural}</Link>.
          </Vazio>
        ) : (
          <Formulario onSubmit={salvar} noValidate>
            <Campo>
              {rotulos.cliente.singular}
              <Select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                <option value="">Selecione</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </Select>
            </Campo>
            <Campo>
              {rotulos.servico.singular}
              <Select value={servicoId} onChange={(e) => setServicoId(e.target.value)}>
                <option value="">Selecione</option>
                {servicos.map((s) => (
                  <option key={s.id} value={s.id}>{s.nome} ({formatarMoeda(s.preco)})</option>
                ))}
              </Select>
            </Campo>
            <Campo>
              Data
              <Input
                value={data}
                onChange={(e) => setData(mascararData(e.target.value))}
                inputMode="numeric"
                placeholder="10/11/2026"
                maxLength={10}
              />
            </Campo>
            <Campo>
              Hora
              <Input
                value={hora}
                onChange={(e) => setHora(mascararHora(e.target.value))}
                inputMode="numeric"
                placeholder="14:30"
                maxLength={5}
              />
            </Campo>
            <Botao type="submit">Agendar</Botao>
          </Formulario>
        )}
        {erro && <Mensagem $tipo="erro" role="alert">{erro}</Mensagem>}
      </Painel>

      <Filtros role="group" aria-label="Filtrar por status">
        {FILTROS.map(({ valor, rotulo }) => (
          <Aba key={valor} $ativa={filtro === valor} aria-pressed={filtro === valor} onClick={() => setFiltro(valor)}>
            {rotulo}
          </Aba>
        ))}
      </Filtros>

      {!hidratado ? null : visiveis.length === 0 ? (
        <Vazio>Nenhum agendamento nesta lista.</Vazio>
      ) : (
        <Lista>
          {visiveis.map((a) => {
            const cliente = clientePorId.get(a.clienteId);
            const servico = servicoPorId.get(a.servicoId);
            return (
              <ItemLista key={a.id}>
                <Info>
                  <Destaque>{formatarDataHora(a.dataHora)}</Destaque>
                  <span>{cliente?.nome ?? "(removido)"} - {servico?.nome ?? "(removido)"}</span>
                  <Suave>
                    {servico ? `${servico.duracaoMinutos} min, ${formatarMoeda(servico.preco)}` : ""}
                  </Suave>
                </Info>
                <Acoes>
                  <Selo status={a.status} />
                  {a.status === "pendente" && (
                    <>
                      <Botao $pequeno onClick={() => atualizarStatus(a.id, "concluido")}>Concluir</Botao>
                      <Botao $variante="neutro" $pequeno onClick={() => atualizarStatus(a.id, "cancelado")}>
                        Cancelar
                      </Botao>
                    </>
                  )}
                  <Botao $variante="perigo" $pequeno onClick={() => removerAgendamento(a.id)}>Excluir</Botao>
                </Acoes>
              </ItemLista>
            );
          })}
        </Lista>
      )}
    </Pagina>
  );
}
