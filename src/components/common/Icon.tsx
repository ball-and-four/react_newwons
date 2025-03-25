import styled from 'styled-components';

interface IconProps {
  type: string;
}

const Icon = ({ type }: IconProps) => {
  return (
    <IconComponent>
      {type === 'write' && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 11V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V7C3 4.79086 4.79086 3 7 3H13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M17.9227 3.52798C18.2607 3.18992 18.7193 3 19.1973 3C19.6754 3 20.134 3.18992 20.472 3.52798C20.8101 3.86605 21 4.32456 21 4.80265C21 5.28075 20.8101 5.73926 20.472 6.07732L12.3991 14.1502L9 15L9.84978 11.6009L17.9227 3.52798Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 6L18 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {type === 'calendar' && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 8C3 5.79086 4.79086 4 7 4H17C19.2091 4 21 5.79086 21 8V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V8Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M8 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 17L16 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </IconComponent>
  );
};

const IconComponent = styled.div`
  display: flex;
`;

export default Icon;
