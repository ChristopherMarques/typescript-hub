/**
 * ============================================================================
 * 📦 DOMAIN ENTITY: PRODUCT (INSPIRADO NO MINI-SELLER)
 * ============================================================================
 *
 * Entidade de domínio rica com encapsulamento estrito.
 * Protege suas próprias regras invariantes de negócio:
 * 1. Preço não pode ser negativo ou zero.
 * 2. Estoque não pode ficar negativo.
 * 3. Baixa e reposição de estoque acontecem através de métodos com semântica de negócio.
 */

export class DomainError extends Error {
  constructor(message: string) {
    super(`[Domain Error]: ${message}`);
    this.name = "DomainError";
  }
}

export interface ProductProps {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly initialStock: number;
}

export class Product {
  public readonly id: string;
  public readonly name: string;
  private _price: number;
  private _stockQuantity: number;

  constructor(props: ProductProps) {
    if (!props.id || props.id.trim().length === 0) {
      throw new DomainError("O identificador do produto é obrigatório.");
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new DomainError("O nome do produto não pode ser vazio.");
    }
    if (props.price <= 0) {
      throw new DomainError(`Preço inválido (R$ ${props.price}). O preço deve ser maior que zero.`);
    }
    if (props.initialStock < 0) {
      throw new DomainError("O estoque inicial não pode ser negativo.");
    }

    this.id = props.id;
    this.name = props.name.trim();
    this._price = props.price;
    this._stockQuantity = props.initialStock;
  }

  public get price(): number {
    return this._price;
  }

  public get stockQuantity(): number {
    return this._stockQuantity;
  }

  /**
   * Verifica se há estoque suficiente para atender a uma quantidade solicitada.
   */
  public hasAvailableStock(quantity: number): boolean {
    return quantity > 0 && this._stockQuantity >= quantity;
  }

  /**
   * Reduz o estoque do produto garantindo a invariante de que o estoque nunca fica negativo.
   */
  public decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new DomainError("A quantidade de baixa no estoque deve ser estritamente positiva.");
    }
    if (this._stockQuantity < quantity) {
      throw new DomainError(
        `Estoque insuficiente para o produto '${this.name}'. Disponível: ${this._stockQuantity}, Solicitado: ${quantity}.`
      );
    }
    this._stockQuantity -= quantity;
  }

  /**
   * Repõe o estoque (ex: cancelamento de pedido ou devolução).
   */
  public replenishStock(quantity: number): void {
    if (quantity <= 0) {
      throw new DomainError("A quantidade de reposição de estoque deve ser estritamente positiva.");
    }
    this._stockQuantity += quantity;
  }

  /**
   * Atualiza o preço unitário do produto.
   */
  public updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new DomainError("O novo preço deve ser maior que zero.");
    }
    this._price = newPrice;
  }
}

