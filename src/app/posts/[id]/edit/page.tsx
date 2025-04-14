'use client';
import { Button } from '@/components/common/Button';
import Input from '@/components/common/Input';
import PostInfoGroup from '@/components/feature/PostInfoGroup';
import { db, storage } from '@/firebase';
import { getCurrentTime } from '@/utils/date';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadString } from 'firebase/storage';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../../../contexts/AuthContext';
import styles from './page.module.css';

const Update = () => {
  const params = useParams();
  const { user } = useAuth();
  const router = useRouter();

  // 상태 관리
  const [author, setAuthor] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [attachment, setAttachment] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (!params.id) return;
      const docRef = doc(db, 'newwons', `${params.id}`);

      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPostTitle(data.postTitle || '');
          setPostContent(data.postContent || '');
          setAttachment(data.postFile || '');
          setAuthor(data.author || '');
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [params.id]);

  // 입력 핸들러
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostTitle(e.target.value);
  };

  const handleChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  // 파일 업로드
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;

    const theFile = files[0];
    if (theFile.size > 512000) {
      alert('500KB 이하로 업로드해주세요.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      if (finishedEvent.target?.result) {
        setAttachment(finishedEvent.target.result as string);
        alert('첨부 완료!');
      }
    };
    reader.readAsDataURL(theFile);
  };

  // 파일 삭제
  const onClearAttachment = async () => {
    if (!attachment.startsWith('https://')) {
      setAttachment('');
      return;
    }

    try {
      const desertRef = ref(storage, attachment);
      await deleteObject(desertRef);
      setAttachment('');
    } catch (error) {
      console.error('파일 삭제 오류:', error);
    }
  };

  // 게시글 업데이트
  async function handleClickUpdatePosts() {
    if (!postTitle || !postContent) {
      alert('제목과 내용을 입력해야 합니다.');
      return;
    }

    if (!user) {
      alert('로그인 후에만 수정이 가능합니다.');
      return;
    }

    try {
      const docRef = doc(db, 'newwons', `${params.id}`);

      let attachmentUrl = attachment;
      if (attachment && !attachment.startsWith('https://')) {
        const attachmentRef = ref(storage, `${user.uid}/${uuidv4()}`);
        await uploadString(attachmentRef, attachment, 'data_url');
        attachmentUrl = await getDownloadURL(attachmentRef);
      }

      await updateDoc(docRef, {
        postTitle,
        postContent,
        postFile: attachmentUrl,
        author,
        timestamp: serverTimestamp(),
      });

      alert('수정되었습니다.');
      router.push(`/posts/${params.id}`);
    } catch (error) {
      console.error(error);
      alert('수정 중 오류가 발생했습니다.');
    }
  }

  return (
    <div className={styles.createPostForm}>
      <PostInfoGroup
        title="Edit"
        category="category"
        author={author}
        timestamp={getCurrentTime()}
        href=""
        profile={`${user?.photoURL}`}
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
            style={{ width: '100%' }}
            value={attachment}
            placeholder="첨부파일"
            readOnly
          />
          <label htmlFor="attach-file" className={styles.fileButton}>
            파일 선택
          </label>
        </div>

        {attachment && (
          <div className={styles.preview}>
            <Image src={attachment} alt="PostImg" layout="intrinsic" width={500} height={300} />
            <div onClick={onClearAttachment} className={styles.removeButton}>
              <span>Remove</span>
            </div>
          </div>
        )}
      </div>

      <button onClick={handleClickUpdatePosts}>수정하기</button>
      <br />
      <Button />
    </div>
  );
};

export default Update;
