'use client';
import lottieJson from '@/assets/lotties/lottieLogo.json';
import { app } from '@/firebase';
import { isLoggedIn, logout, useUserInfo } from '@/utils/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Icon from '../common/Icon';

const HeaderBox = styled.div`
  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 11px 80px;
  background: #fff;
  z-index: 10;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
`;

const List = styled.ul`
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
`;

const Item = styled.li`
  font-size: 15px;
  font-weight: 500;
  color: var(--color-gray-04);
  display: flex;

  a {
    display: flex;
    gap: 4px;
    align-items: center;

    &:hover {
      color: var(--color-gray-01);
    }
  }
`;

const Profile = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  margin-right: 8px;
`;

const Header = () => {
  const [userProfile, setUserProfile] = useState('');
  const currentLoggedState = isLoggedIn();
  const { isLogged = false, userName } = useUserInfo({ currentLoggedState });
  const router = useRouter();
  const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // setUserProfile(`${user.displayName}`);
        setUserProfile(`${user.photoURL}`);
      } else {
        setUserProfile('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleClickLogout = () => {
    if (isLogged) {
      logout();
      router.push('/');
    } else {
    }
  };
  return (
    //로그인 안했을때 아무것도 없음.
    //로그인 했을때 헤더 노출 + 로그아웃 버튼
    <HeaderBox>
      {/* <Logo /> */}
      {/* 로고애니 테스트 */}
      <LottiePlayer loop animationData={lottieJson} play />
      {isLogged ? (
        <div style={{ display: 'flex', gap: '24px' }}>
          <Nav>
            <List>
              <Item>
                <Link href={'/posts/create'}>
                  <Icon type="write" />
                  Write
                </Link>
              </Item>
              <Item>
                <Link href={'/calendar'}>
                  <Icon type="calendar" />
                  Calendar
                </Link>
              </Item>

              <Item>
                <Link href={''} onClick={handleClickLogout}>
                  Logout
                </Link>
                {/* <button onClick={handleClickLogout}>Logout</button> */}
              </Item>
              <Item>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Profile src={userProfile} alt={`${userName} profile image`} />
                </div>
              </Item>
            </List>
          </Nav>
        </div>
      ) : null}
    </HeaderBox>
  );
};

export default Header;
