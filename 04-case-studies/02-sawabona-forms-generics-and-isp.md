# Estudo de Caso 02: Generics e Segregação de Interfaces (`sawabona-forms`)

> **Repositório de Referência**: [`https://github.com/ChristopherMarques/sawabona-forms`](https://github.com/ChristopherMarques/sawabona-forms)  
> **Foco Primário**: Generics de Alta Ordem, Mapped Types, Inferência Estrita de Schemas e Interface Segregation Principle (ISP).

---

## 🎯 1. O Desafio de Bibliotecas de Formulário

A maioria das bibliotecas de formulários no ecossistema JavaScript comete um de dois erros capitais:
1. Ou são **frouxas em tipagem**, tratando campos como `any` ou `string` simples e permitindo que erros de digitação passem batidos.
2. Ou criam **interfaces gigantescas ("gordas")**, forçando componentes de UI a dependerem de centenas de métodos de submissão, manipulação de histórico e eventos que eles não utilizam.

O **`sawabona-forms`** resolveu isso combinando **Generics** com o **Interface Segregation Principle (ISP)**.

---

## 🔬 2. Dissecação da Tipagem com Mapped Types

O motor do `sawabona-forms` permite definir validadores específicos para o tipo de cada propriedade de um formulário:

```typescript
// 1. Função de validação unitária tipada para um valor específico
export type FieldValidator<TValue> = (value: TValue) => string | null;

// 2. Mapped Type: para cada chave K do formulário TFormData, associamos um validador de TFormData[K]
export type SchemaRules<TFormData extends object> = {
  readonly [K in keyof TFormData]?: readonly FieldValidator<TFormData[K]>[];
};
```

Quando um usuário define o schema para um formulário de cadastro, o TypeScript confere tudo:

```typescript
interface SignUpPayload {
  username: string;
  age: number;
}

// O TypeScript não permite colocar um validador de number no campo 'username'!
const rules: SchemaRules<SignUpPayload> = {
  username: [(val) => (val.length < 3 ? "Nome muito curto" : null)],
  age: [(val) => (val < 18 ? "Deve ser maior de idade" : null)],
};
```

---

## 🏛️ 3. O Princípio SOLID em Destaque: ISP (Interface Segregation)

Em vez de criar uma única interface monstruosa contendo o estado visual, os erros e os métodos de submissão, o projeto dividiu as responsabilidades em interfaces minúsculas:

```typescript
// 1. Apenas o estado do valor do campo
export interface FieldValueState<T> {
  readonly value: T;
  readonly isDirty: boolean;
  readonly isTouched: boolean;
}

// 2. Apenas os erros de validação
export interface FieldValidationState {
  readonly isValid: boolean;
  readonly errors: readonly string[];
}

// 3. Apenas as ações de alteração
export interface FieldActions<T> {
  setValue(newValue: T): void;
  touch(): void;
  reset(): void;
}

// O componente de Input de texto só precisa de FieldValueState e FieldActions:
// Ele não precisa saber como o formulário inteiro é serializado ou submetido!
export type FormField<T> = FieldValueState<T> & FieldValidationState & FieldActions<T>;
```

---

## 🥊 4. Desafio Prático: Pipeline de Transformação e Validação

### Enunciado do Desafio
Crie uma classe genérica chamada `DataPipeline<TInput, TOutput>`:
1. Recebe no construtor uma função de transformação `transform: (input: TInput) => TOutput`.
2. Método `addValidationRule(rule: (value: TOutput) => string | null): this`.
3. Método `process(input: TInput): { success: true; data: TOutput } | { success: false; errors: string[] }`.
4. Teste convertendo uma string crua `" 12345 "` em `number` e validando se o número resultante é maior que 10.000.

