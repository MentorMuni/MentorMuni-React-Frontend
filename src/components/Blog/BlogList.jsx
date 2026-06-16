import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../constants/blogPosts';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories
  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];

  // Filter posts by category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return blogPosts;
    return blogPosts.filter(post => post.category === selectedCategory);
  }, [selectedCategory]);

  // Featured posts for hero
  const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 3);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="bg-background min-h-screen py-12 sm:py-16 md:py-20">
      <div className="mm-container mm-container--wide space-y-12 md:space-y-16">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center max-w-3xl mx-auto"
        >
          <h1 className="typo-h1 text-4xl md:text-5xl lg:text-6xl">
            Interview Prep Strategies
          </h1>
          <p className="typo-body-lg text-muted-foreground max-w-2xl mx-auto">
            Expert guides on campus placement preparation, company-specific interview tips, and why your readiness score matters.
          </p>
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {featuredPosts.map(post => (
              <motion.div
                key={post.id}
                variants={item}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/50 transition-all"
              >
                <Link to={`/blog/${post.slug}`} className="p-6 sm:p-8 block h-full flex flex-col">
                  {/* Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>

                  {/* Title and subtitle */}
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.subtitle}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/50 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime} min
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 mt-4 text-primary group-hover:gap-3 transition-all">
                    <span className="text-sm font-semibold">Read article</span>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* All Posts Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPosts.map(post => (
            <motion.div
              key={post.id}
              variants={item}
              className="group relative overflow-hidden rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all"
            >
              <Link to={`/blog/${post.slug}`} className="p-6 block h-full flex flex-col">
                {/* Tag */}
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={14} className="text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition line-clamp-2">
                  {post.title}
                </h3>

                {/* Subtitle */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {post.subtitle}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-4 border-t border-border/30">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime} min
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* No posts message */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found in this category.</p>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-primary/10 via-accent-soft to-primary/5 rounded-2xl p-8 sm:p-12 text-center border border-primary/20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Assess Your Readiness?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Take the free 5-minute interview readiness assessment and get a personalized score. Know exactly where you stand.
          </p>
          <Link
            to="/start-assessment"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition"
          >
            Take Free Assessment
            <ArrowRight size={18} />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
