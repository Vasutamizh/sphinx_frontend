import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  UserPlus,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalHeaderText,
  ModalOverlay,
  ModalPanel,
  ModalSubtitle,
  ModalTitle,
} from "../styles/Modal.styles";

const TYPE_ICONS = {
  info: <Info size={20} aria-hidden="true" />,
  success: <CheckCircle size={20} aria-hidden="true" />,
  warning: <AlertTriangle size={20} aria-hidden="true" />,
  danger: <AlertCircle size={20} aria-hidden="true" />,
  loading: <Loader2 size={20} className="modal-spinner" aria-hidden="true" />,
  create: <UserPlus size={20} aria-hidden="true" />,
};

export default function Modal({
  isOpen = false,
  size,
  onClose,
  children,
  title,
  subtitle,
  footer,
  type,
  icon,
  closeOnOverlay = true,
  showCloseButton = true,
}) {
  const panelRef = useRef(null);

  const [exiting, setExiting] = useState(false);
  const exitTimerRef = useRef(null);

  const handleClose = useCallback(() => {
    if (!onClose || exiting) return;
    setExiting(true);
    exitTimerRef.current = setTimeout(() => {
      setExiting(false);
      onClose();
    }, 180); // Matches CSS animation duration
  }, [onClose, exiting]);

  useEffect(() => () => clearTimeout(exitTimerRef.current), []);

  if (!isOpen) return null;

  const resolvedIcon = icon ?? (type ? TYPE_ICONS[type] : null);

  function handleOverlayClick(e) {
    if (closeOnOverlay && e.target === e.currentTarget) {
      handleClose();
    }
  }

  const modalContent = (
    <ModalOverlay
      onClick={handleOverlayClick}
      onWheel={(e) => e.stopPropagation()}
    >
      <ModalPanel
        $size={size}
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || subtitle || resolvedIcon || showCloseButton) && (
          <ModalHeader>
            {resolvedIcon && (
              <div className={`modal-icon-wrap${type ? ` type-${type}` : ""}`}>
                {resolvedIcon}
              </div>
            )}

            {(title || subtitle) && (
              <ModalHeaderText>
                {title && <ModalTitle>{title}</ModalTitle>}
                {subtitle && <ModalSubtitle>{subtitle}</ModalSubtitle>}
              </ModalHeaderText>
            )}

            {showCloseButton && (
              <ModalCloseButton
                onClick={handleClose}
                aria-label="Close modal"
                tabIndex={0}
              >
                <X size={16} strokeWidth={2.2} aria-hidden="true" />
              </ModalCloseButton>
            )}
          </ModalHeader>
        )}

        <ModalBody>{children}</ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalPanel>
    </ModalOverlay>
  );

  return createPortal(modalContent, document.body);
}
