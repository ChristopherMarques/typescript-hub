/**
 * ============================================================================
 * 🛡️ SHARED: FORM VALIDATOR ENGINE (INSPIRADO NO SAWABONA-FORMS)
 * ============================================================================
 *
 * Motor genérico de validação declarativa com inferência estrita de tipos.
 * Garante que qualquer entrada de dados não confiável seja higienizada e validada
 * antes de chegar às entidades de Domínio e Casos de Uso.
 */

export type ValidationRule<TValue> = (value: TValue) => string | null;

export type ValidationSchema<TData extends object> = {
  readonly [K in keyof TData]?: readonly ValidationRule<TData[K]>[];
};

export type ValidationOutcome<TData> =
  | { readonly success: true; readonly data: TData }
  | { readonly success: false; readonly errors: Readonly<Record<string, readonly string[]>> };

export class FormValidator<TData extends object> {
  constructor(private readonly schema: ValidationSchema<TData>) {}

  /**
   * Valida o objeto contra as regras configuradas para cada chave.
   */
  public validate(rawInput: TData): ValidationOutcome<TData> {
    const errorMap: Record<string, string[]> = {};
    let hasFailures = false;

    for (const rawKey in this.schema) {
      const key = rawKey as keyof TData;
      const rules = this.schema[key];
      if (!rules) continue;

      const value = rawInput[key];
      const fieldErrors: string[] = [];

      for (const rule of rules) {
        const error = rule(value);
        if (error) {
          fieldErrors.push(error);
          hasFailures = true;
        }
      }

      if (fieldErrors.length > 0) {
        errorMap[String(key)] = fieldErrors;
      }
    }

    if (hasFailures) {
      return {
        success: false,
        errors: errorMap,
      };
    }

    return {
      success: true,
      data: rawInput,
    };
  }
}

// ============================================================================
// CONSTRUTORES DE REGRAS REUTILIZÁVEIS (RULE FACTORIES)
// ============================================================================

export const Rules = {
  required: (message = "Campo obrigatório"): ValidationRule<unknown> => {
    return (value: unknown) => {
      if (value === null || value === undefined || value === "") {
        return message;
      }
      return null;
    };
  },

  email: (message = "E-mail inválido"): ValidationRule<string> => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (value: string) => {
      if (value && !regex.test(value)) {
        return message;
      }
      return null;
    };
  },

  minLength: (min: number, message?: string): ValidationRule<string> => {
    return (value: string) => {
      if (value && value.length < min) {
        return message ?? `Deve conter pelo menos ${min} caracteres`;
      }
      return null;
    };
  },

  nonEmptyArray: <T>(message = "A lista não pode estar vazia"): ValidationRule<readonly T[]> => {
    return (array: readonly T[]) => {
      if (!array || array.length === 0) {
        return message;
      }
      return null;
    };
  },

  positiveNumber: (message = "O número deve ser estritamente positivo"): ValidationRule<number> => {
    return (value: number) => {
      if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
        return message;
      }
      return null;
    };
  },
} as const;
