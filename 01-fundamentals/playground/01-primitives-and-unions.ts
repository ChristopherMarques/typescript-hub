/**
 * ============================================================================
 * 🎓 FUNDAMENTOS DE TYPESCRIPT: PRIMITIVOS, TUPLAS, LITERAIS E UNIONS
 * ============================================================================
 *
 * Este script demonstra os tipos primitivos e estruturas básicas do TypeScript,
 * enfatizando imutabilidade, 'const assertions' e Narrowing de Tipos.
 *
 * Como rodar:
 *   npx tsx 01-fundamentals/playground/01-primitives-and-unions.ts
 *   ou: npm run play:basics
 */

// ============================================================================
// 1. TIPOS PRIMITIVOS E INFERÊNCIA
// ============================================================================

/**
 * No TypeScript moderno (2026), confiamos na inferência de tipos sempre que o
 * compilador puder deduzir o tipo de forma óbvia e inequívoca.
 */
const platformName = "TypeScript Hub"; // inferido como literal "TypeScript Hub" por ser 'const'
let activeStudentsCount = 1420;        // inferido como 'number'
let isAcademyOpen = true;              // inferido como 'boolean'
const uniqueCourseId = Symbol("hub_id"); // tipo primitivo 'symbol' para identificação única

console.log("--- 1. Primitivos e Inferência ---");
console.log(`Plataforma: ${platformName}`);
console.log(`Alunos ativos: ${activeStudentsCount} | Aberto: ${isAcademyOpen}`);
console.log(`Identificador único: ${uniqueCourseId.toString()}\n`);

// ============================================================================
// 2. ARRAYS, ARRAYS SOMENTE-LEITURA E TUPLAS
// ============================================================================

/**
 * Arrays comuns permitem mutação (.push, .pop). Em arquiteturas limpas,
 * preferimos imutabilidade para evitar bugs silenciosos e efeitos colaterais.
 */
const courseTags: string[] = ["typescript", "clean-architecture", "solid"];

/**
 * 'ReadonlyArray<T>' (ou 'readonly T[]') proíbe modificações no array após sua criação.
 */
const supportedRuntimes: readonly string[] = ["Node.js", "Bun", "Deno", "Browser"];

/**
 * Tuplas são arrays com tamanho fixo e tipos pré-definidos para cada posição.
 * Muito úteis para coordenadas, pares chave-valor e retornos múltiplos (como useState).
 */
type GeoCoordinates = readonly [latitude: number, longitude: number];
const saoPauloLocation: GeoCoordinates = [-23.5505, -46.6333];

/**
 * Tupla com elemento opcional e rótulos semânticos (Labeled Tuple Elements)
 */
type ScoreEntry = [studentName: string, score: number, feedbackNote?: string];

const studentA: ScoreEntry = ["Lucas Silva", 98, "Excelente domínio de Generics!"];
const studentB: ScoreEntry = ["Mariana Costa", 100];

console.log("--- 2. Imutabilidade e Tuplas ---");
console.log("Tags:", courseTags.join(", "));
console.log("Runtimes suportados:", supportedRuntimes.join(" | "));
console.log(`Coordenadas SP: Lat ${saoPauloLocation[0]}, Lon ${saoPauloLocation[1]}`);
console.log(`Aluno A: ${studentA[0]} - Nota: ${studentA[1]} (${studentA[2]})`);
console.log(`Aluno B: ${studentB[0]} - Nota: ${studentB[1]} (Sem observações)\n`);

// ============================================================================
// 3. 'as const' (CONST ASSERTIONS) E LITERAL TYPES
// ============================================================================

/**
 * 'as const' transforma objetos e arrays em estruturas profundamente imutáveis (deep readonly)
 * e estreita tipos genéricos (como 'string') para seus valores literais exatos.
 */
const USER_ROLES = {
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
  INSTRUCTOR: "INSTRUCTOR",
} as const;

/**
 * Podemos extrair os valores válidos do objeto acima como um tipo estrito:
 * typeof USER_ROLES -> { readonly ADMIN: "ADMIN"; ... }
 * keyof typeof USER_ROLES -> "ADMIN" | "STUDENT" | "INSTRUCTOR"
 * (typeof USER_ROLES)[keyof typeof USER_ROLES] -> "ADMIN" | "STUDENT" | "INSTRUCTOR"
 */
type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

function authorizeAccess(role: UserRole): string {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "🔓 Acesso total concedido (Painel Administrativo).";
    case USER_ROLES.INSTRUCTOR:
      return "📚 Acesso concedido para edição e correção de exercícios.";
    case USER_ROLES.STUDENT:
      return "🎓 Acesso liberado para trilha de aulas e projetos práticos.";
  }
}

console.log("--- 3. Const Assertions ('as const') ---");
console.log(authorizeAccess(USER_ROLES.STUDENT));
console.log(authorizeAccess(USER_ROLES.ADMIN) + "\n");

// ============================================================================
// 4. UNION TYPES E TYPE NARROWING (AFUNILAMENTO DE TIPOS)
// ============================================================================

/**
 * Discriminated Unions (Uniões Discriminadas):
 * Uma das armas mais poderosas do TypeScript. Adicionamos uma propriedade comum
 * (o 'discriminador', como 'status') que permite ao compilador saber com 100% de certeza
 * quais campos existem dentro de cada bloco if/switch.
 */
export interface FetchPendingState {
  readonly status: "idle" | "loading";
}

export interface FetchSuccessState<TData> {
  readonly status: "success";
  readonly data: TData;
  readonly receivedAt: Date;
}

export interface FetchErrorState {
  readonly status: "error";
  readonly errorMessage: string;
  readonly errorCode: number;
}

export type AsyncState<TData> =
  | FetchPendingState
  | FetchSuccessState<TData>
  | FetchErrorState;

/**
 * Função de renderização que consome a união discriminada.
 * O TypeScript nos impede de acessar '.data' se o 'status' não for 'success'!
 */
function renderAsyncState<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case "idle":
      return "⏳ Sistema ocioso. Aguardando comando...";
    case "loading":
      return "🔄 Carregando dados do servidor...";
    case "success":
      return `✅ Dados recebidos com sucesso em ${state.receivedAt.toISOString()}: ${JSON.stringify(state.data)}`;
    case "error":
      return `❌ Erro (${state.errorCode}): ${state.errorMessage}`;
  }
}

console.log("--- 4. Discriminated Unions e Type Narrowing ---");

const pendingState: AsyncState<string> = { status: "loading" };
console.log(renderAsyncState(pendingState));

const successState: AsyncState<{ module: string; completionPercentage: number }> = {
  status: "success",
  data: { module: "01-fundamentals", completionPercentage: 100 },
  receivedAt: new Date(),
};
console.log(renderAsyncState(successState));

const errorState: AsyncState<never> = {
  status: "error",
  errorMessage: "Falha na conexão com o servidor de autenticação.",
  errorCode: 503,
};
console.log(renderAsyncState(errorState));

