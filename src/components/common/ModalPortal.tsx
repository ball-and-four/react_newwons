import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: ReactNode;
}

const ModalPortal = ({ children }: ModalPortalProps) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let modalRoot = document.getElementById('modal-root');

    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }

    setContainer(modalRoot);
  }, []);

  if (!container) return null;

  return createPortal(children, container);
};

export default ModalPortal;
