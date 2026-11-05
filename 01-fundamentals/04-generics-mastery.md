# 04: Dominando Generics (Parâmetros de Tipo)

> *"Generics são para os tipos o que funções são para os valores: uma forma elegante de abstrair e reutilizar lógica sem perder especificidade."*

---

## 🧩 1. O que são Generics? (A Analogia da Função)

Pense em uma função JavaScript comum:

```javascript
// Uma função recebe um 'parâmetro de valor' e opera sobre ele:
function identity(value) {
  return value;
}
```

**Generics** funcionam exatamente da mesma forma, mas em vez de receberem valores em tempo de execução, recebem **tipos em tempo de compilação**:

```typescript
// Uma função genérica recebe um 'parâmetro de tipo' <T> e preserva sua assinatura:
export function identity<T>(value: T): T {
  return value;
}

const numberResult = identity(42);         // numberResult é inferido como 'number'
const stringResult = identity("Sawabona"); // stringResult é inferido como 'string'
```

Sem Generics, a única alternativa no TypeScript seria usar `any` (perdendo toda a segurança) ou duplicar funções para cada tipo primitivo existente.

---

## 🔒 2. Restrições Genéricas (`extends`)

Por padrão, um tipo genérico `<T>` pode ser qualquer coisa (`string`, `number`, `boolean`, `null`, `object`). No entanto, em sistemas reais, frequentemente precisamos garantir que o tipo recebido possua certas propriedades fundamentais.

Usamos a palavra-chave `extends` para aplicar **Restrições de Tipo (Generic Constraints)**:

```typescript
export interface HasEntityId {
  readonly id: string;
}

// TDEVE conter pelo menos a propriedade 'id: string'
export function findById<T extends HasEntityId>(
  collection: ReadonlyArray<T>,
  targetId: string
): T | null {
  return collection.find((item) => item.id === targetId) ?? null;
}

interface UserAccount {
  readonly id: string;
  readonly username: string;
}

const users: UserAccount[] = [
  { id: "usr_1", username: "ana_clara" },
  { id: "usr_2", username: "carlos_dev" },
];

const foundUser = findById(users, "usr_1"); // Retorna UserAccount | null (totalmente tipado!)

// Se tentarmos passar um objeto sem 'id':
// findById([{ name: "Objeto sem ID" }], "123"); 
// 🛑 ERRO: Property 'id' is missing in type...
```

---

## 🗃️ 3. Generics na Prática: Repositório Abstrato (Clean Architecture)

Em arquitetura de software, utilizamos interfaces genéricas para definir operações padronizadas de banco de dados para qualquer entidade de domínio:

```typescript
export interface Repository<TEntity extends HasEntityId> {
  save(entity: TEntity): Promise<void>;
  findById(id: string): Promise<TEntity | null>;
  findAll(): Promise<ReadonlyArray<TEntity>>;
  delete(id: string): Promise<boolean>;
}

// Implementação em memória genérica:
export class InMemoryGenericRepository<TEntity extends HasEntityId>
  implements Repository<TEntity>
{
  private readonly storage = new Map<string, TEntity>();

  public async save(entity: TEntity): Promise<void> {
    this.storage.set(entity.id, entity);
  }

  public async findById(id: string): Promise<TEntity | null> {
    return this.storage.get(id) ?? null;
  }

  public async findAll(): Promise<ReadonlyArray<TEntity>> {
    return Array.from(this.storage.values());
  }

  public async delete(id: string): Promise<boolean> {
    return this.storage.delete(id);
  }
}
```

---

## 🪄 4. Generics com Mapped Types (O Padrão Sawabona-Forms)

Um dos usos mais sofisticados de Generics ocorre quando queremos derivar um schema de validação diretamente a partir da interface de um formulário:

```typescript
// Tipo que recebe uma função de validação para um valor específico
export type Validator<T> = (value: T) => string | null;

// Mapped Type: para cada chave K da interface TForm, esperamos um validador específico
export type FormValidationSchema<TForm extends object> = {
  readonly [K in keyof TForm]?: Validator<TForm[K]>;
};

// Exemplo de Formulário de Checkout:
interface CheckoutForm {
  email: string;
  installments: number;
}

// O TypeScript não permite que o validador de 'email' receba um number,
// nem que o validador de 'installments' receba uma string!
const checkoutValidation: FormValidationSchema<CheckoutForm> = {
  email: (val) => (val.includes("@") ? null : "E-mail inválido"),
  installments: (val) => (val > 0 && val <= 12 ? null : "Parcelamento deve ser de 1 a 12x"),
};
```

---

## ⚠️ 5. O Perigo do "Generics Excessivo" (Over-engineering)

Generics são como tempero: essenciais, mas na dose errada arruínam a receita. 

### Evite Generics Inúteis ❌

```typescript
// Desnecessário: T não traz nenhum valor aqui
function printName<T extends string>(name: T): void {
  console.log(name);
}

// Muito mais simples, direto e limpo:
function printNameSimple(name: string): void {
  console.log(name);
}
```

### Regra de Ouro:
Se o parâmetro genérico `<T>` aparece **apenas uma vez** na assinatura da função e não conecta a entrada ao retorno nem restringe outros parâmetros, você provavelmente **não precisa** de um Generic!

