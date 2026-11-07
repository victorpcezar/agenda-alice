export const tema = {
  cores: {
    fundo: "#F1F3F4",
    superficie: "#FFFFFF",
    tinta: "#1B2430",
    tintaSuave: "#4F5B6B",
    linha: "#D6DBE0",
    destaque: "#0F766E",
    destaqueFundo: "#DDF1EE",
    perigo: "#B42318",
    perigoFundo: "#FDECEA",
    sucesso: "#27704F",
    sucessoFundo: "#E1F2E9",
    neutroFundo: "#E6EAEE",
  },
  raios: { sm: "4px", md: "8px" },
} as const;

export type Tema = typeof tema;
