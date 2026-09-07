// 插件配置：settings 命名空间 schema + 默认值。
// 宿主侧注册到 ctx.settings，浏览器设置页通过 settingsScope 读写。
import z from '@deepseek-ai/schemastery'

export const NS = 'stock-assistant'

export const DEFAULT_CONFIG = {
  watchlist: [],
  backtestCount: 250,
  initialCapital: 100000,
  maFast: 5,
  maSlow: 20,
  rsiPeriod: 14,
  rsiOversold: 30,
  rsiOverbought: 70,
  kdjPeriod: 9,
  breakoutPeriod: 20,
  bollPeriod: 20,
  watchChangePct: 3,
  watchVolumeRatio: 2,
}

const watchItem = z.object({
  code: z.string(),
  name: z.string().default(''),
})

export const ConfigSchema = z.object({
  watchlist: z.array(watchItem).default([]),
  backtestCount: z.number().step(1).min(40).max(800).default(DEFAULT_CONFIG.backtestCount),
  initialCapital: z.number().min(1000).max(1e9).default(DEFAULT_CONFIG.initialCapital),
  maFast: z.number().step(1).min(2).max(100).default(DEFAULT_CONFIG.maFast),
  maSlow: z.number().step(1).min(3).max(250).default(DEFAULT_CONFIG.maSlow),
  rsiPeriod: z.number().step(1).min(2).max(100).default(DEFAULT_CONFIG.rsiPeriod),
  rsiOversold: z.number().min(1).max(50).default(DEFAULT_CONFIG.rsiOversold),
  rsiOverbought: z.number().min(50).max(99).default(DEFAULT_CONFIG.rsiOverbought),
  kdjPeriod: z.number().step(1).min(2).max(100).default(DEFAULT_CONFIG.kdjPeriod),
  breakoutPeriod: z.number().step(1).min(2).max(250).default(DEFAULT_CONFIG.breakoutPeriod),
  bollPeriod: z.number().step(1).min(2).max(250).default(DEFAULT_CONFIG.bollPeriod),
  watchChangePct: z.number().min(0.5).max(20).default(DEFAULT_CONFIG.watchChangePct),
  watchVolumeRatio: z.number().min(1).max(20).default(DEFAULT_CONFIG.watchVolumeRatio),
})

/** 从（可能不完整的）配置对象合并默认值，得到完整配置。 */
export function mergeConfig(partial) {
  return { ...DEFAULT_CONFIG, ...(partial || {}) }
}
