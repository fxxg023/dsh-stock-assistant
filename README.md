# dsh-stock-assistant

A 股行情 / 热点 / 量化分析助手 —— [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）插件。
A-share quotes, market hotspots and quant analysis assistant — a plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH).

数据源 / Data sources：东方财富公开接口（行情、板块、涨停池、资金流、新闻）+ 腾讯行情（前复权 K 线）+ akshare（龙虎榜、财务摘要）。
Eastmoney public endpoints (quotes, sectors, limit-up pool, money flow, news) + Tencent quotes (adjusted K-lines) + akshare (dragon-tiger list, financial abstracts).

> ⚠️ 数据来自非官方公开接口，仅供学习研究，**不构成投资建议**。
> ⚠️ Data comes from unofficial public endpoints. For research/learning only — **not investment advice**.

## 功能 / Features

注册 20 个模型工具 + 一个独立设置页「股票助手」+ 盯盘告警（会话日志 + Windows 桌面气泡通知）。
20 model tools, a standalone "股票助手 / Stock Assistant" settings section, and watch alerts (session log + Windows toast notifications).

| 分类 / Category | 工具 / Tools |
|---|---|
| 行情分析 / Quotes & analysis | `stock_quote` `stock_kline` `stock_indicators` `strategy` |
| 热点 / Hotspots | `sector_rank` `sector_flow` `limit_up_pool` `dragon_tiger` |
| 资金·财务·新闻 / Flow, finance & news | `stock_flow` `stock_finance` `stock_news` |
| 量化 / Quant | `screen`（条件选股 / screener）`backtest`（6 策略回测 / 6-strategy backtest） |
| 自选·盯盘 / Watchlist & alerts | `watchlist_add` `watchlist_remove` `watchlist_show` `watch_start` `watch_stop` `watch_status` `watch_alerts` |

设置页（设置 → 股票助手）可编辑自选股、回测参数、策略参数与盯盘阈值，修改即时生效。
The settings section (Settings → 股票助手 / Stock Assistant) edits the watchlist, backtest/strategy parameters and alert thresholds; changes take effect immediately.

## 安装 / Install

前置依赖 / Prerequisites：

- Node.js ≥ 18（构建客户端 bundle 需要）
- Python 3 + [akshare](https://github.com/akfamily/akshare)（仅 `dragon_tiger`、`stock_finance` 两个工具需要；`pip install akshare`）
- Windows：桌面气泡通知仅 Windows 可用（其他平台自动跳过）

### 方式一：从 GitHub 直接安装 / Install from GitHub

```sh
dsh plugin --profile web add github:fxxg023/dsh-stock-assistant
```

> 推荐固定到某个 commit（更稳妥）：`dsh plugin --profile web add git+https://github.com/fxxg023/dsh-stock-assistant.git#<commit>`
> Recommended: pin a commit — `dsh plugin --profile web add git+https://github.com/fxxg023/dsh-stock-assistant.git#<commit>`

### 方式二：本地开发 / Local development

```sh
git clone https://github.com/fxxg023/dsh-stock-assistant.git
cd dsh-stock-assistant
pnpm install && pnpm build      # 必须构建：生成 lib/client.js

# 从 DSH checkout 安装（junction 直连源码目录，改完即时可见）
cd <path-to>/deepseek-harness
pnpm dsh plugin --profile web add <path-to>/dsh-stock-assistant
```

> ⚠️ `package.json` 声明了 `exports["./client"]`，**必须先 `pnpm build` 生成 `lib/client.js`**，否则 web 启动页会报 `Failed to load plugins`（本仓库已提交预构建产物，GitHub 安装无需手动构建）。
> ⚠️ The package declares `exports["./client"]`, so `lib/client.js` MUST exist — otherwise the web boot page reports `Failed to load plugins`. A prebuilt bundle is committed, so GitHub installs don't need a manual build.

## 使用 / Usage

把股票加入自选（对话里用工具或设置页都行），然后：

- 问行情：`stock_quote 600000`、`stock_kline 000001`、`strategy 300750`
- 看热点：`sector_rank`、`limit_up_pool`、`dragon_tiger`
- 做回测：`backtest 600519 策略 ma_cross`
- 开盯盘：`watch_start`（30 秒轮询自选股，异动/涨停/放量告警），`watch_alerts` 看日志

Add stocks to the watchlist (via chat tools or the settings section), then:

- Quotes & signals: `stock_quote 600000`, `stock_kline 000001`, `strategy 300750`
- Hotspots: `sector_rank`, `limit_up_pool`, `dragon_tiger`
- Backtests: `backtest 600519 strategy ma_cross`
- Alerts: `watch_start` (polls the watchlist every 30 s; alerts on moves, limit up/down, volume spikes), `watch_alerts` to read the log

## 项目结构 / Layout

```
├── index.js                # 宿主入口：注册 20 个工具 + settings 命名空间 stock-assistant
├── src/                    # 数据/量化/盯盘/配置（纯 ESM JS）
│   ├── eastmoney.js        # 东财 HTTP：行情/板块/涨停池/资金流
│   ├── tencent.js          # 腾讯前复权 K 线
│   ├── akshare.js          # Python 子进程 JSON-RPC（龙虎榜/财务）
│   ├── quant.js            # 6 策略回测 + 多空信号
│   ├── watch.js store.js notify.js
│   └── client/             # 设置页（TSX，tsdown 构建）
│       └── SettingsCard.tsx
├── py/akshare_adapter.py   # akshare stdin/stdout JSON-RPC
├── lib/client.js           # 客户端 bundle（已构建，提交进仓库）
└── cordis.patch.yml        # 插件挂载行
```

## 致谢 / Credits

插件形态与客户端 bundle 格式遵循 DeepSeek Harness 官方插件约定（`dsh.client` + `window.__ModuleLoader__.load` 闭包工厂格式）。
The plugin shape follows the official DeepSeek Harness plugin conventions (`dsh.client` + the `window.__ModuleLoader__.load` closure-factory bundle format).

## License

[MIT](./LICENSE)
