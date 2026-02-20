export const defaultPortfolio = {
  ownerEmail: '',
  profile: {
    fullName: 'Your Name',
    headline: 'Building clean and useful products',
    bio: 'Use admin panel to edit this portfolio content.',
    location: 'Your City',
    avatarUrl: '',
    resumeUrl: ''
  },
  settings: {
    brandName: 'Portfolio',
    tagline: 'Professional portfolio website'
  },
  skills: [
    { name: 'React', category: 'Frontend', level: 85 },
    { name: 'Node.js', category: 'Backend', level: 80 }
  ],
  projects: [
    {
      title: 'Portfolio Website',
      summary: 'Editable portfolio with private admin section.',
      liveUrl: '',
      repoUrl: '',
      imageUrl: '',
      techStack: ['React', 'Node.js', 'MongoDB']
    }
  ],
  education: [
    {
      institution: 'Your College',
      degree: 'Your Degree',
      year: '2024',
      description: ''
    }
  ],
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/' }
  ]
};
