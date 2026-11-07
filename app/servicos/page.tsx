"use client";

import { useState, type FormEvent } from "react";
import { config } from "@/config/app";
import { useAgenda } from "@/context/AgendaProvider";
import { formatarMoeda } from "@/lib/format";
import {
  Acoes, Botao, Campo, Descricao, Destaque, Formulario, Info, Input, ItemLista,
  Lista, Mensagem, Pagina, Painel, Suave, Titulo, TituloPainel, Vazio,
} from "@/styles/ui";

const rotulo = config.rotulos.servico;

export default function ServicosPage() {
  const { hidratado, servicos, adicionarServico, removerServico } = useAgenda();
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [duracao, setDuracao] = useState("30");
  const [erro, setErro] = useState<string | null>(null);

  const salvar = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const valor = Number(preco.replace(",", "."));
    const minutos = Number(duracao);

    if (nome.trim() === "") return setErro("Informe o nome.");
    if (!Number.isFinite(valor) || valor <= 0) return setErro("Informe um preço maior que zero.");
    if (!Number.isInteger(minutos) || minutos < 5) return setErro("A duração mínima é de 5 minutos.");

    adicionarServico({ nome: nome.trim(), preco: valor, duracaoMinutos: minutos });
    setNome("");
    setPreco("");
    setDuracao("30");
    setErro(null);
  };

  const remover = (id: string): void => {
    const resultado = removerServico(id);
    setErro(resultado.ok ? null : resultado.erro);
  };

  return (
    <Pagina>
      <Titulo>{rotulo.plural}</Titulo>
      <Descricao>O preço e a duração definem o valor cobrado e o tempo que o horário fica ocupado.</Descricao>

      <Painel>
        <TituloPainel>Adicionar {rotulo.singular.toLowerCase()}</TituloPainel>
        <Formulario onSubmit={salvar} noValidate>
          <Campo>
            Nome
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder={`Ex.: ${rotulo.exemplo}`} />
          </Campo>
          <Campo>
            Preço (R$)
            <Input value={preco} onChange={(e) => setPreco(e.target.value)} inputMode="decimal" placeholder="35,00" />
          </Campo>
          <Campo>
            Duração (minutos)
            <Input type="number" min={5} step={5} value={duracao} onChange={(e) => setDuracao(e.target.value)} />
          </Campo>
          <Botao type="submit">Adicionar</Botao>
        </Formulario>
        {erro && <Mensagem $tipo="erro" role="alert">{erro}</Mensagem>}
      </Painel>

      {!hidratado ? null : servicos.length === 0 ? (
        <Vazio>Lista vazia. Use o formulário acima para começar.</Vazio>
      ) : (
        <Lista>
          {servicos.map((s) => (
            <ItemLista key={s.id}>
              <Info>
                <Destaque>{s.nome}</Destaque>
                <Suave>{s.duracaoMinutos} min</Suave>
              </Info>
              <Acoes>
                <Destaque>{formatarMoeda(s.preco)}</Destaque>
                <Botao $variante="perigo" $pequeno onClick={() => remover(s.id)}>Remover</Botao>
              </Acoes>
            </ItemLista>
          ))}
        </Lista>
      )}
    </Pagina>
  );
}
