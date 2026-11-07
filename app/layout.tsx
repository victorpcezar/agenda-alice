import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import type { ReactNode } from "react";
import { config } from "@/config/app";
import Providers from "./providers";

const archivo = Archivo({ subsets: ["latin"], variable: "--fonte", display: "swap" });

export const metadata: Metadata = {
  title: config.nomeNegocio,
  description: config.descricao,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={archivo.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
