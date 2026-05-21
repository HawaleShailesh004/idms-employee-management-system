import './Input.css';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  autoComplete,
}) => (
  <div className={`field ${error ? 'field--error' : ''}`}>
    {label && (
      <label className="field__label" htmlFor={name}>
        {label}
        {required && <span className="field__required">*</span>}
      </label>
    )}
    <input
      id={name}
      name={name}
      type={type}
      className="field__input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
    />
    {error && <span className="field__error">{error}</span>}
  </div>
);

export default Input;
