import { default as BootstrapModal } from "react-bootstrap/Modal";
function Modal({ show, onClose, title, content, footer }) {
  return (
    <BootstrapModal
      show={show}
      size="lg"
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      aria-labelledby="contained-BootstrapModal-title-vcenter"
      centered
    >
      <BootstrapModal.Header>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>{content}</BootstrapModal.Body>
      <BootstrapModal.Footer>{footer}</BootstrapModal.Footer>
    </BootstrapModal>
  );
}

export default Modal;
