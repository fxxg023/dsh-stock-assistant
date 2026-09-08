window.__ModuleLoader__.load({
	id: "dsh-stock-assistant",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/SettingsCard.tsx
		function useScope(scope) {
			return (0, react.useSyncExternalStore)((cb) => scope.subscribe(cb), () => scope.getSnapshot());
		}
		/** 全部数值字段定义（顺序 = 渲染顺序）。 */
		const FIELDS = [
			{
				field: "backtestCount",
				label: "回测 K 线根数",
				step: 1,
				min: 40,
				max: 800
			},
			{
				field: "initialCapital",
				label: "初始资金（元）",
				step: 1e3,
				min: 1e3
			},
			{
				field: "maFast",
				label: "均线快线",
				step: 1,
				min: 2,
				max: 100
			},
			{
				field: "maSlow",
				label: "均线慢线",
				step: 1,
				min: 3,
				max: 250
			},
			{
				field: "rsiPeriod",
				label: "RSI 周期",
				step: 1,
				min: 2,
				max: 100
			},
			{
				field: "rsiOversold",
				label: "RSI 超卖阈值",
				step: 1,
				min: 1,
				max: 50
			},
			{
				field: "rsiOverbought",
				label: "RSI 超买阈值",
				step: 1,
				min: 50,
				max: 99
			},
			{
				field: "kdjPeriod",
				label: "KDJ 周期",
				step: 1,
				min: 2,
				max: 100
			},
			{
				field: "breakoutPeriod",
				label: "突破周期（N 日）",
				step: 1,
				min: 2,
				max: 250
			},
			{
				field: "bollPeriod",
				label: "布林带周期",
				step: 1,
				min: 2,
				max: 250
			},
			{
				field: "watchChangePct",
				label: "涨跌幅阈值（%）",
				step: .5,
				min: .5,
				max: 20
			},
			{
				field: "watchVolumeRatio",
				label: "放量倍数",
				step: .5,
				min: 1,
				max: 20
			}
		];
		const FIELD_LABELS = Object.fromEntries(FIELDS.map((f) => [f.field, f.label]));
		/** 策略分组：每个策略一个三级小标题，其下是策略参数。 */
		const STRATEGY_GROUPS = [
			{
				title: "均线金叉/死叉",
				fields: ["maFast", "maSlow"]
			},
			{
				title: "RSI 超卖反弹",
				fields: [
					"rsiPeriod",
					"rsiOversold",
					"rsiOverbought"
				]
			},
			{
				title: "KDJ 金叉/死叉",
				fields: ["kdjPeriod"]
			},
			{
				title: "N日突破",
				fields: ["breakoutPeriod"]
			},
			{
				title: "布林带回归",
				fields: ["bollPeriod"]
			}
		];
		function buildDraft(source) {
			const nums = {};
			for (const f of FIELDS) {
				const v = source?.[f.field];
				nums[f.field] = v == null || v === "" ? "" : String(v);
			}
			return {
				nums,
				watchlist: Array.isArray(source?.watchlist) ? source.watchlist.map((w) => ({
					code: String(w.code ?? ""),
					name: String(w.name ?? "")
				})) : []
			};
		}
		/** 数字输入行：自由输入文本，保存时再校验/解析。 */
		function NumField(props) {
			const { field, label, value, writable, invalid, onChange } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
				style: rowStyle,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: labelStyle,
					children: label
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
					id: `stock-field-${field}`,
					type: "text",
					inputMode: "decimal",
					disabled: !writable,
					value,
					onChange: (e) => onChange(e.target.value),
					style: {
						...inputStyle,
						...invalid ? { borderColor: "#e5484d" } : {}
					}
				})]
			});
		}
		function SettingsCard(props) {
			const { scope } = props;
			const snapshot = useScope(scope);
			const status = snapshot.status;
			const writable = snapshot.writable;
			const [draft, setDraft] = (0, react.useState)(null);
			const [newCode, setNewCode] = (0, react.useState)("");
			const [msg, setMsg] = (0, react.useState)(null);
			const [invalid, setInvalid] = (0, react.useState)({});
			(0, react.useEffect)(() => {
				if (status !== "ready") return;
				setDraft(buildDraft(snapshot.value));
				setNewCode("");
				setInvalid({});
			}, [status, snapshot.revision]);
			if (status === "unavailable") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: boxStyle,
				children: "股票助手配置不可用（命名空间未暴露或连接为内存模式）。"
			});
			if (status !== "ready" || draft === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: boxStyle,
				children: "加载中…"
			});
			const patchNum = (field, raw) => {
				setMsg(null);
				setDraft((d) => d === null ? d : {
					...d,
					nums: {
						...d.nums,
						[field]: raw
					}
				});
				const def = FIELDS.find((f) => f.field === field);
				const trimmed = raw.trim();
				const v = trimmed === "" ? NaN : Number(trimmed);
				let bad = false;
				if (trimmed !== "" && !Number.isFinite(v)) bad = true;
				if (!bad && trimmed !== "" && def?.min != null && v < def.min) bad = true;
				if (!bad && trimmed !== "" && def?.max != null && v > def.max) bad = true;
				setInvalid((prev) => ({
					...prev,
					[field]: bad
				}));
			};
			const addStock = () => {
				const code = newCode.trim();
				if (!code) return;
				if (!draft.watchlist.some((w) => w.code === code)) {
					setMsg(null);
					setDraft((d) => d === null ? d : {
						...d,
						watchlist: [...d.watchlist, {
							code,
							name: ""
						}]
					});
				}
				setNewCode("");
			};
			const removeStock = (code) => {
				setMsg(null);
				setDraft((d) => d === null ? d : {
					...d,
					watchlist: d.watchlist.filter((w) => w.code !== code)
				});
			};
			const resetToDefaults = () => {
				setMsg({
					text: "已恢复初始值，点击「保存」生效",
					kind: "info"
				});
				setDraft(buildDraft(snapshot.base));
				setInvalid({});
			};
			const save = async () => {
				const badField = FIELDS.find((f) => invalid[f.field]);
				if (badField !== void 0) {
					setMsg({
						text: `「${FIELD_LABELS[badField.field]}」数值无效，请检查`,
						kind: "error"
					});
					return;
				}
				const ops = [];
				for (const f of FIELDS) {
					const raw = draft.nums[f.field].trim();
					if (raw === "") continue;
					ops.push({
						op: "set",
						path: [f.field],
						value: Number(raw)
					});
				}
				ops.push({
					op: "set",
					path: ["watchlist"],
					value: draft.watchlist
				});
				const revBefore = scope.getSnapshot().revision;
				if (typeof scope.mutate === "function") await scope.mutate(ops);
				else for (const op of ops) await scope.set(op.path[0], op.value);
				if (scope.getSnapshot().revision !== revBefore) setMsg({
					text: "已保存",
					kind: "info"
				});
				else setMsg({
					text: "保存未生效：请检查数值是否在允许范围内",
					kind: "error"
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: boxStyle,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: mainTitleStyle,
						children: "股票助手"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: descStyle,
						children: "修改后点右下角「保存」生效；「初始化」恢复全部默认值。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: sectionStyle,
						children: "自选股"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: { marginBottom: 8 },
						children: [draft.watchlist.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: emptyHintStyle,
							children: "（暂无自选股）"
						}), draft.watchlist.map((w) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
							type: "text",
							placeholder: "输入 6 位代码，如 600000",
							disabled: !writable,
							value: newCode,
							onChange: (e) => setNewCode(e.target.value),
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
						field: "backtestCount",
						label: "回测 K 线根数",
						value: draft.nums.backtestCount,
						writable,
						invalid: !!invalid.backtestCount,
						onChange: (v) => patchNum("backtestCount", v)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						field: "initialCapital",
						label: "初始资金（元）",
						value: draft.nums.initialCapital,
						writable,
						invalid: !!invalid.initialCapital,
						onChange: (v) => patchNum("initialCapital", v)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: sectionStyle,
						children: "策略参数"
					}),
					STRATEGY_GROUPS.map((g) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: groupTitleStyle,
						children: g.title
					}), g.fields.map((f) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						field: f,
						label: FIELD_LABELS[f],
						value: draft.nums[f],
						writable,
						invalid: !!invalid[f],
						onChange: (v) => patchNum(f, v)
					}, f))] }, g.title)),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: sectionStyle,
						children: "盯盘参数"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						field: "watchChangePct",
						label: "涨跌幅阈值（%）",
						value: draft.nums.watchChangePct,
						writable,
						invalid: !!invalid.watchChangePct,
						onChange: (v) => patchNum("watchChangePct", v)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NumField, {
						field: "watchVolumeRatio",
						label: "放量倍数",
						value: draft.nums.watchVolumeRatio,
						writable,
						invalid: !!invalid.watchVolumeRatio,
						onChange: (v) => patchNum("watchVolumeRatio", v)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: footerStyle,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: {
								...msgStyle,
								...msg?.kind === "error" ? { color: "#e5484d" } : {}
							},
							children: msg?.text ?? ""
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								gap: 8
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: !writable,
								onClick: resetToDefaults,
								style: btnStyle,
								children: "初始化"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: !writable,
								onClick: save,
								style: saveBtnStyle,
								children: "保存"
							})]
						})]
					})
				]
			});
		}
		const boxStyle = {
			padding: "16px 20px",
			fontSize: 14,
			color: "inherit"
		};
		const mainTitleStyle = {
			fontSize: 20,
			fontWeight: 700,
			marginBottom: 4
		};
		const descStyle = {
			fontSize: 12,
			color: "#888",
			marginBottom: 12
		};
		const sectionStyle = {
			fontSize: 16,
			fontWeight: 600,
			margin: "20px 0 10px",
			borderTop: "1px solid rgba(128,128,128,.25)",
			paddingTop: 12
		};
		const groupTitleStyle = {
			fontSize: 14,
			fontWeight: 600,
			margin: "12px 0 6px",
			color: "#8b7cf6"
		};
		const emptyHintStyle = {
			color: "#888",
			fontSize: 13
		};
		const rowStyle = {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			marginBottom: 6
		};
		const labelStyle = {
			flex: 1,
			fontSize: 13,
			color: "#bbb"
		};
		const inputStyle = {
			width: 140,
			padding: "5px 10px",
			borderRadius: 6,
			border: "1px solid rgba(128,128,128,.45)",
			background: "rgba(128,128,128,.06)",
			color: "inherit",
			fontSize: 13,
			textAlign: "right"
		};
		const btnStyle = {
			padding: "5px 14px",
			borderRadius: 6,
			border: "1px solid rgba(128,128,128,.45)",
			background: "transparent",
			color: "inherit",
			cursor: "pointer",
			fontSize: 13
		};
		const saveBtnStyle = {
			...btnStyle,
			background: "#5b5bd6",
			borderColor: "#5b5bd6",
			color: "#fff",
			fontWeight: 600,
			padding: "5px 22px"
		};
		const miniBtnStyle = {
			...btnStyle,
			padding: "2px 8px",
			fontSize: 12
		};
		const footerStyle = {
			display: "flex",
			alignItems: "center",
			justifyContent: "flex-end",
			gap: 12,
			marginTop: 24,
			paddingTop: 14,
			borderTop: "1px solid rgba(128,128,128,.25)"
		};
		const msgStyle = {
			fontSize: 12,
			color: "#8fae8f",
			marginRight: "auto"
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
