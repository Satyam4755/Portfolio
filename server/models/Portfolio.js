import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: '' },
    level: { type: Number, min: 1, max: 100, default: 80 }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    repoUrl: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    techStack: [{ type: String }]
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    year: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  { _id: false }
);

const socialSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true }
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    ownerEmail: { type: String, default: '' },
    profile: {
      fullName: { type: String, default: 'Your Name' },
      headline: { type: String, default: 'Professional headline' },
      bio: { type: String, default: 'Add your bio from admin panel.' },
      location: { type: String, default: '' },
      avatarUrl: { type: String, default: '' },
      resumeUrl: { type: String, default: '' }
    },
    settings: {
      brandName: { type: String, default: 'Portfolio' },
      tagline: { type: String, default: 'Professional portfolio website' }
    },
    skills: [skillSchema],
    projects: [projectSchema],
    education: [educationSchema],
    socialLinks: [socialSchema],
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Portfolio = mongoose.model('Portfolio', portfolioSchema);
