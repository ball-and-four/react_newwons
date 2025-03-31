'use client';

import defaultImg from '@/assets/images/defaultThumbnail.jpg';
import { PostCardProps } from '@/types/post';
import Image from 'next/image';
import styled from 'styled-components';

export const PostCard = ({
  param = '',
  thumbnail = `${defaultImg}`,
  postTitle = 'Post Title',
  author = 'Author',
  // category = 'Category',
  timestamp = 'a min ago',
  postContent = '',
}: PostCardProps) => {
  return (
    <PostCardContainer>
      <Thumbnail href={'/posts/' + param}>
        <Image src={thumbnail} alt="thumbnail" width={400} height={238} />
      </Thumbnail>

      <PostInfo>
        <TitleArea>
          <TitleContent>
            <a href={'/posts/' + param} className="title">
              {postTitle}
            </a>
          </TitleContent>
        </TitleArea>

        <Content href={'/posts/' + param}>{postContent}</Content>
        <Meta>
          <div className="author">{author}</div>
          <div className="timeStamp">{timestamp}</div>
        </Meta>
      </PostInfo>
    </PostCardContainer>
  );
};

const truncateText = `
  text-overflow: ellipsis;
  overflow: hidden;
`;

const PostCardContainer = styled.article`
  position: relative;
  width: 400px;
  height: 440px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;

  &:hover {
    opacity: 0.85;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
`;

const Thumbnail = styled.a`
  img {
    display: block;
    box-shadow: 1px solid var(--foreground-rgb) inset;
    border-radius: 8px 8px 0 0;
    object-fit: cover;
  }
`;

const PostInfo = styled.div`
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
`;

const TitleArea = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  color: var(--color-gray-02);

  .title {
    display: block;
    width: 350px;
    font-size: 22px;
    font-weight: bold;
    line-height: 180%;
    ${truncateText}
    white-space: nowrap;
  }
`;

const TitleContent = styled.div`
  flex: 1;
  margin-right: 1rem;
`;

const Meta = styled.div`
  padding-top: 16px;
  width: 100%;
  display: flex;
  gap: 1rem;
  font-size: 14px;

  .author {
    color: var(--color-blue);
  }

  .timeStamp {
    color: var(--color-gray-04);
  }
`;

const Content = styled.a`
  padding-top: 16px;
  width: 100%;
  height: 100%;
  vertical-align: top;
  font-size: 16px;
  line-height: 140%;
  color: var(--color-gray-04);
  ${truncateText}
  display: -webkit-box !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  white-space: normal;
`;
