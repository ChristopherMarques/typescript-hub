# 01: Princípios de Clean Code, Object Calisthenics e Nomenclatura

> *"O custo real de um software não está em escrevê-lo, mas em mantê-lo e lê-lo meses depois de ir para a produção."* — *Robert C. Martin (Uncle Bob)*

---

## 🧭 1. Os Três Pilares Clássicos: KISS, DRY e YAGNI

### KISS (Keep It Simple, Stupid)
A simplicidade é o ápice da sofisticação técnica. Nunca escolha uma solução complexa (como padrões de projeto desnecessários ou metaprogramação obscura) quando uma função pura simples de 10 linhas resolve o problema com 100% de clareza.

### DRY (Don't Repeat Yourself) — com Sabedoria!
Evitar duplicação de conhecimento e regras de negócio é fundamental. No entanto, como ensina **Sandi Metz**:
> *"A duplicação é muito mais barata do que a abstração errada."*

Se dois blocos de código se parecem hoje apenas por coincidência visual, mas evoluirão por motivos de negócio completamente distintos, **não** os una prematuramente em uma abstração mágica cheia de flags booleanas!

### YAGNI (You Aren't Gonna Need It)
Não projete recursos ou abstrações genéricas baseando-se em suposições do que o cliente "pode querer no ano que vem". Resolva o problema real de hoje com arquitetura modular o suficiente para ser estendida no futuro quando a necessidade genuína surgir.

---

## 🚪 2. Guard Clauses & Early Return (Diga Adeus ao "Arrow Code")

Um dos hábitos mais transformadores no design de código é o uso de **Early Return (Retorno Antecipado)**. Em vez de aninhar múltiplos blocos `if/else`, valide as condições de erro primeiro e saia imediatamente da função:

### Código Pirâmide / Arrow Code (Difícil de Ler) ❌

```typescript
function processPayment(user: User | null, amount: number): boolean {
  if (user !== null) {
    if (user.isActive) {
      if (amount > 0) {
        if (user.balance >= amount) {
          user.balance -= amount;
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
```

### Código Linear com Guard Clauses (Limpo e Fluido) ✅

```typescript
function processPayment(user: User | null, amount: number): boolean {
  // 1. Guard Clauses no topo
  if (!user || !user.isActive) return false;
  if (amount <= 0) return false;
  if (user.balance < amount) return false;

  // 2. Caminho feliz (Happy Path) sem indentação profunda
  user.balance -= amount;
  return true;
}
```

---

## 🧘 3. Regras Selecionadas de Object Calisthenics

O *Object Calisthenics* (criado por Jeff Bay no livro *The ThoughtWorks Anthology*) propõe exercícios rígidos para exercitar bons hábitos de Orientação a Objetos:

### Regra 1: Apenas 1 nível de indentação por método
Se seu método tiver loops dentro de condicionais dentro de outros loops, extraia partes da lógica para métodos auxiliares com nomes expressivos.

### Regra 2: Não use a palavra-chave `else`
O `else` quase sempre mascara a ausência de uma Guard Clause ou a falta de polimorfismo.

### Regra 3: Encapsule tipos primitivos (Value Objects)
Em vez de passar números soltos para representar dinheiro, peso ou porcentagem, encapsule-os em objetos de valor que protegem suas próprias regras:

```typescript
export class Money {
  private constructor(public readonly amountInCents: number) {
    if (amountInCents < 0) {
      throw new Error("O valor monetário não pode ser negativo.");
    }
  }

  public static fromReal(amount: number): Money {
    return new Money(Math.round(amount * 100));
  }

  public add(other: Money): Money {
    return new Money(this.amountInCents + other.amountInCents);
  }

  public formatBRL(): string {
    return (this.amountInCents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
}
```

---

## 🔤 4. A Arte de Nomear Coisas em Inglês Técnico

Em Clean Code, nomes devem revelar a real intenção sem exigir comentários para explicar o óbvio:

| Ruim ❌ | Bom ✅ | Por que é melhor? |
| :--- | :--- | :--- |
| `d` ou `days` | `elapsedDaysSinceLastLogin` | Especifica o contexto e a unidade de tempo. |
| `uList` | `activeUsers` | Remove abreviações preguiçosas e indica o estado. |
| `check()` | `isAccountEligibleForDiscount()` | Funções que retornam booleano devem iniciar com `is`, `has`, `can` ou `should`. |
| `data` ou `info` | `orderSummaryPayload` | Evita termos genéricos sem significado de negócio. |
| `handle()` | `processOrderSubmission()` | Descreve a ação real que está sendo executada. |

---

## 💡 Exercício Mental para o Seu Dia a Dia

Antes de abrir um Pull Request, faça a si mesmo três perguntas:
1. "Alguém que nunca viu este código conseguiria entendê-lo em 2 minutos sem me perguntar nada?"
2. "Existe algum `else` que poderia ser eliminado com um `return` antecipado?"
3. "Os nomes das minhas funções dizem exatamente O QUE elas fazem, sem mentir ou esconder efeitos colaterais?"

