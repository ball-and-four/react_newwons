'use client';
import defaultImg from '@/assets/images/defaultThumbnail.jpg';
import { db } from '@/firebase';
import { PostCardProps } from '@/types/post';
import { convertTimestamp } from '@/utils/date';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PostCard } from './PostCard';

export const PostCardList = () => {
  const [docList, setDocList] = useState<PostCardProps[]>([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'newwons'));
        const posts: PostCardProps[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(doc.data());
          posts.push({
            param: doc.id,
            postTitle: data.postTitle,
            postContent: data.postContent,
            author: data.author,
            thumbnail: data.postFile || defaultImg,
            timestamp: convertTimestamp(data.timestamp),
            category: data.category,
          });
        });

        setDocList(posts);
      } catch (error) {
        alert(`${error}:게시글을 가져오는 데 문제가 발생했습니다.`);
      }
    };

    fetchPosts();
  }, []);
  return (
    <ListContainer>
      {docList.map((post) => (
        <li key={post.param}>
          <PostCard
            param={post.param}
            author={post.author}
            category={post.category}
            timestamp={post.timestamp}
            thumbnail={post.thumbnail}
            postTitle={post.postTitle}
            postContent={post.postContent}
          />
        </li>
      ))}
    </ListContainer>
  );
};

const ListContainer = styled.ul`
  list-style: none;
  width: 100%;
  max-width: var(--max-width);
  margin: 140px auto;
  padding: 0 0 80px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  gap: 2rem;
  flex: 1;
  justify-content: center;
`;
