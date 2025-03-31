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
  //삭제할건지 확인: 삭제 확인을 요청-> 삭제 후 확인 alert -> 리스트 페이지로 이동
  //삭제할건지 확인: 취소 -> 함수 실행 취소 (함수탈추)
  //해당문서번호 파라미터
  const handleClickDelete = async () => {
    if (!params.id) return;

    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const docRef = doc(db, `newwons/${params.id}`);

      await deleteDoc(docRef);
      alert('삭제가 완료되었습니다.');
      router.push('/');
    } catch (error) {
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
          style={{
            width: '100%',
            maxWidth: '500px',
            height: 'auto',
            textAlign: 'center',
            marginTop: '56px',
          }}
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
