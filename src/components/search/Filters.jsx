import styles from "./Filters.module.css";

const DURATION_OPTIONS = [
  { value: "", label: "Cualquier duración" },
  { value: "short", label: "Corta (< 4 min)" },
  { value: "medium", label: "Media (4–20 min)" },
  { value: "long", label: "Larga (> 20 min)" },
];

const DATE_OPTIONS = [
  { value: "", label: "Cualquier fecha" },
  { value: "hour", label: "Última hora" },
  { value: "day", label: "Hoy" },
  { value: "week", label: "Esta semana" },
  { value: "month", label: "Este mes" },
  { value: "year", label: "Este año" },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "date", label: "Más recientes" },
];

function Field({ label, value, options, onChange, disabled }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <select
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Filters({ filters, onChange, disabled }) {
  const update = (patch) => onChange({ ...filters, ...patch });
  return (
    <div className={styles.filters}>
      <Field
        label="Duración"
        value={filters.duration}
        options={DURATION_OPTIONS}
        onChange={(v) => update({ duration: v })}
        disabled={disabled}
      />
      <Field
        label="Fecha"
        value={filters.date}
        options={DATE_OPTIONS}
        onChange={(v) => update({ date: v })}
        disabled={disabled}
      />
      <Field
        label="Ordenar"
        value={filters.sort}
        options={SORT_OPTIONS}
        onChange={(v) => update({ sort: v })}
        disabled={disabled}
      />
    </div>
  );
}

export default Filters;
