'use client';

import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalPortal from './ModalPortal';

const Modal = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setModalVisible(user == null); // user가 null 또는 undefined면 true
    }
  }, [user, isLoading]);

  const handleClose = () => {
    if (!user) return; // 비로그인 상태에서는 모달을 닫지 않음
    setModalVisible(false);
  };

  if (!modalVisible) return null; // 모달이 보이지 않으면 렌더링하지 않음

  return (
    <ModalPortal>
      <DimmedField className={modalVisible ? 'show' : ''} onClick={handleClose}>
        <ModalField
          className={modalVisible ? 'show' : ''}
          onClick={(e: React.SyntheticEvent) => e.stopPropagation()}
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
  height: 400px;
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
