// Mirror of Platform type from PlatformSelector — kept local to avoid circular imports
type PlatformId = "web" | "ios" | "android" | "cross-platform";

export interface AppPreset {
  id: string;
  label: string;
  emoji: string;
  featureIds: string[];
  /** Platforms on which this preset makes no sense and should be disabled */
  disabledForPlatforms?: PlatformId[];
  /** Human-readable reason shown in the tooltip when disabled */
  disabledReason?: string;
}

export const PRESETS: AppPreset[] = [
  {
    id: "mobile-app",
    label: "Mobile App",
    emoji: "📱",
    featureIds: [
      "user-auth",
      "user-profiles",
      "push-notifications",
      "onboarding",
      "file-uploads",
    ],
    disabledForPlatforms: ["web"],
    disabledReason: "Mobile App targets native platforms. Switch to iOS, Android, or Cross-platform.",
  },
  {
    id: "saas-web",
    label: "SaaS / Web App",
    emoji: "💻",
    featureIds: [
      "user-auth",
      "admin-dashboard",
      "analytics",
      "subscriptions",
      "search",
    ],
    disabledForPlatforms: ["ios", "android"],
    disabledReason: "SaaS / Web App targets browsers. Switch to Web App or Cross-platform.",
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    emoji: "🛍️",
    featureIds: [
      "payments",
      "ecommerce",
      "search",
      "reviews-ratings",
      "analytics",
    ],
  },
  {
    id: "marketplace",
    label: "Marketplace",
    emoji: "🏪",
    featureIds: [
      "user-auth",
      "payments",
      "booking-scheduling",
      "reviews-ratings",
      "messaging",
    ],
  },
  {
    id: "portfolio",
    label: "Portfolio / Marketing",
    emoji: "🌐",
    featureIds: ["onboarding"],
  },
];
