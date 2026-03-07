// ─────────────────────────────────────────────────────────────────────────────
// Service Providers
// Replace these placeholder entries with your actual local providers.
// Each provider's hourly rate will be pre-loaded into the calculator when
// a user clicks "Run Estimate" on the providers page.
// ─────────────────────────────────────────────────────────────────────────────

export interface Provider {
  id: string;
  name: string;
  description: string;
  hourlyRate: number;
  tags: string[];
  website?: string;
}

export const PROVIDERS: Provider[] = [
  {
    id: "acme-digital",
    name: "Acme Digital",
    description:
      "Full-service web and mobile agency specializing in consumer apps, e-commerce, and SaaS products. Handles design, development, and launch.",
    hourlyRate: 150,
    tags: ["Full-service", "Local agency"],
    website: "https://example.com",
  },
  {
    id: "blue-horizon",
    name: "Blue Horizon Studios",
    description:
      "Boutique studio focused on mobile-first products for small businesses and startups. Known for fast turnaround and transparent communication.",
    hourlyRate: 120,
    tags: ["Mobile", "Small studio"],
    website: "https://example.com",
  },
  {
    id: "pixel-craft",
    name: "Pixel Craft",
    description:
      "Design-led development team with deep experience in UI/UX and React-based web applications. Ideal for brand-conscious projects.",
    hourlyRate: 100,
    tags: ["Design-focused", "Web apps"],
    website: "https://example.com",
  },
  {
    id: "novatech",
    name: "NovaTech Solutions",
    description:
      "Mid-size development firm covering web, mobile, and cloud infrastructure. Good fit for projects that need a reliable, process-driven team.",
    hourlyRate: 85,
    tags: ["Full-stack", "Cloud"],
    website: "https://example.com",
  },
  {
    id: "code-collective",
    name: "Code Collective",
    description:
      "Vetted freelancer network offering flexible team scaling. Matches clients with developers based on tech stack and project type.",
    hourlyRate: 75,
    tags: ["Freelance network", "Flexible"],
    website: "https://example.com",
  },
  {
    id: "remote-build",
    name: "Remote Build Co.",
    description:
      "Remote-first development team with staff across Eastern Europe and Latin America. Competitive rates with strong English communication.",
    hourlyRate: 55,
    tags: ["Remote", "Budget-friendly"],
    website: "https://example.com",
  },
];
