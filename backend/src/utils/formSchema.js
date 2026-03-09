const allowedTypes = new Set(["text", "textarea", "number", "select", "checkbox"]);

export function normalizeSchema(schema) {
  if (!Array.isArray(schema)) return [];

  return schema
    .filter((f) => f && typeof f === "object")
    .map((f) => ({
      key: String(f.key || f.name || "").trim(),
      label: String(f.label || f.key || f.name || "").trim(),
      type: allowedTypes.has(String(f.type)) ? String(f.type) : "text",
      required: Boolean(f.required),
      options: Array.isArray(f.options)
        ? f.options.map((o) => String(o)).filter(Boolean)
        : undefined,
    }))
    .filter((f) => f.key.length > 0);
}

export function validateFormData(schema, data) {
  const normalized = normalizeSchema(schema);
  const values = data && typeof data === "object" ? data : {};
  const errors = {};

  for (const field of normalized) {
    const v = values[field.key];

    if (field.required) {
      const empty =
        v === undefined ||
        v === null ||
        (typeof v === "string" && v.trim() === "") ||
        (field.type === "checkbox" && v !== true);

      if (empty) {
        errors[field.key] = `${field.label || field.key} is required`;
        continue;
      }
    }

    if (v === undefined || v === null || v === "") continue;

    if (field.type === "number" && Number.isNaN(Number(v))) {
      errors[field.key] = `${field.label || field.key} must be a number`;
      continue;
    }

    if (field.type === "select" && field.options?.length) {
      if (!field.options.includes(String(v))) {
        errors[field.key] = `${field.label || field.key} must be a valid option`;
        continue;
      }
    }

    if (field.type === "checkbox" && typeof v !== "boolean") {
      errors[field.key] = `${field.label || field.key} must be true/false`;
      continue;
    }
  }

  return { ok: Object.keys(errors).length === 0, errors, normalized };
}

