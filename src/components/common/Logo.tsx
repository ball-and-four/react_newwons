import Link from 'next/link';
import styled from 'styled-components';

interface LogoProps {
  color?: string; // color 프롭스를 선택적으로 변경
}

const Logo = ({ color = 'black' }: LogoProps) => {
  return (
    <LogoComponent>
      <Link href="/" passHref>
        <StyledText color={color}>
          JOJO,
          <br />
          SONBITNA
        </StyledText>
      </Link>
    </LogoComponent>
  );
};

const LogoComponent = styled.div`
  display: inline-block;
  font-size: 20px;
  font-weight: bold;
  line-height: 22px;
`;

const StyledText = styled.span<{ color: string }>`
  color: ${(props) => props.color}; // color가 없을 경우, 기본값이 'black'이므로 그대로 사용
  text-decoration: none;
`;

export default Logo;
