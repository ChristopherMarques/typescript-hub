/**
 * ============================================================================
 * 🏛️ DOMAIN REPOSITORY CONTRACTS (DEPENDENCY INVERSION PRINCIPLE)
 * ============================================================================
 *
 * Contratos puros de persistência pertencentes ao Domínio.
 * A camada de Domínio não sabe se os dados serão gravados em memória,
 * PostgreSQL, MongoDB ou DynamoDB. Ela apenas expressa sua necessidade.
 */

import { Order } from "../entities/Order.js";
import { Product } from "../entities/Product.js";

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<readonly Order[]>;
}

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
  findAll(): Promise<readonly Product[]>;
}

