/**
 * ============================================================================
 * ⚠️ ANTI-PADRÃO: CÓDIGO COM VIOLAÇÕES DO S.O.L.I.D.
 * ============================================================================
 *
 * Este arquivo serve como contra-exemplo educacional. Todo o código está em
 * Inglês, e os comentários em Português apontam com precisão cirúrgica cada
 * violação de boas práticas, acoplamento e rigidez arquitetural.
 *
 * Como rodar:
 *   npx tsx 03-architecture-and-solid/examples/01-solid-violations.ts
 *   ou: npm run play:solid:violations
 */

// ============================================================================
// VIOLAÇÃO DO ISP (Interface Segregation Principle)
// ============================================================================
/**
 * ❌ VIOLAÇÃO DO ISP:
 * Esta interface é uma "Fat Interface" (Interface Gorda). Ela força qualquer
 * consumidor a implementar geração de PDF, envio de SMS e estornos bancários,
 * mesmo que o serviço em questão precise apenas salvar um pedido simples.
 */
export interface BadFatOrderManager {
  saveOrderToDatabase(data: unknown): void;
  sendOrderConfirmationEmail(email: string, message: string): void;
  sendSmsNotification(phone: string, text: string): void;
  generatePdfInvoice(orderId: string): Buffer;
  refundCreditCard(transactionId: string, amount: number): boolean;
}

// ============================================================================
// DRIVERS CONCRETOS SIMULADOS (ACOPLAMENTO DIRETO)
// ============================================================================
class ConcreteMySQLDatabase {
  public executeQuery(query: string, params: unknown[]): void {
    console.log(`[MySQL Raw] Executando: "${query}" com parâmetros:`, params);
  }
}

class ConcreteSmtpMailer {
  public sendMail(to: string, subject: string, body: string): void {
    console.log(`[SMTP Mailer] Enviando e-mail para ${to} | Assunto: ${subject} | Corpo: ${body}`);
  }
}

// ============================================================================
// "DEUS EX MACHINA" - UMA CLASSE QUE FAZ TUDO (VIOLAÇÃO DO SRP, OCP E DIP)
// ============================================================================
export class GodOrderService {
  /**
   * ❌ VIOLAÇÃO DO DIP (Dependency Inversion Principle):
   * O serviço de alto nível cria instâncias concretas diretamente no construtor
   * (new ConcreteMySQLDatabase e new ConcreteSmtpMailer). Não há como testar
   * este serviço sem bater no banco real ou enviar e-mails de verdade!
   */
  private database = new ConcreteMySQLDatabase();
  private mailer = new ConcreteSmtpMailer();

  /**
   * ❌ VIOLAÇÃO DO SRP (Single Responsibility Principle):
   * Este único método realiza CINCO responsabilidades diferentes:
   * 1. Validação de dados de entrada
   * 2. Cálculo de preços e regras de desconto comerciais
   * 3. Montagem de queries SQL diretas
   * 4. Envio de notificações por e-mail
   * 5. Log e formatação de saída
   *
   * ❌ VIOLAÇÃO DO OCP (Open/Closed Principle):
   * Se a equipe comercial inventar um novo tipo de desconto ("CYBER_MONDAY" ou "CUPOM_VIP"),
   * teremos que ABRIR este método e adicionar novos 'if/else' ou 'case' no switch.
   * Isso arrisca quebrar regras que já estavam funcionando em produção.
   */
  public processOrder(
    customerEmail: string,
    items: Array<{ name: string; price: number; qty: number }>,
    discountType: "NONE" | "CHRISTMAS" | "BLACK_FRIDAY" | "EMPLOYEE"
  ): { orderId: string; total: number } {
    console.log("⚠️ Executando GodOrderService.processOrder (Anti-padrão)...");

    // 1. Validação misturada com lógica de negócio
    if (!customerEmail.includes("@")) {
      throw new Error("Invalid customer email address");
    }
    if (items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    // 2. Cálculo de subtotal
    let subtotal = 0;
    for (const item of items) {
      if (item.price <= 0 || item.qty <= 0) {
        throw new Error("Invalid item price or quantity");
      }
      subtotal += item.price * item.qty;
    }

    // 3. OCP VIOLATION: Switch/Case de descontos engessado
    let discount = 0;
    switch (discountType) {
      case "CHRISTMAS":
        discount = subtotal * 0.05; // 5%
        break;
      case "BLACK_FRIDAY":
        discount = subtotal * 0.20; // 20%
        break;
      case "EMPLOYEE":
        discount = subtotal * 0.35; // 35%
        break;
      case "NONE":
      default:
        discount = 0;
        break;
    }

    const finalTotal = subtotal - discount;
    const orderId = `ORD-LEGACY-${Math.floor(Math.random() * 90000 + 10000)}`;

    // 4. DIP/SRP VIOLATION: Manipulação direta de persistência
    this.database.executeQuery(
      "INSERT INTO orders (id, email, subtotal, discount, total) VALUES (?, ?, ?, ?, ?)",
      [orderId, customerEmail, subtotal, discount, finalTotal]
    );

    // 5. DIP/SRP VIOLATION: Notificação via SMTP acoplada no fluxo
    this.mailer.sendMail(
      customerEmail,
      "Order Confirmation",
      `Thank you! Your total order is $${finalTotal.toFixed(2)}.`
    );

    return { orderId, total: finalTotal };
  }
}

// ============================================================================
// VIOLAÇÃO DO LSP (Liskov Substitution Principle)
// ============================================================================
class GenericFileStorage {
  public writeData(filename: string, data: string): void {
    console.log(`Escrevendo ${data.length} bytes no arquivo ${filename}`);
  }
}

/**
 * ❌ VIOLAÇÃO DO LSP:
 * A subclasse ReadOnlyArchiveStorage herda de GenericFileStorage, mas lança uma
 * exceção ao executar 'writeData'. Um cliente que espera um GenericFileStorage
 * terá seu fluxo quebrado em tempo de execução ao receber esta subclasse.
 */
class ReadOnlyArchiveStorage extends GenericFileStorage {
  public override writeData(filename: string, data: string): void {
    void filename;
    void data;
    throw new Error("LSP Violation: Cannot write to a read-only archive storage!");
  }
}

// ============================================================================
// EXECUÇÃO DO ANTI-PADRÃO PARA ILUSTRAÇÃO
// ============================================================================
function runAntiPatternDemo(): void {
  const badService = new GodOrderService();

  const result = badService.processOrder(
    "dev@legacy-system.com",
    [
      { name: "Legacy Monitor Stand", price: 150, qty: 1 },
      { name: "Old Mechanical Switch Pack", price: 30, qty: 2 },
    ],
    "BLACK_FRIDAY"
  );

  console.log("\n📦 Pedido processado pela God Class:", result);

  console.log("\n💥 Demonstração de quebra do LSP:");
  try {
    const storage: GenericFileStorage = new ReadOnlyArchiveStorage();
    storage.writeData("backup.json", '{"status":"ok"}');
  } catch (error) {
    if (error instanceof Error) {
      console.log(`   🚨 Erro capturado por violação de LSP: "${error.message}"`);
    }
  }

  console.log("\n💡 Para ver como este sistema DEVE ser escrito de forma limpa, execute:");
  console.log("   npm run play:solid\n");
}

runAntiPatternDemo();

