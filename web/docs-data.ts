/**
 * Registro de Documentação e Carregamento Dinâmico de Markdowns e Códigos
 */

export interface DocItem {
  id: string;
  title: string;
  badge?: string;
  filePath: string;
  isCode?: boolean;
  codeLang?: string;
  runCommand?: string;
}

export interface DocSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: DocItem[];
}

// Vite carrega todos os markdowns e arquivos de código como strings brutas em tempo de build/dev
const rawFiles = import.meta.glob(
  ["/README.md", "/0*/**/*.md", "/0*/**/*.ts"],
  { query: "?raw", eager: true, import: "default" }
) as Record<string, string>;

// Função auxiliar para localizar o conteúdo de um arquivo independente do prefixo
export function getFileContent(targetPath: string): string {
  // Procura por correspondência exata ou sufixo
  const cleanTarget = targetPath.replace(/^[./\\]+/, "").replace(/\\/g, "/");

  for (const [key, content] of Object.entries(rawFiles)) {
    const cleanKey = key.replace(/^[./\\]+/, "").replace(/\\/g, "/");
    if (cleanKey === cleanTarget || cleanKey.endsWith(cleanTarget)) {
      return content;
    }
  }

  return `# Arquivo não encontrado\n\nO caminho \`${targetPath}\` não pôde ser carregado no navegador.`;
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "overview",
    title: "Visão Geral",
    icon: "Compass",
    description: "Portal principal e manifesto do TypeScript Hub",
    items: [
      {
        id: "readme",
        title: "Guia Principal & Roadmap",
        badge: "Start",
        filePath: "README.md",
      },
    ],
  },
  {
    id: "01-fundamentals",
    title: "01. Fundamentos",
    icon: "Zap",
    description: "Tipagem estrita, inferência, contratos e Generics",
    items: [
      {
        id: "m1-readme",
        title: "Visão do Módulo & Código em Inglês",
        filePath: "01-fundamentals/README.md",
      },
      {
        id: "m1-why",
        title: "01. Runtime vs Compile Time",
        filePath: "01-fundamentals/01-why-typescript.md",
      },
      {
        id: "m1-primitives",
        title: "02. Primitivos, Tuplas & Imutabilidade",
        filePath: "01-fundamentals/02-primitives-and-inference.md",
      },
      {
        id: "m1-unions",
        title: "03. Interfaces & Discriminated Unions",
        filePath: "01-fundamentals/03-interfaces-types-and-unions.md",
      },
      {
        id: "m1-generics",
        title: "04. Dominando Generics <T>",
        filePath: "01-fundamentals/04-generics-mastery.md",
      },
      {
        id: "m1-utility",
        title: "05. Utility Types & Narrowing",
        filePath: "01-fundamentals/05-utility-types-and-narrowing.md",
      },
      {
        id: "code-basics",
        title: "Playground: Primitives & Unions",
        badge: "TS Code",
        filePath: "01-fundamentals/playground/01-primitives-and-unions.ts",
        isCode: true,
        codeLang: "typescript",
        runCommand: "npm run play:basics",
      },
      {
        id: "code-generics",
        title: "Playground: Generics Validator",
        badge: "TS Code",
        filePath: "01-fundamentals/playground/02-generics-in-practice.ts",
        isCode: true,
        codeLang: "typescript",
        runCommand: "npm run play:generics",
      },
      {
        id: "code-unions",
        title: "Playground: Motion State Machine",
        badge: "TS Code",
        filePath: "01-fundamentals/playground/03-discriminated-unions.ts",
        isCode: true,
        codeLang: "typescript",
        runCommand: "npm run play:unions",
      },
    ],
  },
  {
    id: "02-ecosystem",
    title: "02. Ecossistema 2026",
    icon: "Globe",
    description: "Web, Runtimes, Mobile, Desktop e Agentes de IA",
    items: [
      {
        id: "m2-readme",
        title: "Visão 360º do Mercado",
        filePath: "02-ecosystem-and-platforms/README.md",
      },
      {
        id: "m2-web",
        title: "01. Web Frontend & Next.js Actions",
        filePath: "02-ecosystem-and-platforms/01-web-frontend-and-fullstack.md",
      },
      {
        id: "m2-backend",
        title: "02. Node, Bun, Fastify & Drizzle",
        filePath: "02-ecosystem-and-platforms/02-backend-apis-and-databases.md",
      },
      {
        id: "m2-mobile-desktop",
        title: "03. React Native, Expo, Electron & Tauri",
        filePath: "02-ecosystem-and-platforms/03-mobile-and-desktop.md",
      },
      {
        id: "m2-ai-motion",
        title: "04. Engines, CLIs & AI Agents (MCP)",
        filePath: "02-ecosystem-and-platforms/04-games-motion-cli-and-ai.md",
      },
    ],
  },
  {
    id: "03-architecture",
    title: "03. Arquitetura & SOLID",
    icon: "Layers",
    description: "Clean Code, S.O.L.I.D., Clean Architecture & DDD",
    items: [
      {
        id: "m3-readme",
        title: "Introdução à Engenharia Limpa",
        filePath: "03-architecture-and-solid/README.md",
      },
      {
        id: "m3-clean-code",
        title: "01. Princípios de Clean Code",
        filePath: "03-architecture-and-solid/01-clean-code-principles.md",
      },
      {
        id: "m3-solid",
        title: "02. Mergulho Profundo no S.O.L.I.D.",
        filePath: "03-architecture-and-solid/02-solid-deep-dive.md",
      },
      {
        id: "m3-clean-arch",
        title: "03. Clean Architecture & DDD",
        filePath: "03-architecture-and-solid/03-clean-architecture-and-ddd.md",
      },
      {
        id: "code-solid-violations",
        title: "Código: Anti-padrão (God Class)",
        badge: "Anti-pattern",
        filePath: "03-architecture-and-solid/examples/01-solid-violations.ts",
        isCode: true,
        codeLang: "typescript",
        runCommand: "npm run play:solid:violations",
      },
      {
        id: "code-solid-refactored",
        title: "Código: Sistema Limpo Refatorado",
        badge: "Clean Code",
        filePath: "03-architecture-and-solid/examples/02-solid-and-clean-arch-refactored.ts",
        isCode: true,
        codeLang: "typescript",
        runCommand: "npm run play:solid",
      },
    ],
  },
  {
    id: "04-cases",
    title: "04. Estudos de Caso",
    icon: "BookOpen",
    description: "Engenharia reversa em 4 repositórios open-source reais",
    items: [
      {
        id: "m4-readme",
        title: "Como Aprender com Repositórios Reais",
        filePath: "04-case-studies/README.md",
      },
      {
        id: "m4-mini-seller",
        title: "01. mini-seller: Modelagem de Domínio",
        filePath: "04-case-studies/01-mini-seller-domain-modeling.md",
      },
      {
        id: "m4-sawabona-forms",
        title: "02. sawabona-forms: Generics & ISP",
        filePath: "04-case-studies/02-sawabona-forms-generics-and-isp.md",
      },
      {
        id: "m4-motion-engine",
        title: "03. motion-engine: Matemática & OCP",
        filePath: "04-case-studies/03-motion-engine-ocp-and-contracts.md",
      },
      {
        id: "m4-saas-boilerplate",
        title: "04. saas-boilerplate: Clean Full-Stack",
        filePath: "04-case-studies/04-saas-boilerplate-clean-fullstack.md",
      },
    ],
  },
  {
    id: "05-project",
    title: "05. Projeto Prático",
    icon: "Rocket",
    description: "Mini-sistema comercial com Clean Architecture e SOLID",
    items: [
      {
        id: "m5-readme",
        title: "Guia Completo do Mini-Sistema",
        filePath: "05-hands-on-project/README.md",
      },
      {
        id: "code-project-main",
        title: "Bootstrap: main.ts",
        badge: "Run Me",
        filePath: "05-hands-on-project/src/main.ts",
        isCode: true,
        codeLang: "typescript",
        runCommand: "npm run start:project",
      },
      {
        id: "code-project-product",
        title: "Domínio: Product Entity",
        badge: "Domain",
        filePath: "05-hands-on-project/src/domain/entities/Product.ts",
        isCode: true,
        codeLang: "typescript",
      },
      {
        id: "code-project-order",
        title: "Domínio: Order Entity",
        badge: "Domain",
        filePath: "05-hands-on-project/src/domain/entities/Order.ts",
        isCode: true,
        codeLang: "typescript",
      },
      {
        id: "code-project-validator",
        title: "Shared: FormValidator Engine",
        badge: "Generics",
        filePath: "05-hands-on-project/src/shared/FormValidator.ts",
        isCode: true,
        codeLang: "typescript",
      },
      {
        id: "code-project-motion",
        title: "Shared: MotionTimeline",
        badge: "Motion",
        filePath: "05-hands-on-project/src/shared/MotionTimeline.ts",
        isCode: true,
        codeLang: "typescript",
      },
      {
        id: "code-project-usecase",
        title: "Application: CreateOrderUseCase",
        badge: "UseCase",
        filePath: "05-hands-on-project/src/application/use-cases/CreateOrderUseCase.ts",
        isCode: true,
        codeLang: "typescript",
      },
      {
        id: "code-project-repo",
        title: "Infra: InMemoryOrderRepository",
        badge: "Infra",
        filePath: "05-hands-on-project/src/infra/repositories/InMemoryOrderRepository.ts",
        isCode: true,
        codeLang: "typescript",
      },
    ],
  },
  {
    id: "06-library",
    title: "06. Biblioteca & Assets",
    icon: "Library",
    description: "Livros recomendados, playgrounds e glossário bilíngue",
    items: [
      {
        id: "m6-readme",
        title: "Livros & Ferramentas Essenciais",
        filePath: "06-library-books-and-assets/README.md",
      },
      {
        id: "m6-glossary",
        title: "Glossário Técnico Inglês/Português",
        badge: "Glossary",
        filePath: "06-library-books-and-assets/typescript-english-glossary.md",
      },
    ],
  },
];

// Retorna uma lista plana de todos os itens de documentação
export const ALL_DOCS = DOC_SECTIONS.flatMap((sec) =>
  sec.items.map((item) => ({ ...item, sectionTitle: sec.title }))
);

