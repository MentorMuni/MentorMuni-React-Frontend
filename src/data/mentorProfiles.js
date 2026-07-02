/**
 * Mentor profile cards — public /mentors page.
 * TODO(content): Replace photoUrl and linkedInUrl with verified assets when available.
 */
export const MENTOR_PROFILES = [
  {
    name: 'Mohit J',
    experience: '14 years',
    companies: ['Nagarro', 'Persistent'],
    tag: 'Enterprise delivery and engineering leadership — deep MNC services experience.',
    gradient: 'linear-gradient(145deg, #94a3b8 0%, #64748b 40%, #475569 100%)',
  },
  {
    name: 'Ananya K',
    experience: '12 years',
    companies: ['Infosys', 'Razorpay'],
    tag: 'Scaled systems at a large IT major, then product engineering at a fintech.',
    gradient: 'linear-gradient(150deg, #5eead4 0%, #2dd4bf 45%, #0d9488 100%)',
  },
  {
    name: 'Rohan S',
    experience: '15 years',
    companies: ['Accenture', 'Swiggy'],
    tag: 'Consulting and delivery backgrounds, then high-pace consumer product teams.',
    gradient: 'linear-gradient(145deg, #fdba74 0%, #fb923c 42%, #ea580c 100%)',
  },
].map((m) => ({
  ...m,
  /** TODO(content): Add CDN or /public headshot URL */
  photoUrl: null,
  /** TODO(content): Add verified LinkedIn profile URL */
  linkedInUrl: null,
}));
