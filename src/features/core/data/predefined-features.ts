import { AppFeature } from "@/features/core/models";

export const PREDEFINED_FEATURES: AppFeature[] = [
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    description: "How your app looks and feels across all screen sizes",
    details:
      "This covers everything visual — from early sketches and layouts to the final polished design your users will see. It includes choosing colors, fonts, and spacing, as well as making sure the app looks great on phones, tablets, and desktops. A good design phase also involves understanding your users' needs so the app is intuitive and easy to navigate.",
    factors:
      "The more screens and unique layouts your app needs, the more design work is involved. Custom artwork, animations, or in-depth user testing will push this toward the higher end. If there's an existing brand guide or design template to work from, that can bring the time down.",
    minHours: 40,
    maxHours: 120,
    alwaysActive: true,
  },
  {
    id: "maintenance",
    name: "Ongoing Maintenance",
    description: "Keeping your app running smoothly after launch",
    details:
      "Once your app is live, it needs regular care — fixing bugs, applying security updates, and making sure everything keeps working as phones and browsers update. This also covers monitoring your app's performance and responding quickly if something goes wrong. Think of it like routine maintenance for a car. Industry standard is to budget 15–25% of your total development time for annual maintenance.",
    factors:
      "A more complex app with lots of moving parts will naturally need more upkeep. Apps with heavy traffic or many connected services tend to land on the higher end. AI-built apps typically need more maintenance due to additional code review and cleanup over time.",
    minHours: 0,
    maxHours: 0,
    alwaysActive: true,
  },
  {
    id: "user-auth",
    name: "User Accounts & Login",
    description: "Let users create accounts, sign in, and manage their passwords",
    details:
      "This gives your users a secure way to create an account, log in, and reset their password if they forget it. It can also include options like signing in with Google or Apple so users don't have to remember yet another password. Behind the scenes, this keeps all user data safe and protected.",
    factors:
      "A simple email-and-password login is on the quicker side. Adding social sign-in options (Google, Apple, Facebook), extra security steps like two-factor verification, or support for business single sign-on will add to the timeline.",
    minHours: 40,
    maxHours: 80,
  },
  {
    id: "user-profiles",
    name: "User Profiles",
    description: "Personal profile pages where users can manage their info",
    details:
      "Gives each user their own profile page where they can add a photo, update their name, and manage their account settings. This is the space where users control their personal information and how they appear to others within the app.",
    factors:
      "A basic profile with a photo and a few fields is straightforward. Adding features like cover images, follower counts, detailed privacy settings, or letting users customize the look of their profile will take more time.",
    minHours: 20,
    maxHours: 50,
  },
  {
    id: "push-notifications",
    name: "Push Notifications",
    description: "Send alerts and updates directly to users' devices",
    details:
      "Keeps your users in the loop by sending timely messages straight to their phone or browser — even when they're not using the app. This includes things like order updates, reminders, or new activity alerts, along with settings so users can choose which notifications they receive.",
    factors:
      "Sending basic text alerts is relatively quick to set up. Supporting notifications on multiple platforms (iPhone, Android, and web), adding images or action buttons to notifications, or building a scheduling system will move toward the higher end.",
    minHours: 20,
    maxHours: 50,
  },
  {
    id: "payments",
    name: "Payments & Checkout",
    description: "Accept payments from your users securely",
    details:
      "Allows your app to accept credit cards, debit cards, and other payment methods through a secure checkout process. This covers everything from the payment screen your users see to processing the transaction, generating receipts, and handling refunds when needed.",
    factors:
      "A one-time payment flow is the simplest setup. Subscriptions, multiple payment methods (like digital wallets or bank transfers), support for different currencies, or splitting payments between multiple parties all add complexity and time.",
    minHours: 80,
    maxHours: 150,
  },
  {
    id: "search",
    name: "Search",
    description: "Help users quickly find what they're looking for",
    details:
      "Adds a search bar that lets users find content, products, or information within your app. A good search experience handles typos gracefully, shows relevant results first, and lets users narrow things down with filters like category, date, or price.",
    factors:
      "A basic search across a small set of content is on the simpler side. The timeline grows if you need advanced filtering, location-based results, support for multiple languages, or if your app has a large amount of content to search through.",
    minHours: 20,
    maxHours: 60,
  },
  {
    id: "messaging",
    name: "In-App Messaging",
    description: "Let users send messages to each other in real time",
    details:
      "Builds a chat experience right into your app so users can communicate with each other instantly. This includes a conversation view, message history so nothing gets lost, and indicators that show when someone is typing or has read a message.",
    factors:
      "Simple one-on-one messaging is the quickest to build. Group conversations, the ability to share photos or files within chats, read receipts, and message reactions each add to the scope. Using a pre-built chat service can help keep things on the lower end.",
    minHours: 90,
    maxHours: 200,
  },
  {
    id: "admin-dashboard",
    name: "Admin Dashboard",
    description: "A control panel for you to manage your app and its users",
    details:
      "Gives you (the app owner) a private area to manage users, review content, adjust settings, and see how your app is performing. Think of it as the back office of your app — the place where you handle day-to-day operations without needing a developer.",
    factors:
      "A basic dashboard for viewing users and key stats is straightforward. Adding detailed permission levels for team members, activity history, content moderation tools, or rich charts and data exports will take more time to build.",
    minHours: 60,
    maxHours: 200,
  },
  {
    id: "file-uploads",
    name: "File Uploads",
    description: "Let users upload photos, documents, or other files",
    details:
      "Allows users to upload files like images, PDFs, or documents from their device. The files are stored securely in the cloud so they're always available. This includes things like drag-and-drop uploading, progress bars, and checks to make sure files aren't too large or the wrong type.",
    factors:
      "Handling basic image uploads is fairly quick. Supporting video uploads, very large files, automatic image resizing, or strict access rules around who can view uploaded files will require more development time.",
    minHours: 20,
    maxHours: 60,
  },
  {
    id: "analytics",
    name: "Analytics & Reporting",
    description: "Track how people use your app and view reports",
    details:
      "Helps you understand what's happening in your app — which features are popular, how users move through the experience, and where they drop off. Includes dashboards with charts and the ability to export data so you can make informed decisions about your product.",
    factors:
      "Plugging in a standard analytics tool for basic tracking is on the simpler side. Custom dashboards, real-time data, detailed user journey tracking, or compliance with data privacy regulations will add to the effort.",
    minHours: 40,
    maxHours: 100,
  },
  {
    id: "social-sharing",
    name: "Social Sharing",
    description: "Let users share content from your app to social media",
    details:
      "Makes it easy for users to share content, products, or pages from your app to platforms like Facebook, X (Twitter), LinkedIn, and more. When someone clicks a shared link, they'll see a rich preview with an image, title, and description — helping drive traffic back to your app.",
    factors:
      "Basic share buttons with standard link previews are quick to set up. Auto-generated preview images, smart links that open directly in your app, or tracking how often content gets shared will take a bit more work.",
    minHours: 10,
    maxHours: 30,
  },
];

export const DEFAULT_HOURLY_RATE = 90;

export const AI_DEV_MULTIPLIER = 0.7;

export const MAINTENANCE_PERCENT_MIN = 15;
export const MAINTENANCE_PERCENT_MAX = 25;
export const AI_MAINTENANCE_PERCENT_MIN = 25;
export const AI_MAINTENANCE_PERCENT_MAX = 35;
