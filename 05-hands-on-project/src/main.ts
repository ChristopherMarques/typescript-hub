/**
 * ============================================================================
 * 🚀 PROJETO PRÁTICO: BOOTSTRAP & COMPOSITION ROOT (MAIN)
 * ============================================================================
 *
 * Ponto de entrada do sistema que demonstra a integração de todos os conceitos:
 * 1. Validação genérica com FormValidator (estilo sawabona-forms)
 * 2. Modelagem rica e controle de estoque com Product (estilo mini-seller)
 * 3. Orquestração e inversão de dependência com CreateOrderUseCase (estilo saas-boilerplate)
 * 4. Timeline e interpolação visual com MotionTimeline (estilo motion-engine)
 *
 * Como rodar:
 *   npx tsx 05-hands-on-project/src/main.ts
 *   ou: npm run start:project
 */

import { Product } from "./domain/entities/Product.js";
import { CreateOrderInput } from "./application/dtos/CreateOrderInput.js";
import { CreateOrderUseCase } from "./application/use-cases/CreateOrderUseCase.js";
import {
  InMemoryOrderRepository,
  InMemoryProductRepository,
} from "./infra/repositories/InMemoryOrderRepository.js";
import { FormValidator, Rules } from "./shared/FormValidator.js";
import { MotionEasings, MotionTimeline } from "./shared/MotionTimeline.js";

async function main(): Promise<void> {
  console.log("================================================================================");
  console.log("🌟 TYPESCRIPT-HUB: DEMONSTRAÇÃO COMPLETA DO SISTEMA PRÁTICO");
  console.log("================================================================================\n");

  // ============================================================================
  // ETAPA 1: TESTANDO O MOTOR DE VALIDAÇÃO (SAWABONA-FORMS PATTERN)
  // ============================================================================
  console.log("📌 ETAPA 1: Validação Estrita de Dados de Entrada com FormValidator");

  const orderValidator = new FormValidator<CreateOrderInput>({
    customerEmail: [Rules.required(), Rules.email("E-mail com formato inválido")],
    items: [Rules.nonEmptyArray("A lista de itens não pode estar vazia")],
  });

  const invalidInput: CreateOrderInput = {
    customerEmail: "email-invalido-sem-arroba",
    items: [],
  };

  console.log("   🧪 Submetendo payload inválido...");
  const validationFail = orderValidator.validate(invalidInput);
  if (!validationFail.success) {
    console.log("   ❌ Validador barrou com sucesso:");
    for (const [field, errors] of Object.entries(validationFail.errors)) {
      console.log(`      • [Campo '${field}']: ${errors.join(", ")}`);
    }
  }

  const validInput: CreateOrderInput = {
    customerEmail: "dev@typescript-hub.edu",
    items: [
      { productId: "prod_mechanical_kb", quantity: 1 },
      { productId: "prod_usb_cable", quantity: 2 },
    ],
    discountPercentage: 10,
  };

  console.log("\n   🧪 Submetendo payload válido...");
  const validationSuccess = orderValidator.validate(validInput);
  if (validationSuccess.success) {
    console.log("   ✅ Validação aprovada com sucesso! Dados prontos para o UseCase.\n");
  }

  // ============================================================================
  // ETAPA 2: CONFIGURAÇÃO DO CATÁLOGO DE PRODUTOS E ESTOQUE (MINI-SELLER)
  // ============================================================================
  console.log("📌 ETAPA 2: Criação de Produtos com Regras Ricas de Estoque");

  const keyboard = new Product({
    id: "prod_mechanical_kb",
    name: "Teclado Mecânico Custom 75% ANSI",
    price: 750.0,
    initialStock: 5,
  });

  const cable = new Product({
    id: "prod_usb_cable",
    name: "Cabo Espiral Aviator USB-C",
    price: 120.0,
    initialStock: 20,
  });

  console.log(`   📦 [Produto] ${keyboard.name} | Preço: R$ ${keyboard.price.toFixed(2)} | Estoque: ${keyboard.stockQuantity}`);
  console.log(`   📦 [Produto] ${cable.name} | Preço: R$ ${cable.price.toFixed(2)} | Estoque: ${cable.stockQuantity}\n`);

  // ============================================================================
  // ETAPA 3: COMPOSIÇÃO DE DEPENDÊNCIAS (INJEÇÃO DE DEPENDÊNCIA - CLEAN ARCH)
  // ============================================================================
  console.log("📌 ETAPA 3: Injeção de Dependências & Bootstrap dos Repositórios");

  const productRepository = new InMemoryProductRepository([keyboard, cable]);
  const orderRepository = new InMemoryOrderRepository();
  const createOrderUseCase = new CreateOrderUseCase(orderRepository, productRepository);

  console.log("   🔗 Adaptadores de infraestrutura acoplados com sucesso via contratos abstratos.\n");

  // ============================================================================
  // ETAPA 4: EXECUÇÃO DO CASO DE USO E FEEDBACK VISUAL (MOTION-ENGINE PATTERN)
  // ============================================================================
  console.log("📌 ETAPA 4: Execução do Caso de Uso com Motion Timeline");

  const timeline = new MotionTimeline();
  timeline
    .addStep({ title: "Validando integridade dos dados e regras fiscais", durationMs: 120, easing: MotionEasings.linear })
    .addStep({ title: "Reservando e diminuindo estoque no inventário", durationMs: 150, easing: MotionEasings.easeOutQuad })
    .addStep({ title: "Calculando cupom de 10% de desconto via Strategy Pattern", durationMs: 100, easing: MotionEasings.easeInOutCubic })
    .addStep({ title: "Persistindo pedido no InMemoryOrderRepository", durationMs: 120, easing: MotionEasings.easeOutQuad });

  await timeline.runAll();

  // Executa o caso de uso
  const orderResult = await createOrderUseCase.execute(validInput);

  console.log("\n================================================================================");
  console.log("🎉 PEDIDO PROCESSADO COM SUCESSO!");
  console.log("================================================================================");
  console.log(`   • ID do Pedido:     ${orderResult.orderId}`);
  console.log(`   • Cliente:          ${orderResult.customerEmail}`);
  console.log(`   • Subtotal:         R$ ${orderResult.subtotal.toFixed(2)}`);
  console.log(`   • Desconto (10%):   -R$ ${orderResult.discountAmount.toFixed(2)}`);
  console.log(`   • Total Final:      R$ ${orderResult.totalAmount.toFixed(2)}`);
  console.log(`   • Status Atual:     ${orderResult.status}`);
  console.log(`   • Data da Criação:  ${orderResult.createdAt.toISOString()}`);
  console.log("--------------------------------------------------------------------------------");

  // Verificando que o estoque do produto foi decrementado no repositório
  const updatedKeyboard = await productRepository.findById("prod_mechanical_kb");
  const updatedCable = await productRepository.findById("prod_usb_cable");

  console.log("🔍 Verificação de Consistência de Estoque Pós-Venda:");
  console.log(`   • ${updatedKeyboard?.name}: Estoque atual = ${updatedKeyboard?.stockQuantity} (era 5, vendeu 1)`);
  console.log(`   • ${updatedCable?.name}: Estoque atual = ${updatedCable?.stockQuantity} (era 20, vendeu 2)`);
  console.log("================================================================================\n");
}

main().catch((err: unknown) => {
  console.error("❌ Erro fatal durante a execução:", err);
  process.exit(1);
});

