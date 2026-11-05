# 02: Tipos Primitivos, Inferência e Imutabilidade

> *"O melhor tipo é aquele que você não precisa escrever manualmente porque o compilador já deduziu com precisão milimétrica."*

---

## 🧱 1. Os Blocos Fundamentais (Tipos Primitivos)

O TypeScript mapeia os tipos primitivos nativos do JavaScript:

| Tipo | Descrição | Exemplo de Valor |
| :--- | :--- | :--- |
| `string` | Textos em formato UTF-16 | `"TypeScript"`, `'Sawabona'`, `` `Hello ${name}` `` |
| `number` | Valores numéricos IEEE 754 de 64 bits (inteiros e decimais) | `42`, `3.1415`, `-10`, `0xFF` |
| `boolean` | Valores lógicos de verdade ou falsidade | `true`, `false` |
| `bigint` | Inteiros de precisão arbitrária acima de $2^{53} - 1$ | `9007199254740991n` |
| `symbol` | Identificadores únicos e imutáveis em memória | `Symbol("unique_key")` |
| `null` | Ausência intencional de valor de objeto | `null` |
| `undefined` | Valor atribuído a variáveis ainda não inicializadas | `undefined` |

```typescript
// Declarações primitivas com inferência automática:
const applicationName = "TypeScript Hub"; // tipo literal: "TypeScript Hub"
let activeUsersCount = 1000;               // tipo: number
let isProductionReady = true;              // tipo: boolean
const entityId = Symbol("order_entity");   // tipo: symbol
```

---

## 🧠 2. Inferência de Tipos vs Anotação Explícita

Uma das dúvidas mais comuns de quem está começando é: *"Devo tipar tudo manualmente?"*

A resposta de acordo com o padrão moderno de mercado (Dan Vanderkam, *Effective TypeScript*, Item 19) é: **NÃO**. Evite anotações redundantes e desnecessárias!

### Ruim: Anotações Barulhentas e Redundantes ❌

```typescript
// Não faça isso! O compilador já sabe perfeitamente que 42 é um number.
const userAge: number = 42;
const userName: string = "Christopher";
const isActive: boolean = true;
```

### Bom: Confie na Inferência e Anote as Fronteiras ✅

```typescript
// Deixe a inferência agir nas variáveis locais:
const userAge = 42;
const userName = "Christopher";

// ANOTE explicitamente nos limites do sistema: parâmetros e retornos de funções públicas:
export function formatCurrency(amountInCents: number, currency = "BRL"): string {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(amount);
}
```

---

## 📚 3. Arrays vs Tuplas

### Arrays Convencionais (`T[]` ou `Array<T>`)
Representam coleções ordenadas homogêneas de tamanho arbitrário:

```typescript
const frameworkTags: string[] = ["react", "nextjs", "vue"];
frameworkTags.push("angular"); // Válido
```

### Tuplas (`[T, U, ...]`)
Tuplas são arrays com **tamanho pré-fixado** e **tipos específicos por índice**. A partir do TypeScript 4.0, podemos adicionar rótulos semânticos (Labeled Tuple Elements) para máxima clareza:

```typescript
// Uma coordenada geográfica possui exatamente dois valores: Latitude e Longitude
type GeoLocation = readonly [latitude: number, longitude: number];

const officeCoordinates: GeoLocation = [-23.5505, -46.6333];

// Tentativas de adicionar um terceiro valor ou alterar posições são bloqueadas pelo compilador:
// officeCoordinates[0] = 10; // 🛑 ERRO: Cannot assign to '0' because it is a read-only property.
```

---

## 🔒 4. Imutabilidade: `readonly` e `ReadonlyArray<T>`

Em Clean Architecture e Programação Funcional, a imutabilidade previne o efeito colateral mais destrutivo de sistemas corporativos: **mutação acidental de estado compartilhado**.

```typescript
// Array mutável (perigoso quando compartilhado entre serviços):
function appendAuditLog(logs: string[], newEntry: string): void {
  logs.push(newEntry); // Modifica o array original!
}

// Array imutável (seguro e funcional):
function appendAuditLogPure(
  logs: ReadonlyArray<string>,
  newEntry: string
): ReadonlyArray<string> {
  // logs.push(newEntry); // 🛑 ERRO: Property 'push' does not exist on type 'readonly string[]'.
  return [...logs, newEntry]; // Retorna uma nova instância protegida
}
```

---

## ⚡ 5. O Superpoder do `as const` (Const Assertions)

O operador `as const` é um dos recursos mais elegantes do TypeScript moderno. Ele realiza duas ações mágicas de uma vez só:
1. Converte todas as propriedades em `readonly` em profundidade (Deep Readonly).
2. Afunila tipos amplos (como `string` ou `number`) para seus **tipos literais exatos**.

### Criando Dicionários Tipados sem Enums Pesados:

```typescript
// 1. Definimos o objeto de constantes imutável:
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 2. Extraímos as chaves: "OK" | "CREATED" | ...
export type HttpStatusKey = keyof typeof HTTP_STATUS;

// 3. Extraímos os valores como uma União Literal Estrita: 200 | 201 | 400 | 401 | 404 | 500
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

// 4. Agora uma função só aceita códigos HTTP genuínos!
export function logHttpResponse(code: HttpStatusCode, path: string): void {
  console.log(`[HTTP Response] ${code} em ${path}`);
}

logHttpResponse(200, "/api/orders"); // ✅ Permitido
// logHttpResponse(999, "/api/orders"); // 🛑 ERRO: Argument of type '999' is not assignable to parameter of type 'HttpStatusCode'.
```

---

## 🛠️ Resumo Prático

1. Confie na **inferência** para variáveis locais e anote explicitamente parâmetros de funções e retornos de contratos.
2. Use **Tuplas** quando a ordem e o tamanho dos elementos carregarem significado estrito de domínio.
3. Adote `readonly` e `ReadonlyArray` para blindar dados contra efeitos colaterais.
4. Prefira objetos com `as const` a `enum` do TypeScript tradicional: gera menos código desnecessário e integra-se nativamente com uniões literais.

