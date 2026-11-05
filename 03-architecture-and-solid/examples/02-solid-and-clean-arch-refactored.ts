/**
 * ============================================================================
 * 🏛️ AULA PRÁTICA: SOLID & CLEAN ARCHITECTURE EM TYPESCRIPT
 * ============================================================================
 * Neste arquivo, todo o código segue o padrão internacional de mercado (Inglês),
 * enquanto nossos comentários explicam cada decisão arquitetural em Português.
 *
 * Como rodar:
 *   npx tsx 03-architecture-and-solid/examples/02-solid-and-clean-arch-refactored.ts
 *   ou: npm run play:solid
 */

// ============================================================================
// 1. CAMADA DE DOMÍNIO (DOMAIN LAYER) - O coração puro do negócio
// Não conhece banco de dados, frameworks web ou bibliotecas externas.
// ============================================================================

/**
 * Representa um item dentro de um pedido.
 * Usamos 'readonly' para garantir IMUTABILIDADE (evita efeitos colaterais acidentais).
 */
export interface OrderItem {
  readonly productId: string;
  readonly productName: string;
  readonly unitPrice: number;
  readonly quantity: number;
}

/**
 * [SOLID - O: Open/Closed Principle]
 * Em vez de usar vários 'if/else' para calcular descontos diferentes dentro do pedido,
 * criamos um contrato (Interface) baseado no Strategy Pattern.
 * Se amanhã surgir um desconto de "Cyber Monday", basta criar uma nova classe que
 * implemente 'DiscountStrategy' sem tocar em nenhuma linha do código já testado!
 */
export interface DiscountStrategy {
  calculate(subtotal: number): number;
}

export class NoDiscount implements DiscountStrategy {
  public calculate(): number {
    return 0;
  }
}

export class PercentageDiscount implements DiscountStrategy {
  constructor(private readonly percentage: number) {
    if (percentage < 0 || percentage > 100) {
      throw new Error("A porcentagem de desconto deve estar entre 0 e 100.");
    }
  }

  public calculate(subtotal: number): number {
    return subtotal * (this.percentage / 100);
  }
}

export class FixedTierDiscount implements DiscountStrategy {
  constructor(
    private readonly spendThreshold: number,
    private readonly discountAmount: number
  ) {
    if (spendThreshold <= 0 || discountAmount <= 0) {
      throw new Error("Limiares e valores de desconto devem ser maiores que zero.");
    }
  }

  public calculate(subtotal: number): number {
    return subtotal >= this.spendThreshold ? this.discountAmount : 0;
  }
}

/**
 * [SOLID - S: Single Responsibility Principle]
 * A entidade 'Order' tem apenas UMA responsabilidade: proteger as regras de negócio
 * e a consistência matemática de um Pedido. Ela NÃO salva no banco e NÃO envia e-mails.
 */
export class Order {
  public readonly id: string;
  public readonly createdAt: Date;

  constructor(
    public readonly customerEmail: string,
    private readonly items: ReadonlyArray<OrderItem>,
    private readonly discountStrategy: DiscountStrategy = new NoDiscount()
  ) {
    if (!customerEmail.includes("@")) {
      throw new Error("Endereço de e-mail do cliente inválido.");
    }
    if (items.length === 0) {
      throw new Error("Um pedido precisa ter pelo menos um item.");
    }
    this.id = `ord_${Math.random().toString(36).substring(2, 9)}`;
    this.createdAt = new Date();
  }

  public getItems(): ReadonlyArray<OrderItem> {
    return this.items;
  }

  /**
   * Calcula o valor bruto somando (preço unitário * quantidade) de cada item.
   */
  public getSubtotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  }

  /**
   * Calcula o valor final aplicando a estratégia de desconto injetada.
   */
  public getTotal(): number {
    const subtotal = this.getSubtotal();
    const discount = this.discountStrategy.calculate(subtotal);
    return Math.max(0, subtotal - discount);
  }
}

// ============================================================================
// 2. CONTRATOS DE INVERSÃO DE DEPENDÊNCIA (PORTS / INTERFACES)
// ============================================================================

/**
 * [SOLID - D: Dependency Inversion Principle]
 * [SOLID - I: Interface Segregation Principle]
 *
 * O caso de uso (alto nível) NÃO deve importar o PostgreSQL, Prisma ou Supabase diretamente.
 * Ele define uma interface enxuta dizendo O QUE precisa fazer ('save', 'findById'),
 * sem se importar com COMO será feito.
 */
export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(orderId: string): Promise<Order | null>;
}

export interface NotificationService {
  sendOrderConfirmation(email: string, orderId: string, total: number): Promise<void>;
}

// ============================================================================
// 3. CAMADA DE APLICAÇÃO (APPLICATION LAYER / USE CASES)
// Orquestra o fluxo: recebe dados, aciona o Domínio e chama as Interfaces.
// ============================================================================

export interface CreateOrderInput {
  readonly customerEmail: string;
  readonly items: readonly OrderItem[];
  readonly discountStrategy?: DiscountStrategy;
}

export interface CreateOrderOutput {
  readonly orderId: string;
  readonly subtotal: number;
  readonly finalTotal: number;
  readonly createdAt: Date;
}

export class CreateOrderUseCase {
  /**
   * Recebemos as abstrações via construtor (Dependency Injection).
   * Isso torna esta classe 100% testável em milissegundos usando mocks ou repositórios em memória!
   */
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly notificationService: NotificationService
  ) {}

  public async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    // 1. Instancia a entidade de Domínio com a estratégia de desconto injetada
    const order = new Order(
      input.customerEmail,
      input.items,
      input.discountStrategy ?? new NoDiscount()
    );

    // 2. Persiste usando o contrato abstrato
    await this.orderRepository.save(order);

    // 3. Notifica o cliente usando o contrato abstrato
    await this.notificationService.sendOrderConfirmation(
      order.customerEmail,
      order.id,
      order.getTotal()
    );

    // 4. Retorna um DTO (Data Transfer Object) limpo e tipado
    return {
      orderId: order.id,
      subtotal: order.getSubtotal(),
      finalTotal: order.getTotal(),
      createdAt: order.createdAt,
    };
  }
}

// ============================================================================
// 4. CAMADA DE INFRAESTRUTURA (INFRASTRUCTURE LAYER - ADAPTERS)
// Implementações reais (ou em memória para testes/estudo) dos contratos acima.
// ============================================================================

/**
 * [SOLID - L: Liskov Substitution Principle]
 * Qualquer classe que implemente 'OrderRepository' (seja em memória, SQLite ou Postgres)
 * pode substituir esta classe sem que o 'CreateOrderUseCase' perceba ou quebre.
 */
export class InMemoryOrderRepository implements OrderRepository {
  private readonly storedOrders: Map<string, Order> = new Map();

  public async save(order: Order): Promise<void> {
    this.storedOrders.set(order.id, order);
    console.log(`💾 [Infra/Database] Pedido ${order.id} persistido em memória com sucesso.`);
  }

  public async findById(orderId: string): Promise<Order | null> {
    return this.storedOrders.get(orderId) ?? null;
  }
}

export class ConsoleNotificationService implements NotificationService {
  public async sendOrderConfirmation(
    email: string,
    orderId: string,
    total: number
  ): Promise<void> {
    console.log(
      `📧 [Infra/Notification] E-mail enviado para "${email}": Pedido #${orderId} no valor de R$ ${total.toFixed(2)} aprovado!`
    );
  }
}

// ============================================================================
// 5. EXECUÇÃO PRÁTICA (COMPOSITION ROOT)
// ============================================================================

async function runExample(): Promise<void> {
  console.log("============================================================");
  console.log("🚀 DEMONSTRAÇÃO: SOLID & CLEAN ARCHITECTURE REFATORADO");
  console.log("============================================================\n");

  // 1. Instanciamos os adaptadores de infraestrutura (Baixo Nível)
  const repository = new InMemoryOrderRepository();
  const notifier = new ConsoleNotificationService();

  // 2. Injetamos as dependências no Caso de Uso (Alto Nível)
  const createOrderUseCase = new CreateOrderUseCase(repository, notifier);

  // 3. Estratégia de desconto flexível (Open/Closed Principle em ação)
  const holidayDiscount = new PercentageDiscount(15); // 15% de desconto

  // 4. Executamos o caso de uso com dados tipados
  const result = await createOrderUseCase.execute({
    customerEmail: "aluno@sawabona.tech",
    discountStrategy: holidayDiscount,
    items: [
      {
        productId: "prod_01",
        productName: "Keychron K2 Pro Mechanical Keyboard",
        unitPrice: 650,
        quantity: 1,
      },
      {
        productId: "prod_02",
        productName: "Braided USB-C Cable",
        unitPrice: 80,
        quantity: 2,
      },
    ],
  });

  console.log("\n✅ DTO retornado com sucesso pelo UseCase:", result);
  console.log("📦 Pedido recuperado do repositório:");
  const saved = await repository.findById(result.orderId);
  console.log(`   - ID: ${saved?.id}`);
  console.log(`   - Total final com 15% de desconto: R$ ${saved?.getTotal().toFixed(2)}`);
}

runExample();

