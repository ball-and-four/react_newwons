'use client';
import { PostInfoProps } from '@/types/post';
import Link from 'next/link';
import styled from 'styled-components';

const PostBreadCrumb = styled.ul`
  list-style-type: none;
  display: flex;
  margin: 0;
  padding: 0;

  li {
    padding: 0;
    font-size: 15px;
    color: rgba(0, 0, 0, 0.5);

    &:after {
      display: inline-block;
      content: '/';
      padding: 0 10px;
      color: rgba(0, 0, 0, 0.5);
    }

    &:last-child:after {
      display: none;
    }
    &.lightBlue {
      color: #6de4ea;
    }

    &.blue {
      color: #18a0fb;
    }
  }
`;

const PostTitle = styled.h3`
  font-size: 42px;
  padding: 12px 0 20px;
`;

const PostInfo = styled.ul`
  list-style-type: none;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;

  li {
    height: 100%;
    line-height: 100%;
    font-size: 15px;
    color: rgba(0, 0, 0, 0.5);

    &:first-child {
      padding-bottom: 6px;
    }

    &.lightBlue {
      color: var(--color-lightBlue);
    }

    &.blue {
      color: var(--color-blue);
    }

    &:last-child {
      border-right: none;
    }
    .author {
      font-size: 16px;
    }
  }
`;

const Profile = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-right: 16px;
`;

export const PostInfoGroup = ({ title, author, category, timestamp, href }: PostInfoProps) => {
  return (
    <>
      <PostBreadCrumb>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href={`${href}`}>Post Detail</Link>
        </li>
      </PostBreadCrumb>
      <PostTitle>{title}</PostTitle>
      <PostInfo>
        {/* 임시 이미지 : 프로필 이미지로 대체 가능할지? */}
        <Profile
          src={
            'https://image.zeta-ai.io/profile-image/fe8ae560-00e3-41d0-82c1-ac1248170f7c/32528a76-014f-489d-9883-c70763fef4fb.jpeg?w=828&q=90&f=webp'
          }
        />
        <div>
          <li className="blue author">{author}</li>
          <li>{`${timestamp} · ${category}`}</li>
        </div>
      </PostInfo>
    </>
  );
};

export default PostInfoGroup;
