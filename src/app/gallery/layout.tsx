import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery - Lawn Care Pro',
  description: 'View our portfolio of lawn care and landscaping projects. See examples of our work including lawn maintenance, landscaping, and more.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
} 