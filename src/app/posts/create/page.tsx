'use client';
import Input from '@/components/common/Input';
import PostInfoGroup from '@/components/feature/PostInfoGroup';
import { db, storage } from '@/firebase';
import { isLoggedIn, useUserInfo } from '@/utils/auth';
import { getCurrentTime } from '@/utils/date';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './page.module.css';

const Create = () => {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  // 현재 로그인 상태 체크 후 username 가져오기
  const currentLoggedState = isLoggedIn();
  const { isLogged, userName } = useUserInfo({ currentLoggedState }) || {
    isLogged: false,
    userName: '',
  };

  // 포스트 타이틀 상태 관리
  const [postTitle, setPostTitle] = useState('');
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPostTitle(e.target.value);

  // 포스트 컨텐츠 상태 관리
  const [postContent, setPostContent] = useState('');
  const handleChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setPostContent(e.target.value);

  // 포스트 업로드 파일 상태 관리
  const [attachment, setAttachment] = useState('');

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;

    const theFile = files[0];
    const reader = new FileReader();

    if (theFile.size > 512000) {
      alert('500KB 이하로 업로드해주세요. 무료할당끝나면 유료라..😂(카드연결되어있음)');
      return;
    } else {
      alert('첨부완료!');
    }

    reader.onloadend = (finishedEvent) => {
      if (finishedEvent.target && finishedEvent.target.result) {
        setAttachment(finishedEvent.target.result as string);
      } else {
        console.error('FileReader result is null');
      }
    };

    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => setAttachment('');

  // 데이터 포스트
  async function handleClickCreatePosts() {
    try {
      if (!postTitle || !postContent) {
        throw new Error('제목과 내용을 입력해야 합니다.');
      }
      if (!isLogged) {
        alert('로그인 후에만 작성이 가능합니다.');
        return;
      }

      let attachmentUrl = '';
      if (user && attachment !== '') {
        const attachmentRef = ref(storage, `${user.uid}/${uuidv4()}`);
        const response = await uploadString(attachmentRef, attachment, 'data_url');
        attachmentUrl = await getDownloadURL(response.ref);
      }

      // 이미지 URL이 업로드된 후 Firestore에 저장
      const docRef = await addDoc(collection(db, 'newwons'), {
        postTitle,
        postContent,
        postFile: attachmentUrl,
        author: userName,
        timestamp: serverTimestamp(),
        postId: user?.uid || '',
      });

      alert('등록되었습니다.');
      router.push(`/posts/${docRef.id}`);
    } catch (error) {
      alert(`오류 발생: ${error}`);
      console.error(error);
    }
  }

  return (
    <div className={styles.createPostForm}>
      <PostInfoGroup
        title="Write"
        category="category"
        author={userName}
        timestamp={`${getCurrentTime()}`}
        href=""
      />

      <div className={styles.formArea}>
        <Input type="text" value={postTitle} onChange={handleChangeInput} />
        <textarea
          rows={30}
          value={postContent}
          onChange={handleChangeTextarea}
          className={styles.textArea}
        />

        <div className={styles.fileBox}>
          <Input
            type="file"
            id="attach-file"
            accept="image/*"
            onChange={onFileChange}
            className={styles.blind}
          />
          <input
            type="text"
            style={{ width: '100%', padding: '0 16px' }}
            defaultValue={attachment}
            placeholder="첨부파일"
          />
          <label htmlFor="attach-file" className={styles.fileButton}>
            파일 선택
          </label>
        </div>
        {attachment && (
          <div className={styles.preview}>
            <Image src={attachment} alt="PostImg" width={500} height={300} />
            <div onClick={onClearAttachment} className={styles.removeButton}>
              <span>Remove</span>
            </div>
          </div>
        )}

        <br></br>

        <button onClick={handleClickCreatePosts}>작성하기 임시버튼</button>
        <br />
        {/* <Button /> */}
      </div>
    </div>
  );
};

export default Create;
