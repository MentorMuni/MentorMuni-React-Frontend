import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { getBlogPostBySlug, blogPosts } from '../../constants/blogPosts';
import NotFoundPage from '../NotFoundPage';

/**
 * Individual Blog Post Component
 * - Renders full blog post content
 * - SEO-optimized with schema markup
 * - Social sharing support
 * - Related posts section
 */
export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);

  useEffect(() => {
    // Set document title and meta tags for SEO
    if (post) {
      document.title = post.title + ' | MentorMuni Blog';

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.metaDescription);
      }

      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', post.seoKeywords.join(', '));
      }
    }
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return <NotFoundPage />;
  }

  // Get related posts (same category, different post)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  // Schema.org markup for SEO
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: 'https://www.mentormuni.com/mentormuni-brand-banner-new.png',
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'MentorMuni',
      url: 'https://www.mentormuni.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'MentorMuni',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.mentormuni.com/mentormuni-logo.png'
      }
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post.title;

    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  // Parse markdown-like content and render
  const renderContent = (content) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-2xl font-bold mt-8 mb-4">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-xl font-bold mt-6 mb-3">{line.slice(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="list-disc list-inside ml-2 mb-2">{line.slice(2)}</li>;
      }
      if (line.startsWith('| ')) {
        // Table row - skip for now, just show as text
        return <p key={idx} className="text-sm font-mono mb-1">{line}</p>;
      }
      if (line.trim() === '') {
        return <div key={idx} className="mb-4"></div>;
      }
      return <p key={idx} className="text-base leading-relaxed mb-3">{line}</p>;
    });
  };

  return (
    <>
      {/* Schema.org markup */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>

      <div className="bg-background min-h-screen py-8 sm:py-12 md:py-16">
        <article className="mm-container mm-container--narrow space-y-8 sm:space-y-12">

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft size={18} />
              Back to all articles
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 border-b border-border pb-8"
          >
            {/* Category badge */}
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              {post.category}
            </div>

            {/* Title */}
            <h1 className="typo-h1 text-4xl md:text-5xl">
              {post.title}
            </h1>

            {/* Subtitle */}
            <p className="typo-body-lg text-muted-foreground max-w-3xl">
              {post.subtitle}
            </p>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                {post.readTime} min read
              </div>
              <div className="text-xs font-medium">By {post.author}</div>
            </div>
          </motion.div>

          {/* Share buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3 justify-center md:justify-start"
          >
            <span className="text-sm font-semibold text-muted-foreground">Share:</span>
            <button
              onClick={() => handleShare('linkedin')}
              className="p-2 rounded-lg hover:bg-secondary transition"
              aria-label="Share on LinkedIn"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 rounded-lg hover:bg-secondary transition"
              aria-label="Share on Twitter"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="p-2 rounded-lg hover:bg-secondary transition"
              aria-label="Share on WhatsApp"
            >
              <Share2 size={18} />
            </button>
          </motion.div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert max-w-none text-foreground space-y-4"
          >
            {renderContent(post.content)}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-primary/10 via-accent-soft to-primary/5 rounded-2xl p-8 sm:p-12 border border-primary/20 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Test Your Interview Readiness?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Take our free 5-minute assessment and get a personalized readiness score plus a detailed gap report.
            </p>
            <Link
              to="/start-assessment"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition"
            >
              Get Your Readiness Score
            </Link>
          </motion.div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8 border-t border-border pt-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition p-6"
                  >
                    <div className="text-xs font-semibold text-primary mb-2">
                      {relatedPost.category}
                    </div>
                    <h3 className="font-bold group-hover:text-primary transition line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {relatedPost.readTime} min
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

        </article>
      </div>
    </>
  );
}
