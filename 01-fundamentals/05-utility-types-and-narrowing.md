# 05: Utility Types e Type Narrowing Avançado

> *"Saber transformar tipos existentes com precisão cirúrgica é a marca definitiva de uma pessoa engenheira de software sênior em TypeScript."*

---

## 🛠️ 1. O Arsenal de Utility Types Embutidos

O TypeScript disponibiliza uma coleção de tipos utilitários nativos que operam transformações algébricas sobre tipos existentes:

| Utility Type | O que ele faz? | Exemplo de Aplicação |
| :--- | :--- | :--- |
| `Partial<T>` | Torna todas as propriedades de `T` opcionais (`?`) | Atualizações parciais (`PATCH` requests) |
| `Required<T>` | Torna todas as propriedades de `T` obrigatórias | Validação após preenchimento completo |
| `Readonly<T>` | Torna todas as propriedades de `T` imutáveis | Objetos congelados de configuração |
| `Record<K, T>` | Cria um mapa de chaves `K` com valores do tipo `T` | Dicionários, caches e lookup tables |
| `Pick<T, K>` | Seleciona apenas as propriedades `K` de `T` | DTOs enxutos para visualização |
| `Omit<T, K>` | Remove as propriedades `K` de `T` | Remover senhas/hashes antes de responder à API |
| `ReturnType<T>` | Extrai o tipo retornado por uma função `T` | Inferir retorno de factories e use cases |
| `Awaited<T>` | Desembrulha o tipo contido dentro de uma `Promise` | Descobrir o payload resolvido de chamadas assíncronas |

---

## 🔬 2. Exemplos Práticos de Engenharia com Utility Types

Considere nossa entidade completa de usuário em um banco de dados:

```typescript
export interface UserEntity {
  readonly id: string;
  name: string;
  email: string;
  passwordHash: string;
  roles: readonly string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Cenário 1: Criando um DTO seguro para a API (`Omit`)
Nunca devemos retornar a `passwordHash` na resposta de uma rota HTTP:

```typescript
// Remove a hash de senha da resposta pública
export type UserPublicProfile = Omit<UserEntity, "passwordHash">;
```

### Cenário 2: Atualização Parcial no Banco (`Partial` + `Pick`)
Em uma rota `PATCH /users/:id`, o cliente pode atualizar apenas `name` ou `email`:

```typescript
// Permite atualizar opcionalmente apenas campos editáveis pelo próprio usuário
export type UpdateUserProfileInput = Partial<Pick<UserEntity, "name" | "email">>;

const updatePayload: UpdateUserProfileInput = {
  name: "Christopher M.",
  // email omitido intencionalmente: 100% válido!
};
```

### Cenário 3: Dicionários Estritos com `Record`

```typescript
export type Environment = "development" | "staging" | "production";

export interface DatabaseConfig {
  readonly host: string;
  readonly port: number;
}

// Garante que TODOS os três ambientes estejam obrigatoriamente configurados!
export const ENV_CONFIGS: Record<Environment, DatabaseConfig> = {
  development: { host: "localhost", port: 5432 },
  staging: { host: "staging-db.internal", port: 5432 },
  production: { host: "prod-cluster.internal", port: 5432 },
};
```

---

## 🔍 3. Estratégias de Type Narrowing (Afunilamento de Tipos)

O compilador analisa o fluxo de controle (`control-flow based type analysis`) para estreitar tipos amplos em tipos mais específicos.

### A. Operador `typeof` (Para Primitivos)
```typescript
export function processInput(input: string | number): string {
  if (typeof input === "string") {
    return input.toUpperCase(); // Aqui o TypeScript sabe que é string
  }
  return input.toFixed(2);       // Aqui o TypeScript sabe que é number
}
```

### B. Operador `instanceof` (Para Classes e Erros)
```typescript
export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return `[${error.name}] ${error.message}`;
  }
  return "Erro desconhecido ocorrido no sistema.";
}
```

### C. Operador `in` (Para checagem de propriedades em objetos)
```typescript
export interface PhysicalProduct {
  readonly weightInKg: number;
  readonly shippingAddress: string;
}

export interface DigitalProduct {
  readonly downloadUrl: string;
}

export function calculateShipping(item: PhysicalProduct | DigitalProduct): number {
  if ("weightInKg" in item) {
    return item.weightInKg * 15.0; // item é inferido como PhysicalProduct
  }
  return 0; // item é inferido como DigitalProduct
}
```

---

## 🧙‍♂️ 4. Type Predicates Personalizados (`is`)

Quando a lógica de checagem de tipos for complexa, podemos criar funções de guarda personalizadas usando o operador `is`:

```typescript
export interface ValidAdminUser {
  readonly id: string;
  readonly isAdmin: true;
  readonly permissions: readonly string[];
}

// Type Guard customizado com predicado de tipo:
export function isAdminUser(user: unknown): user is ValidAdminUser {
  return (
    typeof user === "object" &&
    user !== null &&
    "isAdmin" in user &&
    (user as { isAdmin: unknown }).isAdmin === true &&
    "permissions" in user &&
    Array.isArray((user as { permissions: unknown }).permissions)
  );
}

// Consumo seguro:
export function grantAccess(userCandidate: unknown): void {
  if (isAdminUser(userCandidate)) {
    // Aqui dentro, 'userCandidate' tem o tipo exato 'ValidAdminUser'!
    console.log(`Permissões do Administrador: ${userCandidate.permissions.join(", ")}`);
  } else {
    console.log("Acesso negado: o usuário não é um administrador válido.");
  }
}
```

---

## ⚡ 5. Funções de Asserção (`asserts condition`)

Introduzidas no TypeScript 3.7, funções de asserção interrompem o fluxo de execução se uma condição não for verdadeira, ensinando ao compilador que a variável é válida dali em diante:

```typescript
export function assertNonNull<T>(
  value: T,
  errorMessage: string
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(`[Assertion Failure]: ${errorMessage}`);
  }
}

// Uso:
const rawToken: string | null = process.env.API_SECRET_TOKEN ?? null;

// Garante que não é nulo ou interrompe a execução
assertNonNull(rawToken, "API_SECRET_TOKEN precisa estar definido no .env!");

// A partir desta linha, 'rawToken' é garantidamente 'string' (sem 'null')!
console.log(`Token com ${rawToken.length} caracteres.`);
```

---

## 🏁 Conclusão do Módulo 01

Você agora compreende a fundação sólida do TypeScript:
1. Sabe por que TypeScript existe e como funciona o Compile Time vs Runtime.
2. Sabe tirar proveito da inferência, de imutabilidade e de `as const`.
3. Sabe modelar dados com Discriminated Unions para erradicar estados inválidos.
4. Constrói abstrações com Generics sem cair na armadilha do over-engineering.
5. Manipula e estreita tipos cirurgicamente com Utility Types e Type Predicates.

Agora vá para o terminal e execute os playgrounds interativos para ver tudo isso rodando em tempo real:
`npm run play:basics`, `npm run play:generics` e `npm run play:unions`!

