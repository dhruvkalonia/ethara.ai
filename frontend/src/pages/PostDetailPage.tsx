import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { postsApi } from '../api/client';
import type { Post } from '../types/post';
import { formatCategory } from '../types/post';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    postsApi
      .getById(id)
      .then(setPost)
      .catch(() => setError('Post not found or not published'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-red-600">{error || 'Post not found'}</p>
        <Link to="/" className="mt-4 inline-block text-brand-600 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
        {formatCategory(post.category)}
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">{post.title}</h1>
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
        <span>By {post.authorName} (@{post.authorUsername})</span>
        {post.location && <span>· {post.location}</span>}
        <span>· {new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="mt-8 whitespace-pre-wrap text-slate-700 leading-relaxed">{post.description}</div>
      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded bg-slate-100 px-3 py-1 text-sm text-slate-600">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
