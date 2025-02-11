'use client';

import PostInfoGroup from '@/components/feature/PostInfoGroup';
import { db } from '@/firebase';
import { Post } from '@/types/post';
import { isLoggedIn, useUserInfo } from '@/utils/auth';
import { convertTimestamp } from '@/utils/date';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

const Detail = () => {
  const [postData, setPostData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  const currentLoggedState = isLoggedIn();
  const { userName } = useUserInfo({ currentLoggedState });

  useEffect(() => {
    const fetchPost = async () => {
      if (!params.id) return;

      try {
        setLoading(true);

        const docRef = doc(db, 'newwons', `${params.id}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          const formattedData = {
            ...data,
            timestamp: convertTimestamp(data.timestamp) || '',
          } as Post;

          setPostData(formattedData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  if (loading)
    return (
      <div
        className={styles.postContainer}
        style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}
      >
        로딩중...🔍
      </div>
    );
  if (!postData)
    return (
      <div
        className={styles.postContainer}
        style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}
      >
        포스트를 찾을 수 없습니다. 🙈
      </div>
    );

  //NOTICE
  //컬렉션명 : newwons
  //await는 async와 사용해야합니다.

  //TODO
  //삭제할건지 확인: 확인 -> 삭제 -> 삭제 완료 알럿 -> 이후 리스트 페이지 이동
  //             삭제 확인을 요청하고 삭제 후 리스트 페이지로 이동 하는게 나을것 같음
  //삭제할건지 확인: 취소 -> 함수 실행 취소 (함수탈추)
  //해당문서번호 파라미터
  //handleClickDelete:삭제 버튼을 클릭했을 때 실행되는 함수
  const handleClickDelete = async () => {
    if (!params.id) return;

    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return; // 사용자가 취소를 누르면 함수 종료

    try {
      //doc() 함수는 Firestore에서 특정 문서를 참조하기 위한 함수
      //db: Firestore 인스턴스
      //'newwons': 컬렉션 이름입니다. 즉, 이 컬렉션 안에서 문서를 찾습니다.
      const docRef = doc(db, 'newwons', String(params.id)); // params.id를 명확히 string으로 변환 후, 해당 문서의 ID를 사용하여 문서 참조를 생성합니다. docRef -> 삭제할 문서에 대한 참조를 저장

      //deleteDoc() 함수는 Firestore에서 문서를 삭제하는 함수, docRef는 삭제할 문서의 참조
      //await을 사용하여 비동기적으로 삭제 작업이 완료될 때까지 기다립니다. 삭제가 완료되면 다음 코드 (alert) 실행
      await deleteDoc(docRef);
      alert('삭제가 완료되었습니다.');
      router.push('/'); //삭제 후, 사용자를 홈페이지(/)로 이동
    } catch (error) {
      //만약 삭제 과정에서 오류가 발생하면
      console.error('삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };
  return (
    <div className={styles.postContainer}>
      <PostInfoGroup
        title={postData.postTitle}
        category="category"
        author={postData.author}
        timestamp={postData.timestamp}
        href={`${params.id}`}
      />

      {postData.postFile && (
        <Image
          src={`${postData.postFile}`}
          width="500"
          height="300"
          style={{ width: '100%', maxWidth: '500px', height: 'auto', textAlign: 'center' }}
          alt="PostImg"
        />
      )}

      <div className={styles.postContent}>{postData.postContent}</div>

      <button
        onClick={() => {
          router.push(`/`);
        }}
      >
        몽록으로 가기
      </button>
      {/* 작성자가 맞으면 수정하기 삭제하기 노출*/}
      {userName === postData?.author ? (
        <>
          <button
            onClick={() => {
              router.push(`${params.id}/edit`);
            }}
          >
            수정하하기
          </button>
          <button onClick={handleClickDelete}>삭제하기</button>
        </>
      ) : null}
    </div>
  );
};

export default Detail;
