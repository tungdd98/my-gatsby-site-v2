import React, { FC } from 'react';
import { TPost } from '../../types/post.type';
import { Link } from 'gatsby';
import parse from 'html-react-parser';

type PostItemProps = {
  data: TPost;
};

const PostItem: FC<PostItemProps> = ({ data }) => {
  return (
    <article className="py-4 border-b last:border-0">
      <header>
        <h2 className="text-2xl font-bold">
          <Link to={data.uri}>
            <span>{parse(data.title)}</span>
          </Link>
        </h2>
        <small className="text-xs text-slate-400">{data.date}</small>
      </header>
    </article>
  );
};

export default PostItem;
