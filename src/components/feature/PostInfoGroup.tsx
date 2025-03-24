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
  padding: 16px 0;
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
    padding: 0 10px;
    border-right: 1px solid #ddd;
    color: rgba(0, 0, 0, 0.5);

    &:first-child {
      padding-left: 0;
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
  }
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
        <li className="blue">{author}</li>
        <li>{timestamp}</li>
        <li>{category}</li>
      </PostInfo>
    </>
  );
};

export default PostInfoGroup;
