import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Topbar from "../components/Topbar";
import Badge from "../components/Badge";
import { getRules, createRule, updateRule, deleteRule } from "../api/validationRules";
import { getDatasets, getDatasetColumns } from "../api/datasets";

// Which columns are available for each dataset, shown in the "Create New Rule" form.
// const datasetColumns = {
//   "Equity Trades": ["trade_id", "trade_timestamp", "division", "exchange", "symbol", "company_name", "trade_type", "quantity", "price", "trade_value", "currency", "trader_id", "client_id", "order_type", "status"],
//   "Bond Trades": ["trade_id", "bond_name", "issuer", "price", "quantity", "coupon_rate", "maturity_date"],
//   "Commodity Trades": ["trade_id", "commodity", "price", "quantity", "unit", "trade_date"],
// };



const operators = [">", ">=", "<", "<=", "=", "==", "!=", "IS NOT NULL", "IS NULL"];

// Operators jema value field ni jarur nathi (IS NOT NULL, IS NULL)
const NO_VALUE_OPERATORS = ["IS NOT NULL", "IS NULL"];


const datasetTone = {
  "Equity Trades": "purple",
  "Bond Trades": "blue",
  "Commodity Trades": "orange",
};

// Shown until the API responds, or if the request fails.
const fallbackRules = [
  { id: 1, dataset: "Equity Trades", column: "price", operator: ">", value: "0", isActive: true },
  { id: 2, dataset: "Equity Trades", column: "quantity", operator: ">", value: "0", isActive: true },
  { id: 3, dataset: "Equity Trades", column: "trade_date", operator: "IS NOT NULL", value: "-", isActive: true },
  { id: 4, dataset: "Equity Trades", column: "symbol", operator: "IS NOT NULL", value: "-", isActive: true },
  { id: 5, dataset: "Bond Trades", column: "face_value", operator: ">", value: "0", isActive: true },
  { id: 6, dataset: "Bond Trades", column: "coupon_rate", operator: ">=", value: "0", isActive: true },
  { id: 7, dataset: "Commodity Trades", column: "price", operator: ">", value: "0", isActive: true },
  { id: 8, dataset: "Commodity Trades", column: "quantity", operator: ">", value: "0", isActive: false },
];

const emptyForm = {
  ruleName: "",
  dataset: "Equity Trades",
  column: "price",
  operator: ">",
  value: "",
  errorMessage: "",
  isActive: true,
};

const PAGE_SIZE = 8;

const ValidationRules = () => {
  const { openSidebar } = useOutletContext();
  const [rules, setRules] = useState(fallbackRules);
  const [datasets, setDatasets] = useState([]);
  const [columns, setColumns] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [datasetFilter, setDatasetFilter] = useState("All Datasets");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getRules().then(setRules).catch(() => { });
  }, []);

  useEffect(() => {
    getDatasets().then((data) => {
      setDatasets(data);
      if (data.length > 0) {
        setForm((f) => ({ ...f, dataset: data[0].name }));
      }
    });
  }, []);

  useEffect(() => {
    if (form.dataset) {
      getDatasetColumns(form.dataset).then(setColumns);
    }
  }, [form.dataset]);

  // When the chosen dataset changes, default the column to the first valid one for it.
  function handleDatasetChange(dataset) {
    setForm((f) => ({ ...f, dataset, column: "" }));
  }

  async function handleSave() {
    if (!form.ruleName.trim()) {
      setError("Please enter a rule name.");
      return;
    }
    if (!form.value && !NO_VALUE_OPERATORS.includes(form.operator)) {
      setError("Please enter a value for this rule.");
      return;
    }
    setError("");
    setSaving(true);
    const payload = {
      ...form,
      value: NO_VALUE_OPERATORS.includes(form.operator) ? "-" : form.value
    }
    try {
      if (editingId) {
        const updated = await updateRule(editingId, payload);
        setRules((rs) => rs.map((r) => (r.id === editingId ? updated : r)));
      } else {
        const created = await createRule(payload);
        setRules((rs) => [...rs, created]);
      }
      handleReset();
    } catch (err) {
      setError(err.message || "Something went wrong saving this rule.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(rule) {
    setEditingId(rule.id);
    setForm({
      ruleName: rule.ruleName || "",
      dataset: rule.dataset,
      column: rule.column,
      operator: rule.operator,
      value: rule.value === "-" ? "" : rule.value,
      errorMessage: rule.errorMessage || "",
      isActive: rule.isActive,
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this rule?")) return;
    try {
      await deleteRule(id);
      setRules((rs) => rs.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message || "Could not delete this rule.");
    }
  }

  function handleReset() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      const matchesDataset = datasetFilter === "All Datasets" || r.dataset === datasetFilter;
      const matchesSearch =
        !search ||
        r.column.toLowerCase().includes(search.toLowerCase()) ||
        r.dataset.toLowerCase().includes(search.toLowerCase());
      return matchesDataset && matchesSearch;
    });
  }, [rules, datasetFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRules.length / PAGE_SIZE));
  const pageRules = filteredRules.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <Topbar
        title="Validation Rules"
        subtitle="Create and manage validation rules for your datasets"
        onMenuClick={openSidebar}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Create / edit rule form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-5">
            {editingId ? "Edit Rule" : "Create New Rule"}
          </h2>

          <div className="space-y-4">
            <Field label="Rule Name">
              <input
                className="input"
                placeholder="Price must be positive"
                value={form.ruleName}
                onChange={(e) => setForm((f) => ({ ...f, ruleName: e.target.value }))}
              />
            </Field>

            <Field label="Dataset">
              <select
                className="input"
                value={form.dataset}
                onChange={(e) => handleDatasetChange(e.target.value)}
              >
                {datasets.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Column">
              <select
                className="input"
                value={form.column}
                onChange={(e) => setForm((f) => ({ ...f, column: e.target.value }))}
              >
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </Field>

            <Field label="Operator">
              <select
                className="input"
                value={form.operator}
                onChange={(e) => setForm((f) => ({ ...f, operator: e.target.value }))}
              >
                {operators.map((op) => (
                  <option key={op}>{op}</option>
                ))}
              </select>
            </Field>

            {!NO_VALUE_OPERATORS.includes(form.operator) && (
              <Field label="Value">
                <input
                  className="input"
                  placeholder="0"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                />
              </Field>
            )}

            <Field label="Error Message (Optional)">
              <input
                className="input"
                placeholder="Price must be greater than 0"
                value={form.errorMessage}
                onChange={(e) => setForm((f) => ({ ...f, errorMessage: e.target.value }))}
              />
            </Field>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-brand"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Enable Rule
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 border border-gray-200 text-slate-700 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-brand text-white rounded-xl py-2.5 text-sm font-medium hover:bg-brand-dark disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                {saving ? "Saving..." : editingId ? "Update Rule" : "Save Rule"}
              </button>
            </div>
          </div>
        </div>

        {/* Existing rules table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-lg font-bold text-slate-900">Existing Rules</h2>
            <div className="flex flex-col xs:flex-row gap-3">
              <select
                className="input sm:w-40"
                value={datasetFilter}
                onChange={(e) => {
                  setDatasetFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option>All Datasets</option>
                {datasets.map((d) => (
                  <option key={d.id}>{d.name}</option>
                ))}
              </select>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="input pl-9 sm:w-48"
                  placeholder="Search rules..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Table (scrolls horizontally on small screens) */}
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase border-b border-gray-100">
                  <th className="py-2 px-5 sm:px-2 font-medium">ID</th>
                  <th className="py-2 px-2 font-medium">Dataset</th>
                  <th className="py-2 px-2 font-medium">Column</th>
                  <th className="py-2 px-2 font-medium">Operator</th>
                  <th className="py-2 px-2 font-medium">Value</th>
                  <th className="py-2 px-2 font-medium">Status</th>
                  <th className="py-2 px-5 sm:px-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pageRules.map((rule) => (
                  <tr key={rule.id}>
                    <td className="py-3 px-5 sm:px-2 text-gray-400">{rule.id}</td>
                    <td className="py-3 px-2">
                      <Badge tone={datasetTone[rule.dataset] || "gray"}>{rule.dataset}</Badge>
                    </td>
                    <td className="py-3 px-2 text-slate-700">{rule.column}</td>
                    <td className="py-3 px-2 text-slate-700">{rule.operator}</td>
                    <td className="py-3 px-2 text-slate-700">{rule.value}</td>
                    <td className="py-3 px-2">
                      <Badge tone={rule.isActive ? "green" : "red"}>
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 px-5 sm:px-2">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleEdit(rule)} className="text-gray-400 hover:text-brand">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(rule.id)} className="text-gray-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRules.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No rules match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {pageRules.length} of {filteredRules.length} rules
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
              >
                &lsaquo;
              </button>
              <span className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center text-sm">
                {page}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
              >
                &rsaquo;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default ValidationRules