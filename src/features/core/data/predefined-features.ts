import { AppFeature } from "@/features/core/models";

export const PREDEFINED_FEATURES: AppFeature[] = [
  {
    id: "user-auth",
    name: "User Accounts & Login",
    description: "Let users create accounts, sign in, and manage their passwords",
    details:
      "This gives your users a secure way to create an account, log in, and reset their password if they forget it. It can also include options like signing in with Google or Apple so users don't have to remember yet another password. Behind the scenes, this keeps all user data safe and protected.",
    factors:
      "A simple email-and-password login is on the quicker side. Adding social sign-in options (Google, Apple, Facebook), extra security steps like two-factor verification, or support for business single sign-on will add to the timeline.",
    minHours: 40,
    maxHours: 100,
  },
  {
    id: "user-profiles",
    name: "User Profiles",
    description: "Personal profile pages where users can manage their info",
    details:
      "Gives each user their own profile page where they can add a photo, update their name, and manage their account settings. This is the space where users control their personal information and how they appear to others within the app.",
    factors:
      "A basic profile with a photo and a few fields is straightforward. Adding features like cover images, follower counts, detailed privacy settings, or letting users customize the look of their profile will take more time.",
    minHours: 30,
    maxHours: 80,
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
    maxHours: 60,
  },
  {
    id: "payments",
    name: "Payments & Checkout",
    description: "Accept payments from your users securely",
    details:
      "Allows your app to accept credit cards, debit cards, and other payment methods through a secure checkout process. This covers everything from the payment screen your users see to processing the transaction, generating receipts, and handling refunds when needed.",
    factors:
      "A one-time payment flow is the simplest setup. Subscriptions, multiple payment methods (like digital wallets or bank transfers), support for different currencies, or splitting payments between multiple parties all add complexity and time.",
    minHours: 60,
    maxHours: 160,
  },
  {
    id: "search",
    name: "Search",
    description: "Help users quickly find what they're looking for",
    details:
      "Adds a search bar that lets users find content, products, or information within your app. A good search experience handles typos gracefully, shows relevant results first, and lets users narrow things down with filters like category, date, or price.",
    factors:
      "A basic search across a small set of content is on the simpler side. The timeline grows if you need advanced filtering, location-based results, support for multiple languages, or if your app has a large amount of content to search through.",
    minHours: 40,
    maxHours: 120,
  },
  {
    id: "messaging",
    name: "In-App Messaging",
    description: "Let users send messages to each other in real time",
    details:
      "Builds a chat experience right into your app so users can communicate with each other instantly. This includes a conversation view, message history so nothing gets lost, and indicators that show when someone is typing or has read a message.",
    factors:
      "Simple one-on-one messaging is the quickest to build. Group conversations, the ability to share photos or files within chats, read receipts, and message reactions each add to the scope. Using a pre-built chat service can help keep things on the lower end.",
    minHours: 80,
    maxHours: 250,
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
    minHours: 30,
    maxHours: 100,
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
    maxHours: 160,
  },
  {
    id: "geolocation",
    name: "Geolocation Services",
    description: "Use a device's location to power maps, nearby search, and more",
    details:
      "Integrates the device's GPS and location data into your app to enable features like showing a user's position on a map, finding nearby results, calculating distances, or tracking movement in real time. This typically includes an interactive map view, location permissions handling, and the ability to display points of interest or routes.",
    factors:
      "Showing a user's location on a basic map is on the simpler end. The timeline grows if you need real-time location tracking, turn-by-turn directions, geofencing (triggering actions when a user enters or leaves an area), heat maps, or support for users who have location permissions turned off.",
    minHours: 40,
    maxHours: 160,
  },
  {
    id: "social-sharing",
    name: "Social Sharing",
    description: "Let users share content from your app to social media",
    details:
      "Makes it easy for users to share content, products, or pages from your app to platforms like Facebook, X (Twitter), LinkedIn, and more. When someone clicks a shared link, they'll see a rich preview with an image, title, and description — helping drive traffic back to your app.",
    factors:
      "Basic share buttons with standard link previews are quick to set up. Auto-generated preview images, smart links that open directly in your app, or tracking how often content gets shared will take a bit more work.",
    minHours: 15,
    maxHours: 80,
  },
  {
    id: "booking-scheduling",
    name: "Booking & Scheduling",
    description: "Let users book appointments, reserve slots, or schedule services",
    details:
      "Gives users the ability to book appointments or reserve time slots directly in your app. This typically includes a calendar view showing availability, a booking form, confirmation emails or notifications, and the ability to cancel or reschedule. On the business side, it includes tools to manage your availability and view upcoming bookings.",
    factors:
      "A simple single-person booking flow is on the lower end. Complexity grows with multiple staff members or locations, recurring appointments, buffer times between bookings, waitlists, calendar sync with Google or Apple Calendar, and automated reminder messages.",
    minHours: 60,
    maxHours: 200,
  },
  {
    id: "onboarding",
    name: "Onboarding Flow",
    description: "Guide new users through setup and key features on first launch",
    details:
      "A first-run experience that welcomes new users and helps them get value from your app quickly. This might include a brief walkthrough of key features, a setup wizard to personalize the experience, prompts to grant necessary permissions (like notifications or location), and an empty state that helps users take their first action.",
    factors:
      "A simple welcome screen with two or three slides is quick to build. Adding personalization steps, interactive tutorials, branching paths based on user type, or progress tracking toward full setup will extend the timeline.",
    minHours: 20,
    maxHours: 60,
  },
  {
    id: "reviews-ratings",
    name: "Reviews & Ratings",
    description: "Let users leave star ratings and written reviews",
    details:
      "Allows users to rate and review products, services, or other users within your app. Includes a star rating input, a text review form, a display of aggregated ratings, and basic moderation tools so you can flag or remove inappropriate content. Reviews help build trust and give future users confidence in your product or service.",
    factors:
      "A simple star rating with no text is the quickest option. Adding written reviews, photo attachments, the ability for businesses to respond, verified purchase checks, sorting and filtering reviews, or an automated moderation system will increase the scope.",
    minHours: 30,
    maxHours: 80,
  },
  {
    id: "ecommerce",
    name: "Product Catalog & Shopping Cart",
    description: "Browse products, manage a cart, and complete purchases",
    details:
      "A full shopping experience within your app. This covers displaying products with images, descriptions, and pricing; filtering and sorting by category or attributes; adding items to a cart; managing quantities; applying discount codes; and completing a checkout. Distinct from the Payments feature, which covers just the payment step.",
    factors:
      "A small catalog with straightforward products is on the simpler side. Complexity increases with large inventories, product variants (like size or color), wishlists, inventory tracking, bulk pricing, bundle deals, or a multi-vendor marketplace where different sellers list products.",
    minHours: 80,
    maxHours: 200,
  },
  {
    id: "subscriptions",
    name: "Subscriptions & Memberships",
    description: "Charge users on a recurring basis or gate content by membership tier",
    details:
      "Allows you to charge users a recurring fee — weekly, monthly, or annually — in exchange for access to your app or specific features. This covers subscription plan setup, billing management, trial periods, and the ability for users to upgrade, downgrade, or cancel their plan. Also includes gating premium content or features so only paying members can access them.",
    factors:
      "A single subscription tier with straightforward access control is the quickest to build. Multiple tiers with different feature sets, annual versus monthly billing, family or team plans, grandfathered pricing, and prorated billing when plans change all add development time.",
    minHours: 40,
    maxHours: 120,
  },
  {
    id: "integrations",
    name: "Third-party Integrations",
    description: "Connect your app to external tools and services",
    details:
      "Connects your app to the other software your business runs on — things like a CRM, accounting software, email marketing tools, calendar services, or automation platforms like Zapier. This lets data flow between your app and the tools your team already uses, reducing manual work and keeping everything in sync.",
    factors:
      "A single, well-documented integration with a reliable service is on the lower end. The timeline grows with the number of integrations, how complex the data mapping is, whether real-time sync is needed, or if the external service has a poorly documented or unstable API.",
    minHours: 30,
    maxHours: 120,
  },
  {
    id: "multi-language",
    name: "Multi-language Support",
    description: "Make your app available in more than one language",
    details:
      "Sets up your app to display content in multiple languages based on the user's preference or device settings. This includes building the translation infrastructure, separating all user-facing text from the code so it can be translated, and handling language-specific formatting for things like dates, numbers, and currencies. Actual translation of the content is a separate cost.",
    factors:
      "The foundational setup is a fixed cost regardless of how many languages you add. From there, the main driver is the amount of text in your app. Right-to-left language support (Arabic, Hebrew) requires additional layout work. Dynamic content that changes frequently also needs ongoing translation management.",
    minHours: 40,
    maxHours: 100,
  },
  {
    id: "qr-barcode",
    name: "QR & Barcode Scanning",
    description: "Scan QR codes or barcodes using the device camera",
    details:
      "Gives your app the ability to use the device camera to scan QR codes and barcodes and take action on the result. Common uses include product lookups, event check-ins, loyalty program scans, inventory management, and contactless menus or payments. Includes camera permission handling and appropriate feedback when a scan is successful or fails.",
    factors:
      "Scanning a code and displaying a result is straightforward. The scope grows if you need to generate scannable codes within the app, support multiple barcode formats, build out inventory or check-in management around the scan, or integrate scan results with a product database.",
    minHours: 20,
    maxHours: 60,
  },

  {
    id: "offline-mode",
    name: "Offline Mode",
    description: "Keep your app usable when there is no internet connection",
    details:
      "Allows users to continue using your app even without a network connection, with their actions and data syncing automatically once they reconnect. This involves caching content locally on the device, queuing any changes made offline, and handling conflicts if the same data was changed in multiple places before syncing.",
    factors:
      "Basic read-only caching so users can view previously loaded content is the simplest form. Full offline-first functionality — where users can create, edit, and delete data while offline and have it sync reliably — is significantly more complex. Conflict resolution (what happens when two people edit the same record offline) is the hardest part.",
    minHours: 60,
    maxHours: 160,
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    description: "How your app looks and feels across all screen sizes",
    details:
      "This covers everything visual — from early sketches and layouts to the final polished design your users will see. It includes choosing colors, fonts, and spacing, as well as making sure the app looks great on phones, tablets, and desktops. A good design phase also involves understanding your users' needs so the app is intuitive and easy to navigate.",
    factors:
      "The more screens and unique layouts your app needs, the more design work is involved. Custom artwork, animations, or in-depth user testing will push this toward the higher end. If there's an existing brand guide or design template to work from, that can bring the time down.",
    minHours: 80,
    maxHours: 200,
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
];

export const DEFAULT_HOURLY_RATE = 90;

export const AI_DEV_MULTIPLIER = 0.75;

export const MAINTENANCE_PERCENT_MIN = 15;
export const MAINTENANCE_PERCENT_MAX = 25;
export const AI_MAINTENANCE_PERCENT_MIN = 25;
export const AI_MAINTENANCE_PERCENT_MAX = 35;
