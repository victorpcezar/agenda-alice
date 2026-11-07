"use client";

import { useState, type FormEvent } from "react";
import { config } from "@/config/app";
import { useAgenda } from "@/context/AgendaProvider";
import { contarDigitos, formatarTelefone } from "@/lib/format";
import {
  Acoes, Botao, Campo, Descricao, Destaque, Formulario, Info, Input, ItemLista,
  Lista, Mensagem, Pagina, Painel, Suave, Titulo, TituloPainel, Vazio,
} from "@/styles/ui";

const rotulo = config.rotulos.cliente;

export default function ClientesPage() {
  const { hidratado, clientes, adicionarCliente, removerCliente } = useAgenda();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const salvar = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (nome.trim() === "") return setErro("Informe o nome.");
    if (contarDigitos(telefone) < 10) return setErro("Informe o telefone com DDD.");

    adicionarCliente({ nome: nome.trim(), telefone });
    setNome("");
    setTelefone("");
    setErro(null);
  };

  const remover = (id: string): void => {
    const resultado = removerCliente(id);
    setErro(resultado.ok ? null : resultado.erro);
  };

  return (
    <Pagina>
      <Titulo>{rotulo.plural}</Titulo>
      <Descricao>Cadastre os contatos para agendar em poucos toques.</Descricao>

      <Painel>
        <TituloPainel>Adicionar {rotulo.singular.toLowerCase()}</TituloPainel>
        <Formulario onSubmit={salvar} noValidate>
          <Campo>
            Nome
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder={`Ex.: ${rotulo.exemplo}`} />
          </Campo>
          <Campo>
            Telefone
            <Input
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              inputMode="tel"
              placeholder="(21) 99999-9999"
            />
          </Campo>
          <Botao type="submit">Adicionar</Botao>
        </Formulario>
        {erro && <Mensagem $tipo="erro" role="alert">{erro}</Mensagem>}
      </Painel>

      {!hidratado ? null : clientes.length === 0 ? (
        <Vazio>Lista vazia. Use o formulário acima para começar.</Vazio>
      ) : (
        <Lista>
          {clientes.map((c) => (
            <ItemLista key={c.id}>
              <Info>
                <Destaque>{c.nome}</Destaque>
                <Suave>{c.telefone}</Suave>
              </Info>
              <Acoes>
                <Botao $variante="perigo" $pequeno onClick={() => remover(c.id)}>Remover</Botao>
              </Acoes>
            </ItemLista>
          ))}
        </Lista>
      )}
    </Pagina>
  );
}
