"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import StyledComponentsRegistry from "@/lib/registry";
import { AgendaProvider } from "@/context/AgendaProvider";
import { GlobalStyle } from "@/styles/GlobalStyle";
import { tema } from "@/styles/theme";
import Cabecalho from "@/components/Cabecalho";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={tema}>
        <GlobalStyle />
        <AgendaProvider>
          <Cabecalho />
          {children}
        </AgendaProvider>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
