/**
 * ============================================================================
 * ⚡ USE CASE: CREATE ORDER (INSPIRADO NO SAAS-BOILERPLATE)
 * ============================================================================
 *
 * Caso de uso principal que orquestra a criação do pedido.
 * Ele conecta:
 * 1. Validação de dados (FormValidator)
 * 2. Busca e manipulação de entidades ricas (Product, Order)
 * 3. Persistência através de portas/interfaces (OrderRepository, ProductRepository)
 * 4. Retorno de DTO tipado e sanitizado
 */

import {
  Order,
  OrderItem,
  DiscountStrategy,
  PercentageDiscount,
  NoDiscount,
} from "../../domain/entities/Order.js";
import { DomainError } from "../../domain/entities/Product.js";
import { OrderRepository, ProductRepository } from "../../domain/repositories/OrderRepository.js";
import { FormValidator, Rules } from "../../shared/FormValidator.js";
import { CreateOrderInput, CreateOrderOutput } from "../dtos/CreateOrderInput.js";

export class ApplicationError extends Error {
  constructor(message: string) {
    super(`[Application Error]: ${message}`);
    this.name = "ApplicationError";
  }
}

export class CreateOrderUseCase {
  private readonly validator: FormValidator<CreateOrderInput>;

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository
  ) {
    // Configuramos o motor genérico de validação
    this.validator = new FormValidator<CreateOrderInput>({
      customerEmail: [Rules.required("O e-mail do cliente é obrigatório"), Rules.email()],
      items: [Rules.nonEmptyArray("O pedido deve conter pelo menos um item")],
    });
  }

  public async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    // 1. Validação dos dados de entrada
    const validation = this.validator.validate(input);
    if (!validation.success) {
      const errorDetails = Object.entries(validation.errors)
        .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
        .join(" | ");
      throw new ApplicationError(`Falha na validação dos dados de entrada: ${errorDetails}`);
    }

    // 2. Processamento dos itens do pedido e checagem de estoque
    const orderItems: OrderItem[] = [];

    for (const itemInput of input.items) {
      if (itemInput.quantity <= 0) {
        throw new ApplicationError(
          `Quantidade inválida para o produto ${itemInput.productId}. Deve ser maior que zero.`
        );
      }

      const product = await this.productRepository.findById(itemInput.productId);
      if (!product) {
        throw new ApplicationError(
          `Produto com ID '${itemInput.productId}' não foi encontrado no catálogo.`
        );
      }

      // Baixa atômica de estoque na entidade rica
      if (!product.hasAvailableStock(itemInput.quantity)) {
        throw new DomainError(
          `Estoque insuficiente para '${product.name}'. Solicitado: ${itemInput.quantity}, Disponível: ${product.stockQuantity}`
        );
      }

      product.decreaseStock(itemInput.quantity);
      await this.productRepository.save(product);

      orderItems.push({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: itemInput.quantity,
      });
    }

    // 3. Resolução da estratégia de desconto (Open/Closed Principle)
    const discountStrategy: DiscountStrategy =
      typeof input.discountPercentage === "number" && input.discountPercentage > 0
        ? new PercentageDiscount(input.discountPercentage)
        : new NoDiscount();

    // 4. Instanciação da entidade de Domínio 'Order'
    const generatedId = `order_${Math.random().toString(36).substring(2, 9)}`;
    const order = new Order({
      id: generatedId,
      customerEmail: input.customerEmail,
      items: orderItems,
      discountStrategy,
    });

    // 5. Persistência do Pedido através da Abstração
    await this.orderRepository.save(order);

    // 6. Retorno de DTO limpo para a camada externa
    return {
      orderId: order.id,
      customerEmail: order.customerEmail,
      subtotal: order.getSubtotal(),
      discountAmount: order.getDiscountAmount(),
      totalAmount: order.getTotal(),
      status: order.state.status,
      createdAt: order.state.createdAt,
    };
  }
}

