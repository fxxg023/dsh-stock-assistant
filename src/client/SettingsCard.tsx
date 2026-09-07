// 股票助手设置卡片：自选股 + 回测参数 + 策略参数 + 盯盘参数。
// 自绘表单（不依赖官方卡片外观），读写走 settingsScope（set/unset + getSnapshot）。
import { useSyncExternalStore } from 'react'

const num = (v: any, fallback = ''): string => (v == null || v === '' ? String(fallback) : String(v))

function useScope(scope: any): any {
  return useSyncExternalStore(
    (cb: () => void) => scope.subscribe(cb),
    () => scope.getSnapshot(),
  )
}

/** 数字输入字段。 */
function NumField(props: { label: string; field: string; value: number | undefined; scope: any; writable: boolean; step?: number }) {
  const { label, field, value, scope, writable, step } = props
  return (
    <label style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <input
        type="number"
        step={step ?? 1}
        disabled={!writable}
        value={num(value)}
        onChange={(e) => { const v = parseFloat(e.target.value); if (!Number.isNaN(v)) void scope.set(field, v) }}
        style={inputStyle}
      />
    </label>
  )
}

export function SettingsCard(props: any) {
  const { scope } = props
  const snapshot = useScope(scope)
  const status = snapshot.status
  const value: any = snapshot.value || {}
  const writable = snapshot.writable

  if (status === 'unavailable') {
    return <div style={boxStyle}>股票助手配置不可用（命名空间未暴露或连接为内存模式）。</div>
  }
  if (status !== 'ready') {
    return <div style={boxStyle}>加载中…</div>
  }

  const watchlist: Array<{ code: string; name: string }> = Array.isArray(value.watchlist) ? value.watchlist : []

  const addStock = () => {
    const code = (document.getElementById('stock-new-code') as HTMLInputElement | null)?.value?.trim()
    if (!code) return
    if (watchlist.some((w) => w.code === code)) return
    void scope.set('watchlist', [...watchlist, { code, name: '' }])
  }
  const removeStock = (code: string) => {
    void scope.set('watchlist', watchlist.filter((w) => w.code !== code))
  }

  return (
    <div style={boxStyle}>
      <div style={titleStyle}>股票助手</div>
      <div style={descStyle}>自选股、回测与盯盘参数（修改后即时生效，回测/盯盘工具会读取这里）。</div>

      <div style={sectionStyle}>自选股</div>
      <div style={{ marginBottom: 8 }}>
        {watchlist.length === 0 && <div style={{ color: '#888', fontSize: 13 }}>（暂无自选股）</div>}
        {watchlist.map((w) => (
          <div key={w.code} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: 'monospace' }}>{w.code}</span>
            <span style={{ color: '#666' }}>{w.name || '—'}</span>
            <button type="button" disabled={!writable} onClick={() => removeStock(w.code)} style={miniBtnStyle}>移除</button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input id="stock-new-code" type="text" placeholder="输入 6 位代码，如 600000" disabled={!writable} style={{ ...inputStyle, flex: 1 }} />
        <button type="button" disabled={!writable} onClick={addStock} style={btnStyle}>添加</button>
      </div>

      <div style={sectionStyle}>回测参数</div>
      <NumField label="回测 K 线根数" field="backtestCount" value={value.backtestCount} scope={scope} writable={writable} />
      <NumField label="初始资金" field="initialCapital" value={value.initialCapital} scope={scope} writable={writable} step={1000} />

      <div style={sectionStyle}>策略参数</div>
      <NumField label="均线快线 (maFast)" field="maFast" value={value.maFast} scope={scope} writable={writable} />
      <NumField label="均线慢线 (maSlow)" field="maSlow" value={value.maSlow} scope={scope} writable={writable} />
      <NumField label="RSI 周期" field="rsiPeriod" value={value.rsiPeriod} scope={scope} writable={writable} />
      <NumField label="RSI 超卖阈值" field="rsiOversold" value={value.rsiOversold} scope={scope} writable={writable} />
      <NumField label="RSI 超买阈值" field="rsiOverbought" value={value.rsiOverbought} scope={scope} writable={writable} />
      <NumField label="KDJ 周期" field="kdjPeriod" value={value.kdjPeriod} scope={scope} writable={writable} />
      <NumField label="突破周期 (N日)" field="breakoutPeriod" value={value.breakoutPeriod} scope={scope} writable={writable} />
      <NumField label="布林带周期" field="bollPeriod" value={value.bollPeriod} scope={scope} writable={writable} />

      <div style={sectionStyle}>盯盘参数</div>
      <NumField label="涨跌幅阈值 (%)" field="watchChangePct" value={value.watchChangePct} scope={scope} writable={writable} step={0.5} />
      <NumField label="放量倍数" field="watchVolumeRatio" value={value.watchVolumeRatio} scope={scope} writable={writable} step={0.5} />
    </div>
  )
}

const boxStyle: React.CSSProperties = { padding: 16, fontSize: 14, color: 'inherit' }
const titleStyle: React.CSSProperties = { fontSize: 16, fontWeight: 600, marginBottom: 4 }
const descStyle: React.CSSProperties = { fontSize: 12, color: '#888', marginBottom: 12 }
const sectionStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, margin: '16px 0 8px', borderTop: '1px solid rgba(128,128,128,.25)', paddingTop: 12 }
const rowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }
const labelStyle: React.CSSProperties = { flex: 1 }
const inputStyle: React.CSSProperties = { width: 120, padding: '4px 8px', borderRadius: 4, border: '1px solid rgba(128,128,128,.4)', background: 'transparent', color: 'inherit', fontSize: 13 }
const btnStyle: React.CSSProperties = { padding: '4px 12px', borderRadius: 4, border: '1px solid rgba(128,128,128,.4)', background: 'transparent', color: 'inherit', cursor: 'pointer', fontSize: 13 }
const miniBtnStyle: React.CSSProperties = { ...btnStyle, padding: '2px 8px', fontSize: 12 }
