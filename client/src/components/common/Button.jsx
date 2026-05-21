import './Button.css';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  onClick,
  form,
}) => (
  <button
    type={type}
    form={form}
    className={`btn btn--${variant} ${className}`.trim()}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
