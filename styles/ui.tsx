import styled, { css } from "styled-components";
import type { StatusAgendamento } from "@/types/agendamento";

export const Pagina = styled.main`
  max-width: 880px;
  margin: 0 auto;
  padding: 32px 20px 72px;
`;

export const Titulo = styled.h1`
  margin: 0 0 8px;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
`;

export const Descricao = styled.p`
  margin: 0 0 28px;
  max-width: 60ch;
  color: ${({ theme }) => theme.cores.tintaSuave};
`;

export const Painel = styled.section`
  margin-bottom: 24px;
  padding: 20px;
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.linha};
  border-radius: ${({ theme }) => theme.raios.md};
`;

export const TituloPainel = styled.h2`
  margin: 0 0 16px;
  font-size: 1.05rem;
  font-weight: 700;
`;

export const Formulario = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 16px;
  align-items: end;
`;

export const Campo = styled.label`
  display: grid;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const controle = css`
  min-height: 44px;
  padding: 10px 12px;
  font: inherit;
  font-weight: 400;
  color: ${({ theme }) => theme.cores.tinta};
  background: #fff;
  border: 1px solid ${({ theme }) => theme.cores.linha};
  border-radius: ${({ theme }) => theme.raios.sm};
`;

export const Input = styled.input`
  ${controle}
`;

export const Select = styled.select`
  ${controle}
`;

type Variante = "primario" | "perigo" | "neutro";

export const Botao = styled.button<{ $variante?: Variante; $pequeno?: boolean }>`
  min-height: ${({ $pequeno }) => ($pequeno ? "36px" : "44px")};
  padding: 0 ${({ $pequeno }) => ($pequeno ? "12px" : "18px")};
  font: inherit;
  font-size: ${({ $pequeno }) => ($pequeno ? "0.875rem" : "1rem")};
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.raios.sm};

  ${({ $variante = "primario", theme }) =>
    $variante === "primario"
      ? css`
          background: ${theme.cores.tinta};
          color: #fff;
        `
      : $variante === "perigo"
        ? css`
            background: transparent;
            color: ${theme.cores.perigo};
            border-color: ${theme.cores.perigo};
          `
        : css`
            background: transparent;
            color: ${theme.cores.tinta};
            border-color: ${theme.cores.linha};
          `}

  &:hover:not(:disabled) { filter: brightness(0.92); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const Mensagem = styled.p<{ $tipo: "erro" | "info" }>`
  margin: 12px 0 0;
  padding: 10px 12px;
  font-size: 0.9rem;
  border-radius: ${({ theme }) => theme.raios.sm};
  background: ${({ $tipo, theme }) => ($tipo === "erro" ? theme.cores.perigoFundo : theme.cores.destaqueFundo)};
  color: ${({ $tipo, theme }) => ($tipo === "erro" ? theme.cores.perigo : theme.cores.destaque)};
`;

export const Lista = styled.ul`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const ItemLista = styled.li`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.linha};
  border-radius: ${({ theme }) => theme.raios.md};
`;

export const Info = styled.div`
  display: grid;
  gap: 2px;
  min-width: 0;
`;

export const Destaque = styled.strong`
  font-weight: 700;
`;

export const Suave = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.cores.tintaSuave};
`;

export const Acoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const Vazio = styled.div`
  padding: 24px;
  text-align: center;
  color: ${({ theme }) => theme.cores.tintaSuave};
  border: 1px dashed ${({ theme }) => theme.cores.linha};
  border-radius: ${({ theme }) => theme.raios.md};
`;

export const Filtros = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

export const Aba = styled.button<{ $ativa: boolean }>`
  min-height: 36px;
  padding: 0 14px;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 999px;
  border: 1px solid ${({ $ativa, theme }) => ($ativa ? theme.cores.tinta : theme.cores.linha)};
  background: ${({ $ativa, theme }) => ($ativa ? theme.cores.tinta : "transparent")};
  color: ${({ $ativa, theme }) => ($ativa ? "#fff" : theme.cores.tinta)};
`;

const ROTULOS_STATUS: Record<StatusAgendamento, string> = {
  pendente: "Pendente",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const StyledSelo = styled.span<{ $status: StatusAgendamento }>`
  padding: 2px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 999px;
  background: ${({ $status, theme }) =>
    $status === "pendente"
      ? theme.cores.destaqueFundo
      : $status === "concluido"
        ? theme.cores.sucessoFundo
        : theme.cores.neutroFundo};
  color: ${({ $status, theme }) =>
    $status === "pendente" ? theme.cores.destaque : $status === "concluido" ? theme.cores.sucesso : theme.cores.tintaSuave};
`;

export function Selo({ status }: { status: StatusAgendamento }) {
  return <StyledSelo $status={status}>{ROTULOS_STATUS[status]}</StyledSelo>;
}
