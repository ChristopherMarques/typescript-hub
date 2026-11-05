/**
 * ============================================================================
 * 🎓 FUNDAMENTOS DE TYPESCRIPT: DISCRIMINATED UNIONS (MOTION-ENGINE PATTERN)
 * ============================================================================
 *
 * Inspirado no repositório 'sawabona-motion-engine', este arquivo demonstra:
 * 1. Máquinas de estados finitos (FSM) com Discriminated Unions.
 * 2. Impossibilidade de estados inválidos em tempo de compilação.
 * 3. Checagem exaustiva de tipos com a função 'assertNever'.
 * 4. Interpolação de keyframes e funções de easing matemáticas.
 *
 * Como rodar:
 *   npx tsx 01-fundamentals/playground/03-discriminated-unions.ts
 *   ou: npm run play:unions
 */

// ============================================================================
// 1. CHECAGEM EXAUSTIVA (EXHAUSTIVE CHECK)
// ============================================================================

/**
 * Função utilitária que aproveita o tipo 'never'.
 * Se adicionarmos um novo caso a uma união discriminada e esquecermos
 * de tratá-lo no switch, o TypeScript emitirá um erro de compilação aqui!
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union case: ${JSON.stringify(value)}`);
}

// ============================================================================
// 2. MODELAGEM DE ESTADOS DA ENGINE DE MOVIMENTO
// ============================================================================

export interface IdleState {
  readonly status: "idle";
}

export interface RunningState {
  readonly status: "running";
  readonly startTimestamp: number;
  readonly elapsedMs: number;
  readonly durationMs: number;
  readonly currentProgress: number; // 0.0 até 1.0
  readonly currentValue: number;
}

export interface PausedState {
  readonly status: "paused";
  readonly pausedAtMs: number;
  readonly remainingMs: number;
}

export interface CompletedState {
  readonly status: "completed";
  readonly finalValue: number;
  readonly totalDurationMs: number;
}

export type MotionEngineState =
  | IdleState
  | RunningState
  | PausedState
  | CompletedState;

// ============================================================================
// 3. AÇÕES DA ENGINE (DISCRIMINATED UNIONS)
// ============================================================================

export type MotionAction =
  | {
      readonly type: "START";
      readonly durationMs: number;
      readonly startValue: number;
      readonly endValue: number;
      readonly startTimestamp?: number;
    }
  | { readonly type: "TICK"; readonly currentTimestamp: number }
  | { readonly type: "PAUSE" }
  | { readonly type: "RESUME"; readonly currentTimestamp: number }
  | { readonly type: "RESET" };

// ============================================================================
// 4. FUNÇÕES DE EASING PURAS (MATEMÁTICA DE INTERPOLAÇÃO)
// ============================================================================

export type EasingFunction = (progress: number) => number;

export const Easings = {
  linear: (t: number): number => t,
  easeInQuad: (t: number): number => t * t,
  easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
} as const;

// ============================================================================
// 5. REDUTOR DE ESTADO TIPADO (STATE REDUCER)
// ============================================================================

export class MotionSimulator {
  private state: MotionEngineState = { status: "idle" };
  private startValue = 0;
  private endValue = 100;
  private easing: EasingFunction = Easings.easeOutCubic;

  public getState(): MotionEngineState {
    return this.state;
  }

  public dispatch(action: MotionAction): void {
    switch (action.type) {
      case "START": {
        this.startValue = action.startValue;
        this.endValue = action.endValue;
        const startTimestamp = action.startTimestamp ?? Date.now();
        this.state = {
          status: "running",
          startTimestamp,
          elapsedMs: 0,
          durationMs: action.durationMs,
          currentProgress: 0,
          currentValue: action.startValue,
        };
        break;
      }

      case "TICK": {
        if (this.state.status !== "running") return;

        const rawElapsed = action.currentTimestamp - this.state.startTimestamp;
        const elapsedMs = Math.min(rawElapsed, this.state.durationMs);
        const progress = elapsedMs / this.state.durationMs;
        const easedProgress = this.easing(progress);
        const currentValue = this.startValue + (this.endValue - this.startValue) * easedProgress;

        if (progress >= 1) {
          this.state = {
            status: "completed",
            finalValue: this.endValue,
            totalDurationMs: this.state.durationMs,
          };
        } else {
          this.state = {
            status: "running",
            startTimestamp: this.state.startTimestamp,
            elapsedMs,
            durationMs: this.state.durationMs,
            currentProgress: progress,
            currentValue,
          };
        }
        break;
      }

      case "PAUSE": {
        if (this.state.status !== "running") return;
        this.state = {
          status: "paused",
          pausedAtMs: this.state.elapsedMs,
          remainingMs: this.state.durationMs - this.state.elapsedMs,
        };
        break;
      }

      case "RESUME": {
        if (this.state.status !== "paused") return;
        const previousElapsed = this.state.pausedAtMs;
        const duration = previousElapsed + this.state.remainingMs;
        this.state = {
          status: "running",
          startTimestamp: action.currentTimestamp - previousElapsed,
          elapsedMs: previousElapsed,
          durationMs: duration,
          currentProgress: previousElapsed / duration,
          currentValue: this.startValue + (this.endValue - this.startValue) * this.easing(previousElapsed / duration),
        };
        break;
      }

      case "RESET": {
        this.state = { status: "idle" };
        break;
      }

      default:
        // Se adicionarmos uma nova ação à união e não a tratarmos aqui, haverá erro de tipo!
        assertNever(action);
    }
  }

  /**
   * Renderiza uma barra de progresso visual em texto no console.
   */
  public renderProgressBar(width = 25): string {
    const s = this.state;
    switch (s.status) {
      case "idle":
        return `[${" ".repeat(width)}] Ocioso`;
      case "paused":
        return `[⏸️ PAUSADO em ${s.pausedAtMs}ms]`;
      case "completed":
        return `[${"█".repeat(width)}] Concluído: ${s.finalValue.toFixed(1)}px`;
      case "running": {
        const filled = Math.round(s.currentProgress * width);
        const empty = width - filled;
        const bar = "█".repeat(filled) + "░".repeat(Math.max(0, empty));
        return `[${bar}] ${(s.currentProgress * 100).toFixed(0)}% (Posição: ${s.currentValue.toFixed(1)}px)`;
      }
      default:
        return assertNever(s);
    }
  }
}

// ============================================================================
// 6. SIMULAÇÃO PRÁTICA NO TERMINAL
// ============================================================================

console.log("============================================================");
console.log("🎬 DEMONSTRAÇÃO: SAWABONA-MOTION-ENGINE STATE MACHINE");
console.log("============================================================\n");

const engine = new MotionSimulator();

console.log("1. Estado Inicial:", engine.renderProgressBar());

console.log("\n2. Disparando START (0px até 300px em 1000ms)...");
const baseTime = Date.now();
engine.dispatch({
  type: "START",
  durationMs: 1000,
  startValue: 0,
  endValue: 300,
  startTimestamp: baseTime,
});
console.log("   Frame inicial:", engine.renderProgressBar());

console.log("\n3. Avançando ticks temporais:");
const timeSteps = [200, 400, 600, 800, 1000];

for (const step of timeSteps) {
  engine.dispatch({ type: "TICK", currentTimestamp: baseTime + step });
  console.log(`   +${step}ms -> ${engine.renderProgressBar()}`);
}

console.log("\n4. Estado Final Garantido pelo Compilador:");
const finalState = engine.getState();
if (finalState.status === "completed") {
  console.log(`   🏆 Animação finalizada com valor exato de ${finalState.finalValue}px em ${finalState.totalDurationMs}ms!`);
}
