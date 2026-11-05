# Estudo de Caso 03: Motores de Movimento e Extensibilidade (`sawabona-motion-engine`)

> **Repositório de Referência**: [`https://github.com/ChristopherMarques/sawabona-motion-engine`](https://github.com/ChristopherMarques/sawabona-motion-engine)  
> **Foco Primário**: Criação de Bibliotecas NPM, Contratos Estritos, Matemática/Interpolação e Open/Closed Principle (OCP).

---

## 🎯 1. O Desafio de Engines de Animação

Criar uma biblioteca de animação e física para a Web exige rigor extremo:
* **Taxa de Quadros**: Operar a 60 ou 120 FPS sem pausas de Garbage Collection.
* **Extensibilidade**: A engine não pode prever todas as curvas de animação que os desenvolvedores desejarão no futuro (molas, gravidade, ressaltos, cubic bezier).
* **Contratos Estritos**: A API pública precisa ser autoexplicativa e à prova de falhas em TypeScript.

O **`sawabona-motion-engine`** resolveu isso separando o **Relógio da Engine (Loop)** da **Fórmula Matemática de Interpolação (Strategy)**.

---

## 🔬 2. Dissecação da Fórmula de Interpolação Linear (LERP)

A base de qualquer animação gráfica é o cálculo de interpolação entre um valor inicial ($A$) e um valor final ($B$), dado um progresso normalizado ($t \in [0, 1]$):

$$\text{value}(t) = A + (B - A) \times \text{easing}(t)$$

### Implementação com Strategy Pattern em TypeScript:

```typescript
export type EasingStrategy = (progress: number) => number;

export interface AnimationKeyframe {
  readonly startValue: number;
  readonly endValue: number;
  readonly durationMs: number;
  readonly easing: EasingStrategy;
}

export function computeCurrentFrame(
  keyframe: AnimationKeyframe,
  elapsedMs: number
): number {
  const rawProgress = Math.min(1, Math.max(0, elapsedMs / keyframe.durationMs));
  const easedProgress = keyframe.easing(rawProgress);
  return keyframe.startValue + (keyframe.endValue - keyframe.startValue) * easedProgress;
}
```

---

## 🏛️ 3. O Princípio SOLID em Destaque: OCP (Open/Closed Principle)

Em vez de criar uma classe com um switch gigante de tipos de animação:

```typescript
// ❌ Ruim: Fechado para desenvolvedores externos criarem novas curvas
if (curve === "linear") ...
else if (curve === "bounce") ...
```

O `sawabona-motion-engine` mantém o núcleo **fechado para modificação, mas aberto para extensão**:

```typescript
// ✅ Qualquer desenvolvedor pode criar uma nova física sem alterar a engine:
export const SpringEasing: EasingStrategy = (t: number) => {
  const damping = 0.7;
  const frequency = 4.0;
  return 1 - Math.exp(-damping * t * 10) * Math.cos(frequency * t * Math.PI);
};
```

---

## 🥊 4. Desafio Prático: Interpolador de Cores Hexadecimais

### Enunciado do Desafio
Implemente uma classe `ColorInterpolator`:
1. Recebe duas cores hexadecimais no formato `#RRGGBB` (ex: `#000000` e `#FFFFFF`).
2. Método `interpolate(progress: number, easing: EasingStrategy): string`.
3. Converte os canais Red, Green e Blue para valores entre 0 e 255, calcula a interpolação com a função de easing e retorna a cor resultante em formato hexadecimal `#RRGGBB`.
4. Garanta que o progresso seja sempre clampeado entre 0 e 1 para evitar estouro numérico.

