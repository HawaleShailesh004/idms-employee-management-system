import './ToastContainer.css';

const ToastContainer = ({ toasts, onClose }) => (
  <div className="toast-container" aria-live="polite">
    {toasts.map((toast) => (
      <div key={toast.id} className={`toast toast--${toast.type}`}>
        <span>{toast.message}</span>
        <button type="button" className="toast__close" onClick={() => onClose(toast.id)}>
          ×
        </button>
      </div>
    ))}
  </div>
);

export default ToastContainer;
