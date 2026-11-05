/**
 * ============================================================================
 * 📦 DOMAIN ENTITY: ORDER (INSPIRADO NO MINI-SELLER E MOTION-ENGINE)
 * ============================================================================
 *
 * Entidade agregadora de pedido com:
 * 1. Discriminated Unions para estados de ciclo de vida (Pending, Paid, Shipped, Cancelled).
 * 2. Impossibilidade de estados inconsistentes (ex: 'shipped' sem código de rastreio).
 * 3. Strategy Pattern para cálculo flexível de descontos.
 */

import { DomainError } from "./Product.js";

export interface OrderItem {
  readonly productId: string;
  readonly productName: string;
  readonly unitPrice: number;
  readonly quantity: number;
}

// ============================================================================
// 1. STRATEGY PATTERN PARA DESCONTOS (OPEN/CLOSED PRINCIPLE)
// ============================================================================

export interface DiscountStrategy {
  readonly name: string;
  calculate(subtotal: number): number;
}

export class NoDiscount implements DiscountStrategy {
  public readonly name = "Nenhum desconto";
  public calculate(): number {
    return 0;
  }
}

export class PercentageDiscount implements DiscountStrategy {
  public readonly name: string;
  constructor(private readonly percentage: number) {
    if (percentage < 0 || percentage > 100) {
      throw new DomainError("A porcentagem de desconto deve estar entre 0 e 100.");
    }
    this.name = `${percentage}% de Desconto`;
  }

  public calculate(subtotal: number): number {
    return subtotal * (this.percentage / 100);
  }
}

export class FixedTierDiscount implements DiscountStrategy {
  public readonly name: string;
  constructor(
    private readonly minSpend: number,
    private readonly discountValue: number
  ) {
    if (minSpend <= 0 || discountValue <= 0) {
      throw new DomainError("Limiar mínimo e valor de desconto devem ser positivos.");
    }
    this.name = `R$ ${discountValue} OFF em compras acima de R$ ${minSpend}`;
  }

  public calculate(subtotal: number): number {
    return subtotal >= this.minSpend ? this.discountValue : 0;
  }
}

// ============================================================================
// 2. DISCRIMINATED UNIONS: ESTADOS DO PEDIDO
// ============================================================================

export interface PendingPaymentState {
  readonly status: "PENDING_PAYMENT";
  readonly createdAt: Date;
}

export interface PaidState {
  readonly status: "PAID";
  readonly createdAt: Date;
  readonly paidAt: Date;
  readonly transactionId: string;
}

export interface ShippedState {
  readonly status: "SHIPPED";
  readonly createdAt: Date;
  readonly paidAt: Date;
  readonly transactionId: string;
  readonly shippedAt: Date;
  readonly trackingCode: string;
}

export interface CancelledState {
  readonly status: "CANCELLED";
  readonly createdAt: Date;
  readonly cancelledAt: Date;
  readonly reason: string;
}

export type OrderState =
  | PendingPaymentState
  | PaidState
  | ShippedState
  | CancelledState;

// ============================================================================
// 3. CLASSE DE ENTIDADE DO PEDIDO
// ============================================================================

export interface OrderProps {
  readonly id: string;
  readonly customerEmail: string;
  readonly items: readonly OrderItem[];
  readonly discountStrategy?: DiscountStrategy;
  readonly createdAt?: Date;
}

export class Order {
  public readonly id: string;
  public readonly customerEmail: string;
  private readonly _items: readonly OrderItem[];
  private readonly _discountStrategy: DiscountStrategy;
  private _state: OrderState;

  constructor(props: OrderProps) {
    if (!props.id || props.id.trim().length === 0) {
      throw new DomainError("O identificador do pedido é obrigatório.");
    }
    if (!props.customerEmail.includes("@")) {
      throw new DomainError("E-mail de cliente inválido.");
    }
    if (!props.items || props.items.length === 0) {
      throw new DomainError("O pedido precisa conter pelo menos um item.");
    }

    // Invariante dos itens: quantidades e preços devem ser válidos
    for (const item of props.items) {
      if (item.quantity <= 0) {
        throw new DomainError(`Quantidade inválida para o item '${item.productName}'.`);
      }
      if (item.unitPrice <= 0) {
        throw new DomainError(`Preço unitário inválido para o item '${item.productName}'.`);
      }
    }

    this.id = props.id;
    this.customerEmail = props.customerEmail.trim();
    this._items = [...props.items];
    this._discountStrategy = props.discountStrategy ?? new NoDiscount();
    this._state = {
      status: "PENDING_PAYMENT",
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get items(): readonly OrderItem[] {
    return this._items;
  }

  public get discountStrategy(): DiscountStrategy {
    return this._discountStrategy;
  }

  public get state(): OrderState {
    return this._state;
  }

  /**
   * Calcula o subtotal bruto somando os itens do pedido.
   */
  public getSubtotal(): number {
    return this._items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );
  }

  /**
   * Calcula o valor do desconto monetário concedido.
   */
  public getDiscountAmount(): number {
    const subtotal = this.getSubtotal();
    return this._discountStrategy.calculate(subtotal);
  }

  /**
   * Calcula o valor total a ser pago (subtotal - desconto).
   */
  public getTotal(): number {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscountAmount();
    return Math.max(0, subtotal - discount);
  }

  /**
   * Transição de estado: confirma o pagamento do pedido.
   */
  public markAsPaid(transactionId: string): void {
    if (this._state.status !== "PENDING_PAYMENT") {
      throw new DomainError(
        `Não é possível pagar um pedido com status '${this._state.status}'.`
      );
    }
    this._state = {
      status: "PAID",
      createdAt: this._state.createdAt,
      paidAt: new Date(),
      transactionId,
    };
  }

  /**
   * Transição de estado: despacha o pedido com código de rastreamento.
   */
  public markAsShipped(trackingCode: string): void {
    if (this._state.status !== "PAID") {
      throw new DomainError(
        `Apenas pedidos no estado 'PAID' podem ser enviados. Status atual: '${this._state.status}'.`
      );
    }
    this._state = {
      status: "SHIPPED",
      createdAt: this._state.createdAt,
      paidAt: this._state.paidAt,
      transactionId: this._state.transactionId,
      shippedAt: new Date(),
      trackingCode,
    };
  }

  /**
   * Transição de estado: cancela o pedido.
   */
  public cancel(reason: string): void {
    if (this._state.status === "SHIPPED") {
      throw new DomainError("Não é permitido cancelar um pedido que já foi despachado.");
    }
    this._state = {
      status: "CANCELLED",
      createdAt: this._state.createdAt,
      cancelledAt: new Date(),
      reason,
    };
  }
}

