import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html { -webkit-text-size-adjust: 100%; }

  body {
    margin: 0;
    background: ${({ theme }) => theme.cores.fundo};
    color: ${({ theme }) => theme.cores.tinta};
    font-family: var(--fonte), system-ui, -apple-system, "Segoe UI", sans-serif;
    font-size: 1rem;
    line-height: 1.5;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.cores.destaque};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }
`;
