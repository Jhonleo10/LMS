export interface TechCourse {
  name: string;
  icon: React.ReactNode;
}

export const POPULAR_TECHNOLOGIES: TechCourse[] = [
  {
    name: "Data Engineering",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
      </svg>
    ),
  },
  {
    name: "Data Analysis",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
        <path d="M3 17l5-6 4 4 8-9" />
      </svg>
    ),
  },
  {
    name: "Machine Learning",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2">
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
      </svg>
    ),
  },
  {
    name: "Data Science",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2">
        <path d="M4 20V10M10 20V4M16 20v-7M22 20V8" />
      </svg>
    ),
  },
  {
    name: "Artificial Intelligence",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2">
        <rect x="5" y="8" width="14" height="10" rx="2" />
        <circle cx="9" cy="13" r="1" fill="#38BDF8" />
        <circle cx="15" cy="13" r="1" fill="#38BDF8" />
        <path d="M9 5h6M12 5V8" />
      </svg>
    ),
  },
  {
    name: "Prompt Engineering",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
        <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
      </svg>
    ),
  },
  {
    name: "Generative AI",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1zM19 13l.8 2.4 2.4.8-2.4.8-.8 2.4-.8-2.4-2.4-.8 2.4-.8.8-2.4z" />
      </svg>
    ),
  },
  {
    name: "AWS Cloud",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
        <path d="M6 16a6 6 0 0112 0M8 16h8" />
      </svg>
    ),
  },
  {
    name: "Azure Cloud",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
        <path d="M6 16a6 6 0 0112 0" />
        <path d="M9 16l3-6 3 6" stroke="#2563EB" />
      </svg>
    ),
  },
  {
    name: "Google Cloud",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
        <path d="M6 16a6 6 0 0112 0" />
      </svg>
    ),
  },
  {
    name: "Power BI",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 12L16 8" />
      </svg>
    ),
  },
  {
    name: "Tableau",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
        <rect x="4" y="14" width="3" height="6" />
        <rect x="10" y="10" width="3" height="10" />
        <rect x="16" y="6" width="3" height="14" />
      </svg>
    ),
  },
  {
    name: "Python",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2">
        <path d="M8 7h8a3 3 0 013 3v2H5V10a3 3 0 013-3zM16 17H8a3 3 0 01-3-3v-2h16v2a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    name: "Flask",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2">
        <path d="M10 3v6l-2 10h8l-2-10V3" />
        <path d="M8 9h8" />
      </svg>
    ),
  },
  {
    name: "TensorFlow",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
        <path d="M12 4l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4" />
      </svg>
    ),
  },
  {
    name: "Keras",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
        <path d="M12 4l8 4-8 4-8-4 8-4zM4 12l8 4 8-4" />
      </svg>
    ),
  },
  {
    name: "OpenAI",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      </svg>
    ),
  },
  {
    name: "Gemini",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
      </svg>
    ),
  },
  {
    name: "LLM",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
      </svg>
    ),
  },
];
