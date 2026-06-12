import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../api/client';
import PostCard from '../components/PostCard';
import type { Post } from '../types/post';
import { formatCategory } from '../types/post';

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postsApi
      .getMine()
      .then((page) => setPosts(page.content))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Posts</h1>
          <p className="mt-1 text-slate-600">Your drafts and published articles</p>
        </div>
        <Link
          to="/write"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Write New
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-600">You haven't written anything yet.</p>
          <Link to="/write" className="mt-4 inline-block text-brand-600 hover:underline">
            Write your first experience
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {posts.map((post) =>
            post.status === 'PUBLISHED' ? (
              <PostCard key={post.id} post={post} />
            ) : (
              <div
                key={post.id}
                className="rounded-xl border border-amber-200 bg-amber-50 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase text-amber-700">
                      {post.status} · {formatCategory(post.category)}
                    </span>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">{post.title}</h2>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
