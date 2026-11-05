/**
 * ============================================================================
 * 💾 INFRASTRUCTURE ADAPTER: IN-MEMORY REPOSITORIES (LSP & DIP)
 * ============================================================================
 *
 * Implementação em memória dos contratos do Domínio.
 * Respeita o Princípio de Substituição de Liskov (LSP): qualquer código que
 * dependa de 'OrderRepository' funcionará idêntico caso este adaptador seja
 * substituído por um repositório PostgreSQL ou MongoDB.
 */

import { Order } from "../../domain/entities/Order.js";
import { Product } from "../../domain/entities/Product.js";
import { OrderRepository, ProductRepository } from "../../domain/repositories/OrderRepository.js";

export class InMemoryOrderRepository implements OrderRepository {
  private readonly items = new Map<string, Order>();

  public async save(order: Order): Promise<void> {
    this.items.set(order.id, order);
  }

  public async findById(id: string): Promise<Order | null> {
    return this.items.get(id) ?? null;
  }

  public async findAll(): Promise<readonly Order[]> {
    return Array.from(this.items.values());
  }
}

export class InMemoryProductRepository implements ProductRepository {
  private readonly items = new Map<string, Product>();

  constructor(initialProducts: readonly Product[] = []) {
    for (const product of initialProducts) {
      this.items.set(product.id, product);
    }
  }

  public async save(product: Product): Promise<void> {
    this.items.set(product.id, product);
  }

  public async findById(id: string): Promise<Product | null> {
    return this.items.get(id) ?? null;
  }

  public async findAll(): Promise<readonly Product[]> {
    return Array.from(this.items.values());
  }
}

