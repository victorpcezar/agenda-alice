"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { config } from "@/config/app";

const { rotulos } = config;

const LINKS = [
  { href: "/", rotulo: rotulos.agenda },
  { href: "/clientes", rotulo: rotulos.cliente.plural },
  { href: "/servicos", rotulo: rotulos.servico.plural },
] as const;

const Barra = styled.header`
  background: ${({ theme }) => theme.cores.superficie};
  border-top: 6px solid ${({ theme }) => theme.cores.destaque};
  border-bottom: 1px solid ${({ theme }) => theme.cores.linha};
`;

const Conteudo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 24px;
  max-width: 880px;
  margin: 0 auto;
  padding: 14px 20px;
`;

const Marca = styled.span`
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

const Nav = styled.nav`
  display: flex;
  gap: 4px;
`;

const ItemNav = styled(Link)<{ $ativo: boolean }>`
  padding: 8px 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.cores.tinta};
  text-decoration: none;
  border-bottom: 3px solid ${({ $ativo, theme }) => ($ativo ? theme.cores.destaque : "transparent")};
`;

export default function Cabecalho() {
  const caminho = usePathname();

  return (
    <Barra>
      <Conteudo>
        <Marca>{config.nomeNegocio}</Marca>
        <Nav aria-label="Principal">
          {LINKS.map(({ href, rotulo }) => (
            <ItemNav
              key={href}
              href={href}
              $ativo={caminho === href}
              aria-current={caminho === href ? "page" : undefined}
            >
              {rotulo}
            </ItemNav>
          ))}
        </Nav>
      </Conteudo>
    </Barra>
  );
}
