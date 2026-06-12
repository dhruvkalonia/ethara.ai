import { Link } from 'react-router-dom';
import type { Post } from '../types/post';
import { formatCategory } from '../types/post';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const preview =
    post.description.length > 200 ? `${post.description.slice(0, 200)}...` : post.description;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            {formatCategory(post.category)}
          </span>
          <h2 className="mt-3 text-xl font-semibold text-slate-900">
            <Link to={`/posts/${post.id}`} className="hover:text-brand-700">
              {post.title}
            </Link>
          </h2>
        </div>
      </div>
      <p className="mt-3 text-slate-600">{preview}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span>@{post.authorUsername}</span>
        {post.location && <span>· {post.location}</span>}
        <span>· {new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
