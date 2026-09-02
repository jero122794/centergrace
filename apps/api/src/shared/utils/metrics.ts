// apps/api/src/shared/utils/metrics.ts
interface Sample {
  at: number;
  durationMs: number;
  statusCode: number;
}

const WINDOW_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

class MetricsStore {
  private samples: Sample[] = [];

  record(durationMs: number, statusCode: number): void {
    const at = Date.now();
    this.samples.push({ at, durationMs, statusCode });
    this.prune(at);
  }

  requestsPerMinute(): number {
    const cutoff = Date.now() - MINUTE_MS;
    return this.samples.filter((sample) => sample.at >= cutoff).length;
  }

  latencyPercentiles(): { p95: number; p99: number } {
    const values = this.samples.map((sample) => sample.durationMs).sort((a, b) => a - b);
    if (values.length === 0) {
      return { p95: 0, p99: 0 };
    }
    return {
      p95: percentile(values, 0.95),
      p99: percentile(values, 0.99),
    };
  }

  errorCounts(): { status4xx: number; status5xx: number } {
    const cutoff = Date.now() - WINDOW_MS;
    const recent = this.samples.filter((sample) => sample.at >= cutoff);
    return {
      status4xx: recent.filter((sample) => sample.statusCode >= 400 && sample.statusCode < 500).length,
      status5xx: recent.filter((sample) => sample.statusCode >= 500).length,
    };
  }

  private prune(now: number): void {
    this.samples = this.samples.filter((sample) => now - sample.at <= WINDOW_MS);
  }
}

const percentile = (sorted: number[], ratio: number): number => {
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * ratio) - 1);
  return sorted[index] ?? 0;
};

export const metricsStore = new MetricsStore();
