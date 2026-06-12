export type PostCategory =
  | 'TECHNOLOGY'
  | 'INTERVIEW_EXPERIENCE'
  | 'TRAVEL'
  | 'FOOD'
  | 'CAFE'
  | 'CITY_GUIDE'
  | 'CAREER'
  | 'COLLEGE'
  | 'STARTUP'
  | 'FITNESS'
  | 'LIFE_LESSONS'
  | 'PERSONAL_STORY'
  | 'OTHER';

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  title: string;
  description: string;
  category: PostCategory;
  tags: string[];
  location?: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  description: string;
  category: PostCategory;
  tags?: string[];
  location?: string;
  status: PostStatus;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export const POST_CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'INTERVIEW_EXPERIENCE', label: 'Interview Experience' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'FOOD', label: 'Food' },
  { value: 'CAFE', label: 'Cafe' },
  { value: 'CITY_GUIDE', label: 'City Guide' },
  { value: 'CAREER', label: 'Career' },
  { value: 'COLLEGE', label: 'College' },
  { value: 'STARTUP', label: 'Startup' },
  { value: 'FITNESS', label: 'Fitness' },
  { value: 'LIFE_LESSONS', label: 'Life Lessons' },
  { value: 'PERSONAL_STORY', label: 'Personal Story' },
  { value: 'OTHER', label: 'Other' },
];

export function formatCategory(category: PostCategory): string {
  return POST_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}
