import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

interface Item {
  name: string;
  cost?: string;
  note: string;
}

interface Section {
  heading: string;
  intro?: string;
  items: Item[];
}

const SECTIONS: Section[] = [
  {
    heading: "App Store & Distribution Accounts",
    intro:
      "Before you can publish an app, you need developer accounts with Apple and Google. Budget time for these, not just money — especially for Apple.",
    items: [
      {
        name: "Apple Developer Program",
        cost: "$99/year",
        note:
          "Required to publish anything on the iOS App Store. If you're enrolling as an organization rather than an individual, Apple requires a DUNS number (see below), and the review process can take one to four weeks. Start this early.",
      },
      {
        name: "Google Play Developer Account",
        cost: "$25 one-time",
        note:
          "A single payment that gives you permanent access to publish on Google Play. Approval is usually fast, often within a day or two.",
      },
    ],
  },
  {
    heading: "DUNS Number",
    intro:
      "A DUNS number is a unique identifier for your organization issued by Dun & Bradstreet. Apple requires one when enrolling a business or nonprofit in the Developer Program.",
    items: [
      {
        name: "DUNS for Nonprofits and Organizations",
        cost: "Free (standard) or ~$229 (expedited)",
        note:
          "The standard process is free but can take 30 business days or more. If you're close to a launch deadline, the expedited option through Dun & Bradstreet's website can turn it around in a few days. This is a common and painful surprise for nonprofits that leave it too late.",
      },
    ],
  },
  {
    heading: "Domain Name",
    items: [
      {
        name: "Domain Registration",
        cost: "$10–20/year for common extensions",
        note:
          "A .com domain runs $10–20 per year through registrars like Namecheap or Google Domains. Premium or short domains can cost significantly more. You'll want to lock in your domain name early, since good ones get taken. Budget for annual renewal.",
      },
    ],
  },
  {
    heading: "Web Hosting and Cloud Infrastructure",
    intro:
      "Important: the estimates in this tool cover development hours only. They do not include what it costs to actually run your app after it's live. These are ongoing monthly costs that scale with your usage.",
    items: [
      {
        name: "Simple Website or Landing Page",
        cost: "$0–20/month",
        note:
          "If you just need a marketing site, platforms like Vercel, Netlify, or GitHub Pages host static sites for free. Adding a CMS or custom backend bumps the cost up.",
      },
      {
        name: "App Backend Hosting",
        cost: "$10–100+/month",
        note:
          "If your app has a server component (user accounts, a database, an API), you need a place to run it. Platforms like Render, Railway, and Fly.io are popular starting points with reasonable free tiers. AWS, Google Cloud, and Azure are more powerful but more complex to manage and can get expensive quickly if not configured carefully.",
      },
      {
        name: "Database",
        cost: "$0–25+/month to start",
        note:
          "Most modern databases offer a free tier that's fine for early users. Supabase, PlanetScale, and MongoDB Atlas are common choices. Costs increase as your data volume and traffic grow.",
      },
      {
        name: "File and Media Storage",
        cost: "Usage-based, often under $10/month early on",
        note:
          "If your app lets users upload photos, documents, or other files, those need to be stored somewhere. AWS S3 and Cloudinary are common options. Costs are usage-based and typically small in the early stages.",
      },
    ],
  },
  {
    heading: "Email and Notifications",
    items: [
      {
        name: "Transactional Email",
        cost: "Free up to a few thousand emails/month, then $20+/month",
        note:
          "If your app sends emails like account confirmations, password resets, or receipts, you need a dedicated email service. Gmail and standard SMTP are not reliable for this at any scale. Resend, Postmark, and SendGrid are popular choices with generous free tiers.",
      },
      {
        name: "Push Notifications",
        cost: "Free to start with most providers",
        note:
          "Firebase Cloud Messaging (from Google) is free and widely used for push notifications on both iOS and Android. OneSignal is another popular option with a free tier. Costs typically only become a factor at high volume.",
      },
    ],
  },
  {
    heading: "Security and Password Management",
    intro:
      "A lot of early-stage teams share credentials over Slack or email. This is a serious security risk and creates real problems if someone leaves the team or an account gets compromised.",
    items: [
      {
        name: "Password Manager for Your Team",
        cost: "$3–7/user/month",
        note:
          "Tools like 1Password or Bitwarden let your team share credentials securely without anyone needing to send a password in a message. This is cheap insurance and a habit worth starting from day one.",
      },
      {
        name: "SSL Certificate",
        cost: "Usually free and included with modern hosting",
        note:
          "SSL encrypts the connection between your users and your app (the padlock in the browser). Most hosting platforms handle this automatically. If yours does not, Let's Encrypt provides free certificates.",
      },
      {
        name: "Two-Factor Authentication",
        cost: "Free",
        note:
          "Enable two-factor authentication on every account tied to your app: App Store Connect, Google Play Console, your hosting provider, your domain registrar, and your GitHub account. It takes five minutes and can save you from a complete disaster.",
      },
    ],
  },
  {
    heading: "Payment Processing",
    intro:
      "If your app charges users directly, the development estimate covers building the payment feature. But the transaction fees come out of every sale you make forever.",
    items: [
      {
        name: "Payment Processor (Stripe, Square, etc.)",
        cost: "2.9% + $0.30 per transaction (US standard)",
        note:
          "Stripe is the most common choice for apps. Factor these fees into your pricing model before you launch. International cards, subscriptions, and disputes each carry additional fees worth reading the fine print on.",
      },
      {
        name: "In-App Purchase Commission",
        cost: "15–30% taken by Apple and Google",
        note:
          "If you sell subscriptions or digital goods through the App Store or Google Play, Apple and Google take a cut of every transaction. For most apps it starts at 30%, dropping to 15% after a subscriber's first year or if you qualify as a small business. This is a major factor in your revenue model and a common shock for first-time app builders.",
      },
    ],
  },
  {
    heading: "Third-Party Services and APIs",
    intro:
      "Many common app features are powered by external services. These are typically usage-based and start cheap, but can add up as your app grows.",
    items: [
      {
        name: "Maps and Location",
        cost: "Free up to a monthly threshold, then usage-based",
        note:
          "Google Maps is the most widely used mapping service, but it charges once you exceed the free monthly credit. Mapbox is a popular alternative with different pricing. If your app relies heavily on maps, model out what your costs look like at different user volumes before you launch.",
      },
      {
        name: "SMS Messaging",
        cost: "$0.0079–0.015+ per message",
        note:
          "If your app sends SMS messages for verification codes, appointment reminders, or alerts, services like Twilio or Vonage charge per message. Costs are small per message but add up at scale.",
      },
      {
        name: "AI Features",
        cost: "Usage-based, highly variable",
        note:
          "If your app uses AI features powered by external AI services, you pay per request based on how much data is processed. This can be nearly free during development and testing, but production costs depend heavily on how often users trigger AI features and how complex the prompts are. Prototype your usage and estimate before going live.",
      },
    ],
  },
  {
    heading: "Legal and Business Basics",
    items: [
      {
        name: "Privacy Policy and Terms of Service",
        cost: "Free to generate with tools, $300–1,500+ if lawyer-drafted",
        note:
          "Both Apple and Google require a privacy policy to publish an app. You also need terms of service if users are agreeing to anything. Tools like Termly or similar services can generate these quickly for free or low cost. For regulated industries (healthcare, finance, children's apps), have a real lawyer review them.",
      },
      {
        name: "Business Entity and Insurance",
        cost: "Varies by state and structure",
        note:
          "If you're building an app commercially, running it as a registered LLC or corporation limits your personal liability. Filing fees vary by state. Business insurance (errors and omissions, general liability) is worth considering if your app handles sensitive data or financial transactions.",
      },
    ],
  },
  {
    heading: "App Store Listing Assets",
    intro:
      "Often overlooked until the week before launch. You cannot submit to the App Store without these.",
    items: [
      {
        name: "App Icon",
        cost: "Typically included in design work, or $50–300 if done separately",
        note:
          "Apple and Google require a high-resolution app icon in specific sizes. If your main design work did not include a polished icon, budget time and money for one.",
      },
      {
        name: "App Store Screenshots and Preview Video",
        cost: "$0 if done in-house, $200–800+ if outsourced",
        note:
          "Both stores require screenshots showing your app in action, formatted to exact device sizes. A short preview video is optional but improves conversion. These take longer to produce than most people expect.",
      },
    ],
  },
];

export function GotchasContent() {
  return (
    <Stack spacing={5}>
      {SECTIONS.map(({ heading, intro, items }) => (
        <Box key={heading}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {heading}
          </Typography>

          {intro && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.8, mb: 2 }}
            >
              {intro}
            </Typography>
          )}

          <Stack spacing={2}>
            {items.map(({ name, cost, note }) => (
              <Box
                key={name}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "grey.50",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0.5, sm: 2 },
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                    {name}
                  </Typography>
                  {cost && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "primary.dark",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        bgcolor: "rgba(99,102,241,0.08)",
                        px: 1.25,
                        py: 0.35,
                        borderRadius: 1,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {cost}
                    </Typography>
                  )}
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.8 }}
                >
                  {note}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
