/**
 * ============================================================================
 * 🎬 SHARED: MOTION TIMELINE (INSPIRADO NO SAWABONA-MOTION-ENGINE)
 * ============================================================================
 *
 * Motor de interpolação e timeline visual para terminal.
 * Permite animar e apresentar etapas de processos assíncronos com estilo,
 * taxas de progresso e funções de easing matemáticas.
 */

export type EasingFn = (t: number) => number;

export const MotionEasings = {
  linear: (t: number): number => t,
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
} as const;

export interface TimelineStep {
  readonly title: string;
  readonly durationMs: number;
  readonly easing?: EasingFn;
}

export class MotionTimeline {
  private steps: TimelineStep[] = [];

  /**
   * Adiciona uma etapa à linha do tempo.
   */
  public addStep(step: TimelineStep): this {
    this.steps.push(step);
    return this;
  }

  /**
   * Renderiza uma barra estilizada de progresso para o terminal.
   */
  public static renderBar(progress: number, width = 30, label = ""): string {
    const clampedProgress = Math.min(1, Math.max(0, progress));
    const filledCount = Math.round(clampedProgress * width);
    const emptyCount = width - filledCount;
    const bar = "▓".repeat(filledCount) + "░".repeat(Math.max(0, emptyCount));
    const percentage = (clampedProgress * 100).toFixed(0).padStart(3, " ");
    return `[${bar}] ${percentage}% ${label}`;
  }

  /**
   * Executa a animação de uma etapa com atraso assíncrono controlado.
   */
  public async playStep(step: TimelineStep, frames = 6): Promise<void> {
    const easing = step.easing ?? MotionEasings.easeOutQuad;
    const intervalMs = Math.max(10, Math.floor(step.durationMs / frames));

    for (let frame = 1; frame <= frames; frame++) {
      const normalizedTime = frame / frames;
      const easedProgress = easing(normalizedTime);
      const output = MotionTimeline.renderBar(easedProgress, 25, `👉 ${step.title}`);
      
      // Imprime na mesma linha ou linha a linha de forma limpa
      console.log(`   ${output}`);

      if (frame < frames) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    }
  }

  /**
   * Executa toda a timeline em sequência.
   */
  public async runAll(): Promise<void> {
    for (const step of this.steps) {
      await this.playStep(step);
    }
  }
}

