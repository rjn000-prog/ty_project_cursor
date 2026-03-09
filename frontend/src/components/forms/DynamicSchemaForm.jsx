import { useMemo } from "react";
import "./dynamicSchemaForm.css";

const TYPE_OPTIONS = ["text", "textarea", "number", "select", "checkbox"];

export default function DynamicSchemaForm({
  schema,
  values,
  onChange,
  disabled,
  submitLabel = "Submit",
  onSubmit,
  title,
  subtitle,
  hideSubmit = false,
}) {
  const normalized = useMemo(() => Array.isArray(schema) ? schema : [], [schema]);

  return (
    <form className="dsf" onSubmit={onSubmit}>
      {(title || subtitle) && (
        <div className="dsf-header">
          {title && <h3>{title}</h3>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}

      {normalized.length === 0 ? (
        <div className="dsf-empty">No extra form fields.</div>
      ) : (
        <div className="dsf-grid">
          {normalized.map((f) => {
            const key = f.key || f.name;
            const label = f.label || key;
            const type = f.type || "text";
            const required = Boolean(f.required);
            const v = values?.[key];

            if (!key) return null;

            if (type === "textarea") {
              return (
                <label key={key} className="dsf-field dsf-field--full">
                  <span>
                    {label} {required ? <b>*</b> : null}
                  </span>
                  <textarea
                    value={typeof v === "string" ? v : v ?? ""}
                    onChange={(e) => onChange(key, e.target.value)}
                    disabled={disabled}
                    required={required}
                  />
                </label>
              );
            }

            if (type === "select") {
              const options = Array.isArray(f.options) ? f.options : [];
              return (
                <label key={key} className="dsf-field">
                  <span>
                    {label} {required ? <b>*</b> : null}
                  </span>
                  <select
                    value={typeof v === "string" ? v : v ?? ""}
                    onChange={(e) => onChange(key, e.target.value)}
                    disabled={disabled}
                    required={required}
                  >
                    <option value="">Select</option>
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            if (type === "checkbox") {
              return (
                <label key={key} className="dsf-field dsf-field--checkbox">
                  <input
                    type="checkbox"
                    checked={Boolean(v)}
                    onChange={(e) => onChange(key, e.target.checked)}
                    disabled={disabled}
                  />
                  <span>
                    {label} {required ? <b>*</b> : null}
                  </span>
                </label>
              );
            }

            return (
              <label key={key} className="dsf-field">
                <span>
                  {label} {required ? <b>*</b> : null}
                </span>
                <input
                  type={type === "number" ? "number" : "text"}
                  value={typeof v === "string" || typeof v === "number" ? v : v ?? ""}
                  onChange={(e) => onChange(key, e.target.value)}
                  disabled={disabled}
                  required={required}
                />
              </label>
            );
          })}
        </div>
      )}

      {!hideSubmit && (
        <div className="dsf-actions">
          <button type="submit" className="dsf-submit" disabled={disabled}>
            {submitLabel}
          </button>
        </div>
      )}
    </form>
  );
}

export function SchemaBuilder({ schema, setSchema, disabled }) {
  const rows = Array.isArray(schema) ? schema : [];

  const addRow = () => {
    setSchema([
      ...rows,
      { key: `field_${rows.length + 1}`, label: "New field", type: "text", required: false, options: [] },
    ]);
  };

  const removeRow = (idx) => {
    setSchema(rows.filter((_, i) => i !== idx));
  };

  const updateRow = (idx, patch) => {
    setSchema(rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  return (
    <div className="sb">
      <div className="sb-header">
        <div>
          <h3>Form builder</h3>
          <p>Choose which fields students must fill.</p>
        </div>
        <button type="button" className="sb-add" onClick={addRow} disabled={disabled}>
          Add field
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="sb-empty">No fields yet. Add one.</div>
      ) : (
        <div className="sb-table">
          {rows.map((r, idx) => (
            <div key={idx} className="sb-row">
              <input
                className="sb-input"
                value={r.key || ""}
                onChange={(e) => updateRow(idx, { key: e.target.value })}
                placeholder="key (unique)"
                disabled={disabled}
              />
              <input
                className="sb-input"
                value={r.label || ""}
                onChange={(e) => updateRow(idx, { label: e.target.value })}
                placeholder="label"
                disabled={disabled}
              />
              <select
                className="sb-input"
                value={r.type || "text"}
                onChange={(e) => updateRow(idx, { type: e.target.value })}
                disabled={disabled}
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <label className="sb-required">
                <input
                  type="checkbox"
                  checked={Boolean(r.required)}
                  onChange={(e) => updateRow(idx, { required: e.target.checked })}
                  disabled={disabled}
                />
                Required
              </label>
              <input
                className="sb-input sb-input--options"
                value={Array.isArray(r.options) ? r.options.join(", ") : ""}
                onChange={(e) =>
                  updateRow(idx, {
                    options: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="options (for select): a, b, c"
                disabled={disabled || (r.type !== "select")}
              />
              <button
                type="button"
                className="sb-remove"
                onClick={() => removeRow(idx)}
                disabled={disabled}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

