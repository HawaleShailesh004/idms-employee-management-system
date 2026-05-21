import './Select.css';

const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select',
  error,
  required = false,
}) => (
  <div className={`field select-field ${error ? 'field--error' : ''}`}>
    {label && (
      <label className="field__label" htmlFor={name}>
        {label}
        {required && <span className="field__required">*</span>}
      </label>
    )}
    <div className="select-field__wrap">
      <select
        id={name}
        name={name}
        className="select-field__select"
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <img src="/assets/dropdown-custom.svg" alt="" className="select-field__icon" aria-hidden />
    </div>
    {error && <span className="field__error">{error}</span>}
  </div>
);

export default Select;
