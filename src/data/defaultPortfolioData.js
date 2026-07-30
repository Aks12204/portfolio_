export const defaultPortfolioData = {
  profile: {
    name: "Alex Rivera",
    role: "Full-Stack & Cloud Engineer",
    tagline: "Building scalable web platforms, cloud architecture, and modern digital experiences.",
    bio: "I am a passionate software engineer focused on building clean, high-performance web applications and cloud solutions. I love open-source, continuous learning, and sharing my technical journey with the community.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    email: "alex.rivera.dev@example.com",
    location: "San Francisco, CA",
    resumeUrl: "#",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    }
  },
  achievements: [
    {
      id: "ach-1",
      title: "AWS Certified Solutions Architect – Associate",
      category: "Certification",
      date: "2026-07-15",
      description: "Passed the AWS Solutions Architect exam with a score of 890/1000! Validated core expertise in designing resilient, high-performing, and cost-optimized cloud architectures.",
      image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1000&q=80",
      likesCount: 24,
      isLikedByUser: false,
      comments: [
        { id: "c-1", author: "Sarah Jenkins", text: "Huge congratulations Alex! Well deserved success.", date: "2026-07-16" },
        { id: "c-2", author: "David Miller", text: "Inspiring milestone! How long did you prepare for it?", date: "2026-07-17" }
      ]
    },
    {
      id: "ach-2",
      title: "1st Place Winner – HackCloud 2026",
      category: "Award",
      date: "2026-06-02",
      description: "Won 1st place among 120 teams for building 'EcoStream'—an AI-powered serverless carbon emission tracking dashboard for cloud workloads.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
      likesCount: 42,
      isLikedByUser: false,
      comments: [
        { id: "c-3", author: "Elena Rostova", text: "EcoStream was amazing! Great job presenting to the judges.", date: "2026-06-03" }
      ]
    },
    {
      id: "ach-3",
      title: "Open Source Milestone: 1,000 GitHub Stars",
      category: "Milestone",
      date: "2026-04-10",
      description: "My open-source microservices CLI utility reached over 1,000 stars on GitHub! Super thankful to all contributors and community members.",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1000&q=80",
      likesCount: 38,
      isLikedByUser: false,
      comments: []
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "CloudNative Student Portal",
      description: "A comprehensive student management system built with React, Node.js, and AWS Lambda serverless functions. Features live grade tracking and automated course registration.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      tags: ["React", "AWS Lambda", "Node.js", "DynamoDB"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      featured: true
    },
    {
      id: "proj-2",
      title: "DevMetrics Analytics Dashboard",
      description: "Real-time analytics platform for engineering teams. Tracks pull request review times, deployment frequencies, and system uptime with clean charts.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      tags: ["Vite", "TypeScript", "TailwindCSS", "Chart.js"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      featured: true
    },
    {
      id: "proj-3",
      title: "Smart Task Automator API",
      description: "RESTful API engine for automating multi-step web workflows and webhooks integration with rate limiting and queue management.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      tags: ["Python", "FastAPI", "Redis", "Docker"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      featured: false
    }
  ],
  skills: [
    {
      category: "Frontend Development",
      items: ["React.js", "JavaScript (ES6+)", "HTML5 & CSS3", "TypeScript", "Vite", "Responsive Design"]
    },
    {
      category: "Backend & Cloud",
      items: ["Node.js", "Express.js", "Python", "RESTful APIs", "AWS (EC2, S3, Lambda)", "PostgreSQL / MongoDB"]
    },
    {
      category: "DevOps & Tools",
      items: ["Git & GitHub", "Docker", "CI/CD Pipelines", "Linux / Shell", "Postman", "Vercel / Netlify"]
    }
  ],
  experience: [
    {
      id: "exp-1",
      role: "Full-Stack Software Engineer",
      company: "Apex Tech Solutions",
      period: "2025 - Present",
      description: "Architected micro-frontend modules and scalable cloud microservices serving 100k+ active users. Improved API latency by 35%.",
      technologies: ["React", "Node.js", "AWS", "Docker"]
    },
    {
      id: "exp-2",
      role: "Junior Web Developer",
      company: "Digital Core Studio",
      period: "2024 - 2025",
      description: "Developed responsive web interfaces, integrated third-party payment gateways, and optimized client website loading performance.",
      technologies: ["JavaScript", "HTML5/CSS3", "REST APIs", "Git"]
    }
  ]
};
