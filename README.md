# Agenda (app genérico de agendamentos)

Next.js (App Router) + TypeScript estrito + styled-components. Dados salvos no `localStorage`.

## Rodar

    npm install
    npm run dev

## Adaptar para outro negócio

Edite **apenas `config/app.ts`**:

- `nomeNegocio` e `descricao`: título do cabeçalho e da aba do navegador.
- `rotulos`: nomes exibidos para cliente e serviço (ex.: "Paciente", "Procedimento").
- `servicosIniciais`: serviços de exemplo criados na primeira abertura.
- `permitirSobreposicao`: `false` para um único profissional (bloqueia horários conflitantes).
- `prefixoStorage`: mude para cada novo negócio, para não misturar dados no mesmo navegador.

Cores e raios ficam em `styles/theme.ts`.

## Estrutura

    config/app.ts              configuração do negócio
    types/agendamento.ts       modelos de dados
    context/AgendaProvider.tsx estado e regras de negócio
    hooks/useLocalStorage.ts   persistência segura para SSR
    lib/                       formatação, validação (guards) e utilitários
    styles/                    tema, estilos globais e componentes de UI
    app/                       páginas: / (agenda), /clientes, /servicos
# agenda-alice
