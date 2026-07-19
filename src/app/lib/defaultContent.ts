export const DEFAULT_PAGE_CONTENT: Record<string, any> = {
  home: {
    hero: {
      title: 'Welcome to SerandiByte',
      subtitle: 'Your Digital Transformation Partner',
      description: 'We create modern digital experiences that help businesses grow.',
      buttonText: 'Free Consultation',
      image: '/circule.gif',
    },
    about: {
      title: 'Why You Choose Us',
      description: 'We combine strategy, design, and engineering to build memorable product experiences.',
      cards: [
        {
          title: 'Modern Solutions',
          description: 'Scalable, elegant products built for fast-moving teams.',
        },
        {
          title: 'Reliable Delivery',
          description: 'Clear communication and dependable execution from kickoff to launch.',
        },
        {
          title: 'Long-Term Growth',
          description: 'We build with maintenance and future expansion in mind.',
        },
      ],
    },
  },
  about: {
    title: 'About Us',
    description: 'We are a team of passionate developers, designers, and strategists building digital products that feel effortless.',
    mission: 'To empower businesses with practical, future-ready technology.',
    vision: 'To become the trusted digital transformation partner for ambitious brands.',
    team: [],
    stats: { projects: 120, clients: 75, experience: 8, awards: 12 },
  },
  services: {
    title: 'Our Services',
    subtitle: 'Complete Digital Solutions',
    description: 'From polished websites to scalable bespoke platforms, we tailor every engagement to real business goals.',
    services: [
      {
        title: 'Web Development',
        description: 'Fast, responsive websites and applications crafted for modern audiences.',
        details: 'React • Next.js • Tailwind',
        image: '/software.png',
      },
      {
        title: 'UI/UX Design',
        description: 'Thoughtful interfaces that make every interaction feel intuitive.',
        details: 'Design systems • Prototyping',
        image: '/design.png',
      },
      {
        title: 'Digital Strategy',
        description: 'Guidance that turns product ideas into measurable growth.',
        details: 'Roadmaps • Growth planning',
        image: '/webdesign.png',
      },
    ],
  },
  contact: {
    title: 'Contact Us',
    subtitle: "Let's Start Your Project",
    description: 'Ready to transform your business? Get in touch with our team.',
    info: { email: 'hello@serandibyte.com', phone: '+94 (77) 584-1916', address: 'Colombo, Sri Lanka' },
    social: { instagram: 'https://instagram.com', facebook: 'https://facebook.com', linkedin: 'https://linkedin.com' },
  },
};
