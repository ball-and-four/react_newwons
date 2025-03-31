'use client';

import React from 'react';
import styled from 'styled-components';
import ModalPortal from './ModalPortal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <DimmedField className={isOpen ? 'show' : ''} onClick={onClose}>
        {' '}
        {/* ✅ 바깥 클릭하면 닫힘 */}
        <ModalField
          className={isOpen ? 'show' : ''}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {children}
        </ModalField>
      </DimmedField>
    </ModalPortal>
  );
};

const DimmedField = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  opacity: 0;
  z-index: 1;
  transition:
    opacity 0.3s ease-in-out,
    background 0.3s ease-in-out;

  &.show {
    opacity: 1;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const ModalField = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  width: 400px;
  background: white;
  border-radius: 4%;
  opacity: 0;
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;

  &.show {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

export default Modal;
