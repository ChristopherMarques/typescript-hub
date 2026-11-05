/**
 * ============================================================================
 * 📨 APPLICATION DTOs (DATA TRANSFER OBJECTS)
 * ============================================================================
 *
 * Contratos de dados puros que cruzam as fronteiras do sistema.
 * DTOs são estruturas de dados sem métodos de negócio, facilitando serialização,
 * validação externa e desacoplamento do modelo interno de Domínio.
 */

export interface CreateOrderItemInput {
  readonly productId: string;
  readonly quantity: number;
}

export interface CreateOrderInput {
  readonly customerEmail: string;
  readonly items: readonly CreateOrderItemInput[];
  readonly discountPercentage?: number;
}

export interface CreateOrderOutput {
  readonly orderId: string;
  readonly customerEmail: string;
  readonly subtotal: number;
  readonly discountAmount: number;
  readonly totalAmount: number;
  readonly status: string;
  readonly createdAt: Date;
}

