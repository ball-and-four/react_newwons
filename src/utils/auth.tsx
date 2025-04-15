import { app } from '@/firebase';
import {
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

//로그인(구글)
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
export const googleAuth = () => {
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      signInWithPopup(auth, provider)
        .then((result) => {
          const name = result.user.displayName;
          alert(`${name}님! 안녕하세요!`);
          window.location.href = '/';
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

//로그아웃(구글)
export const logout = () => {
  signOut(auth)
    .then(() => {
      alert('또 오세요!');
      window.location.href = '/';
    })
    .catch((error) => {
      console.log(error);
    });
};

//로그인 여부 체크
export const isLoggedIn = () => {
  const user = auth.currentUser;
  if (!user) {
    return false;
  } else {
    return true;
  }
};

//로그인 상태 체크 후 사용자이름 가져오기
export const useUserInfo = ({ currentLoggedState }: { currentLoggedState: boolean }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [userName, setUserName] = useState('unknown');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogged(true);
        setUserName(user.displayName || 'unknown');
      } else {
        setIsLogged(false);
        setUserName('unknown');
      }
    });
    return () => unsubscribe();
  }, []);

  return { isLogged, userName, currentLoggedState };
};
