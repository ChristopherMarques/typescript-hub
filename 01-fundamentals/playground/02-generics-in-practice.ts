/**
 * ============================================================================
 * 🎓 FUNDAMENTOS DE TYPESCRIPT: GENERICS NA PRÁTICA (SAWABONA-FORMS PATTERN)
 * ============================================================================
 *
 * Inspirado na arquitetura do repositório 'sawabona-forms', este arquivo
 * ensina como Generics transformam TypeScript em uma linguagem declarativa e
 * auto-inferível para validação de formulários e schemas.
 *
 * Como rodar:
 *   npx tsx 01-fundamentals/playground/02-generics-in-practice.ts
 *   ou: npm run play:generics
 */

// ============================================================================
// 1. CONTRATOS E ESTRUTURAS GENÉRICAS
// ============================================================================

/**
 * Representa o resultado de validação de um campo específico ou formulário.
 */
export type ValidationResult<TValue> =
  | { readonly isValid: true; readonly value: TValue }
  | { readonly isValid: false; readonly errors: readonly string[] };

/**
 * Função de validação unitária genérica: recebe um valor T e retorna erro ou nulo.
 */
export type ValidatorFn<TValue> = (value: TValue) => string | null;

/**
 * Mapeamento de regras de validação para cada campo do objeto TFormData.
 * Usamos Mapped Types do TypeScript: para cada chave K em TFormData,
 * definimos um array de validadores específicos para o tipo daquele campo.
 */
export type SchemaRules<TFormData extends object> = {
  readonly [K in keyof TFormData]?: readonly ValidatorFn<TFormData[K]>[];
};

/**
 * Dicionário com os erros agrupados por campo.
 */
export type FormErrors<TFormData> = {
  readonly [K in keyof TFormData]?: readonly string[];
};

// ============================================================================
// 2. CONSTRUTORES DE VALIDAÇÃO (HIGHER-ORDER VALIDATORS)
// ============================================================================

/**
 * Validador para garantir presença de texto não-vazio.
 */
export function required(customMessage = "Este campo é obrigatório"): ValidatorFn<string> {
  return (value: string) => {
    if (!value || value.trim().length === 0) {
      return customMessage;
    }
    return null;
  };
}

/**
 * Validador para tamanho mínimo de string.
 */
export function minLength(length: number, customMessage?: string): ValidatorFn<string> {
  return (value: string) => {
    if (value && value.length < length) {
      return customMessage ?? `Deve conter no mínimo ${length} caracteres`;
    }
    return null;
  };
}

/**
 * Validador para formato de e-mail.
 */
export function email(customMessage = "Formato de e-mail inválido"): ValidatorFn<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value: string) => {
    if (value && !emailRegex.test(value)) {
      return customMessage;
    }
    return null;
  };
}

/**
 * Validador genérico para números mínimos.
 */
export function minNumber(minimum: number, customMessage?: string): ValidatorFn<number> {
  return (value: number) => {
    if (value < minimum) {
      return customMessage ?? `O valor mínimo permitido é ${minimum}`;
    }
    return null;
  };
}

// ============================================================================
// 3. MOTOR DO SCHEMA VALIDATOR (ESTILO SAWABONA-FORMS)
// ============================================================================

export class SchemaValidator<TFormData extends object> {
  constructor(private readonly rules: SchemaRules<TFormData>) {}

  /**
   * Executa a validação em cima de um objeto de dados e preserva sua tipagem.
   */
  public validate(data: TFormData): ValidationResult<TFormData> {
    const accumulatedErrors: Partial<Record<keyof TFormData, string[]>> = {};
    let hasError = false;

    for (const rawKey in this.rules) {
      const key = rawKey as keyof TFormData;
      const fieldValidators = this.rules[key];
      if (!fieldValidators) continue;

      const fieldValue = data[key];
      const fieldErrors: string[] = [];

      for (const validator of fieldValidators) {
        const error = validator(fieldValue);
        if (error) {
          fieldErrors.push(error);
          hasError = true;
        }
      }

      if (fieldErrors.length > 0) {
        accumulatedErrors[key] = fieldErrors;
      }
    }

    if (hasError) {
      const flattened = Object.entries(accumulatedErrors).flatMap(([field, errors]) =>
        (errors as string[]).map((err) => `[${field}]: ${err}`)
      );
      return {
        isValid: false,
        errors: flattened,
      };
    }

    return {
      isValid: true,
      value: data,
    };
  }
}

// ============================================================================
// 4. DEMONSTRAÇÃO PRÁTICA E INFERÊNCIA EM AÇÃO
// ============================================================================

interface UserRegistrationForm {
  name: string;
  email: string;
  age: number;
}

// Definindo o validador com inferência 100% estrita para UserRegistrationForm
const userSchema = new SchemaValidator<UserRegistrationForm>({
  name: [required("Nome completo é obrigatório"), minLength(3, "Nome muito curto")],
  email: [required(), email()],
  age: [minNumber(18, "O aluno precisa ser maior de 18 anos")],
});

console.log("============================================================");
console.log("📝 DEMONSTRAÇÃO: SAWABONA-FORMS PATTERN COM GENERICS");
console.log("============================================================\n");

// Caso 1: Dados inválidos
console.log("1️⃣ Testando envio com dados inválidos:");
const invalidPayload: UserRegistrationForm = {
  name: "Jo",
  email: "jo-invalido",
  age: 15,
};

const invalidResult = userSchema.validate(invalidPayload);
if (!invalidResult.isValid) {
  console.log("❌ Validação falhou conforme esperado:");
  invalidResult.errors.forEach((err) => console.log(`   👉 ${err}`));
}

// Caso 2: Dados válidos
console.log("\n2️⃣ Testando envio com dados válidos:");
const validPayload: UserRegistrationForm = {
  name: "Christopher Marques",
  email: "contato@sawabona.tech",
  age: 28,
};

const validResult = userSchema.validate(validPayload);
if (validResult.isValid) {
  console.log("✅ Validação aprovada com sucesso!");
  console.log("📦 Dados tipados e higienizados:", validResult.value);
}
