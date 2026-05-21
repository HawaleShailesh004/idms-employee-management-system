import { useEffect } from 'react';
import './Modal.css';

const CloseIcon = () => (
  <svg viewBox="1125 212 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M1132.5,219.2l4.6-5.7h-2l-2,2.5c-.3.3-.5.6-.7.9s-.3.5-.5.7-.3.5-.5.7c-.2-.3-.3-.5-.5-.7s-.3-.4-.5-.7-.4-.5-.7-.9l-2-2.5h-2l4.6,5.8-4.9,6.1h2l2.4-3c.3-.4.6-.8.8-1.1s.4-.6.7-1c.2.4.4.7.7,1s.5.6.8,1.1l2.4,3h2l-4.9-6.1h.2Z" />
  </svg>
);

const Modal = ({ isOpen, onClose, title, children, footer, variant }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalClass =
    variant === 'employee' ? 'modal modal--employee' : 'modal';

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className={modalClass}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="modal__header">
          <h2 id="modal-title" className="modal__title">
            {title}
          </h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>
  );
};

export default Modal;
