import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../api/client';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../types/post';

export default function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postsApi
      .getPublished()
      .then((page) => setPosts(page.content))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Share Real Experiences</h1>
          <p className="mt-2 text-slate-600">
            Interview tips, travel stories, city guides, and more — from people who've been there.
          </p>
          {user && (
            <p className="mt-2 text-brand-700">
              Welcome back, <span className="font-semibold">{user.name}</span>!
            </p>
          )}
        </div>
        {user && (
          <Link
            to="/write"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-600 px-6 py-2.5 font-medium text-white hover:bg-brand-700"
          >
            Write Experience
          </Link>
        )}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Latest Experiences</h2>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center">
            <p className="text-slate-600">No experiences published yet.</p>
            {user ? (
              <Link to="/write" className="mt-4 inline-block text-brand-600 hover:underline">
                Be the first to share yours
              </Link>
            ) : (
              <Link to="/register" className="mt-4 inline-block text-brand-600 hover:underline">
                Sign up and write the first one
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
