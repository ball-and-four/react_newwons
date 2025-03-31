'use client';
import Logo from '@/components/common/Logo';
import styled from 'styled-components';

const FooterBox = styled.div`
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 50px 120px;
  background: #000;
  opacity: 0.8;
`;

// const CorpList = styled.ul`
//   list-style: none;
//   display: flex;
//   gap: 55px;
// `;

// const Item = styled.li`
//   list-style: none;
//   font-size: 15px;
//   font-weight: 500;
//   color: #fff;

//   a:hover {
//     text-decoration: underline;
//   }
// `;

const CopyRight = styled.p`
  display: inline-block;
  text-align: right;
  font-size: 15px;
  font-weight: 400;
  color: #fff;
`;

const Footer = () => {
  return (
    <FooterBox>
      <Logo color="white" />
      {/* <CorpList>
        <Item>
          <Link href={'#none'}>Additional Link</Link>
        </Item>
        <Item>
          <Link href={'#none'}>Additional Link</Link>
        </Item>
        <Item>
          <Link href={'#none'}>Additional Link</Link>
        </Item>
      </CorpList> */}

      <CopyRight>©JOJOSONBITNA. All Rights Reserved</CopyRight>
    </FooterBox>
  );
};

export default Footer;
