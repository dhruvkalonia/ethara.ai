import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsApi } from '../api/client';
import type { PostCategory, PostStatus } from '../types/post';
import { POST_CATEGORIES } from '../types/post';

export default function WritePostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PostCategory>('OTHER');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<PostStatus>('PUBLISHED');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const post = await postsApi.create({
        title,
        description,
        category,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        location: location || undefined,
        status,
      });
      navigate(status === 'PUBLISHED' ? `/posts/${post.id}` : '/my-posts');
    } catch (err: unknown) {
      const response = (err as { response?: { data?: { message?: string; validationErrors?: Record<string, string> } } })
        ?.response?.data;
      const validationMsg = response?.validationErrors
        ? Object.values(response.validationErrors).join(', ')
        : null;
      setError(validationMsg ?? response?.message ?? 'Failed to save post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Write an Experience</h1>
      <p className="mt-2 text-slate-600">Share your story, tips, or advice with the community.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            minLength={5}
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. My Amazon SDE Interview Experience"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as PostCategory)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {POST_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            required
            minLength={20}
            rows={12}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your experience in detail..."
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <p className="mt-1 text-xs text-slate-500">{description.length} / min 20 characters</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-slate-700">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="interview, amazon, sde"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700">
              Location (optional)
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Bangalore, India"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700">
            Publish status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="PUBLISHED">Publish now</option>
            <option value="DRAFT">Save as draft</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-600 px-6 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : status === 'PUBLISHED' ? 'Publish' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-lg border border-slate-300 px-6 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
