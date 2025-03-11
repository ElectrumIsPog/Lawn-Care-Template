import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Lawn Care Pro',
  description: 'Contact Lawn Care Pro for professional lawn care and landscaping services. Get a free consultation and estimate for your lawn care needs.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
} 