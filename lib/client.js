window.__ModuleLoader__.load({
	id: "dsh-stock-assistant",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/SettingsCard.tsx
		const num = (v, fallback = "") => v == null || v === "" ? String(fallback) : String(v);
		function useScope(scope) {
			return (0, react.useSyncExternalStore)((cb) => scope.subscribe(cb), () => scope.getSnapshot());
		}
		/** 数字输入字段。 */
		function NumField(props) {
			const { label, field, value, scope, writable, step } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
				style: rowStyle,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: labelStyle,
					children: label
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
					type: "number",
					step: step ?? 1,
					disabled: !writable,
					value: num(value),
					onChange: (e) => {
						const v = parseFloat(e.target.value);
						if (!Number.isNaN(v)) scope.set(field, v);
					},
					style: inputStyle
				})]
			});
		}
		function SettingsCard(props) {
			const { scope } = props;
			const snapshot = useScope(scope);
			const status = snapshot.status;
			const value = snapshot.value || {};
			const writable = snapshot.writable;
			if (status === "unavailable") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: boxStyle,
				children: "股票助手配置不可用（命名空间未暴露或连接为内存模式）。"
			});
			if (status !== "ready") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: boxStyle,
				children: "加载中…"
			});
			const watchlist = Array.isArray(value.watchlist) ? value.watchlist : [];
			const addStock = () => {
				const code = document.getElementById("stock-new-code")?.value?.trim();
				if (!code) return;
				if (watchlist.some((w) => w.code === code)) return;
				scope.set("watchlist", [...watchlist, {
					code,
					name: ""
				}]);
			};
			const removeStock = (code) => {
				scope.set("watchlist", watchlist.filter((w) => w.code !== code));
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: boxStyle,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: titleStyle,
						children: "股票助手"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: descStyle,
						children: "自选股、回测与盯盘参数（修改后即时生效，回测/盯盘工具会读取这里）。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: sectionStyle,
						children: "自选股"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: { marginBottom: 8 },
						children: [watchlist.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								color: "#888",
								fontSize: 13
							},
							children: "（暂无自选股）"
						}), watchlist.map((w) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 8,
								marginBottom: 4
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: { fontFamily: "monospace" },
									children: w.code
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: { color: "#666" },
									children: w.name || "—"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: !writable,
									onClick: () => removeStock(w.code),
									style: miniBtnStyle,
									children: "移除"
								})
							]
						}, w.code))]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: 8
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							id: "stock-new-code",
							type: "text",
							placeholder: "输入 6 位代码，如 600000",
							disabled: !writable,
							style: {
								...inputStyle,
								flex: 1
							}
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: !writable,
							onClick: addStock,
							style: btnStyle,
							children: "添加"
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: sectionStyle,
						children: "回测参数"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						label: "回测 K 线根数",
						field: "backtestCount",
						value: value.backtestCount,
						scope,
						writable
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						label: "初始资金",
						field: "initialCapital",
						value: value.initialCapital,
						scope,
						writable,
						step: 1e3
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: sectionStyle,
						children: "策略参数"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						label: "均线快线 (maFast)",
						field: "maFast",
						value: value.maFast,
						scope,
						writable
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						label: "均线慢线 (maSlow)",
						field: "maSlow",
						value: value.maSlow,
						scope,
						writable
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						label: "RSI 周期",
						field: "rsiPeriod",
						value: value.rsiPeriod,
						scope,
						writable
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						label: "RSI 超卖阈值",
						field: "rsiOversold",
						value: value.rsiOversold,
						scope,
						writable
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						label: "RSI 超买阈值",
						field: "rsiOverbought",
						value: value.rsiOverbought,
						scope,
						writable
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						label: "KDJ 周期",
						field: "kdjPeriod",
						value: value.kdjPeriod,
						scope,
						writable
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						label: "突破周期 (N日)",
						field: "breakoutPeriod",
						value: value.breakoutPeriod,
						scope,
						writable
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						label: "布林带周期",
						field: "bollPeriod",
						value: value.bollPeriod,
						scope,
						writable
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: sectionStyle,
						children: "盯盘参数"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						label: "涨跌幅阈值 (%)",
						field: "watchChangePct",
						value: value.watchChangePct,
						scope,
						writable,
						step: .5
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						label: "放量倍数",
						field: "watchVolumeRatio",
						value: value.watchVolumeRatio,
						scope,
						writable,
						step: .5
					})
				]
			});
		}
		const boxStyle = {
			padding: 16,
			fontSize: 14,
			color: "inherit"
		};
		const titleStyle = {
			fontSize: 16,
			fontWeight: 600,
			marginBottom: 4
		};
		const descStyle = {
			fontSize: 12,
			color: "#888",
			marginBottom: 12
		};
		const sectionStyle = {
			fontSize: 13,
			fontWeight: 600,
			margin: "16px 0 8px",
			borderTop: "1px solid rgba(128,128,128,.25)",
			paddingTop: 12
		};
		const rowStyle = {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			marginBottom: 6
		};
		const labelStyle = { flex: 1 };
		const inputStyle = {
			width: 120,
			padding: "4px 8px",
			borderRadius: 4,
			border: "1px solid rgba(128,128,128,.4)",
			background: "transparent",
			color: "inherit",
			fontSize: 13
		};
		const btnStyle = {
			padding: "4px 12px",
			borderRadius: 4,
			border: "1px solid rgba(128,128,128,.4)",
			background: "transparent",
			color: "inherit",
			cursor: "pointer",
			fontSize: 13
		};
		const miniBtnStyle = {
			...btnStyle,
			padding: "2px 8px",
			fontSize: 12
		};
		//#endregion
		//#region src/client/index.ts
		const inject = ["slots", "settingsScope"];
		function apply(ctx) {
			const scope = ctx.settingsScope.bind({ namespace: "stock-assistant" });
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "stock-assistant",
				order: 20,
				label: () => "股票助手",
				inject: () => ({ scope })
			}, SettingsCard));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
