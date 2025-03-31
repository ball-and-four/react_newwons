'use client';

import { ChangeEventHandler, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

type BaseInputProps = {
  id?: string;
  type: string;
  value?: string | readonly string[] | number;
  title?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  accept?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

type InputProps = BaseInputProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseInputProps>;

function Input({
  id,
  accept,
  type,
  value,
  title,
  placeholder,
  disabled,
  className,
  onChange,
  ...rest
}: InputProps) {
  return (
    <InputField
      id={id}
      accept={accept}
      type={type}
      value={value}
      title={title}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      onChange={onChange}
      {...rest}
    />
  );
}

const InputField = styled.input`
  width: 100%;
  height: 44px;
  font-size: 15px;
  border-radius: 0.4px;
  padding-left: 10px;
  border: 1px solid #000000;
`;

export default Input;
