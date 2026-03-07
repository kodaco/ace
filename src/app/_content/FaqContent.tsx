"use client";

import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQS = [
  {
    category: "Cost and Budget",
    questions: [
      {
        q: "How accurate are these estimates?",
        a: "Think of them as a realistic ballpark, not a final price. They're based on industry averages from multiple research sources, so they'll get you in the right range before you start talking to developers. The actual cost of your project will depend on who you hire, how detailed your requirements are, and how much things change during development. Use this to understand the scale of what you're planning.",
      },
      {
        q: "Why do developer quotes vary so much?",
        a: "A few things drive the spread: where the developer or team is located, how experienced they are, what's included in the quote (some include design and testing, others don't), and how clearly you described what you want. Vague requirements lead to wide quotes. The more specific you can be about what your app needs to do, the more comparable and reliable the quotes you get will be.",
      },
      {
        q: "What causes projects to go over budget?",
        a: "The most common reason is scope creep — adding features or changing requirements once work has already started. Other culprits include unclear specs that lead to rework, unexpected complexity when connecting to outside services, and underestimating the time needed for testing and fixes. The best way to protect yourself is to nail down exactly what you want before development begins, and to treat any additions as a formal change with an updated cost.",
      },
      {
        q: "What hourly rate should I use?",
        a: "It depends on who you plan to hire. US and Canadian agencies typically run $100–200 per hour. US-based freelancers are usually $75–150 per hour. Teams in Eastern Europe often fall in the $40–80 range, and teams in Southeast Asia or Latin America are often $20–50. Lower rates don't necessarily mean lower quality, but you'll want to vet anyone you hire carefully regardless of where they're based.",
      },
    ],
  },
  {
    category: "What to Build",
    questions: [
      {
        q: "What is an MVP and should I build one?",
        a: "MVP stands for Minimum Viable Product. It's the smallest version of your app that still delivers real value to your first users. Almost every successful app started as an MVP. The idea is to test whether people actually want what you're building before you spend money on every feature you've imagined. Once real users give you feedback, you'll know where to invest next.",
      },
      {
        q: "What features should I include in my first version?",
        a: "Start with only what's essential to the core experience. Ask yourself: what does someone need to be able to do for the app to be useful at all? That's your first version. If you're building a booking app, that's browsing and booking. Loyalty points, push notifications, and reviews can come later. Cutting non-essential features early is the single most effective way to control your budget.",
      },
      {
        q: "Do I need a mobile app or a web app?",
        a: "A mobile app is downloaded from the App Store or Google Play and lives on someone's phone. A web app is accessed through a browser and works on any device without a download. Many businesses start with a web app since it's faster to build, easier to update, and reaches more people without requiring an app store approval process. You can always add a native mobile app later once you've validated your idea.",
      },
      {
        q: "Do I need both iPhone and Android versions?",
        a: "Not at first. Building for both platforms at the same time roughly doubles the development cost. Most startups pick one to start with based on where their target customers are. If you're targeting US consumers, iOS tends to skew toward higher-spending users. Android has a larger global share. Once you've launched and validated your product, expanding to the other platform is much easier.",
      },
    ],
  },
  {
    category: "Finding and Working with Developers",
    questions: [
      {
        q: "Should I hire a freelancer or an agency?",
        a: "Both can work well. Freelancers are usually more affordable and flexible, but you're relying on one person. If they get sick or busy, your project stalls. Agencies have full teams including designers, developers, and testers, and more structure around communication and delivery. They typically cost more but carry less risk. For a first project, a small agency or a highly-referred freelancer with a strong portfolio can both be solid choices.",
      },
      {
        q: "What should I have ready before talking to a developer?",
        a: "At minimum, you want a clear description of what your app does and who it's for, a list of the features you need, and a realistic sense of your budget. Wireframes or rough sketches of the screens are helpful if you have them, but not required. The more specific you can be about what the app needs to do, the more accurate the developer's quote will be. Vague briefs lead to wildly different estimates.",
      },
      {
        q: "How do I protect my idea when working with a developer?",
        a: "Ask your developer to sign a Non-Disclosure Agreement (NDA) before you share details. Most professional developers expect this and won't object. More importantly, make sure your contract is explicit about who owns the code when the project is done. You should own all of it. Without that in writing, ownership can get complicated.",
      },
    ],
  },
  {
    category: "Timeline and Launch",
    questions: [
      {
        q: "How long does it actually take to build an app?",
        a: "A focused app with five to eight features typically takes three to five months from start to a working product. That's assuming the requirements are clear and there aren't major changes along the way. Add at least four to six weeks on top of that for app store submission, review, and launch prep. Most projects take longer than expected, so building buffer into your timeline is always a good idea.",
      },
      {
        q: "How do I get my app into the App Store or Google Play?",
        a: "You or your developer submit the app for review once it's ready. Apple's App Store review typically takes one to three days but can occasionally stretch longer if there are questions. Google Play is usually faster. The review process checks that your app follows platform guidelines and doesn't have obvious technical issues. Plan for at least four weeks of total launch prep time to account for review feedback, any required fixes, and unexpected delays.",
      },
    ],
  },
  {
    category: "Ongoing Costs",
    questions: [
      {
        q: "What is maintenance and why does it cost money after launch?",
        a: "After your app launches, it will need ongoing attention. Operating system updates from Apple and Google can break things. Security vulnerabilities need to be patched. Third-party services your app connects to will change their APIs. Bugs will surface that testing didn't catch. Most apps budget somewhere between 15 and 25 percent of the original build cost per year to keep things running smoothly and up to date.",
      },
      {
        q: "What does the AI toggle change in the estimates?",
        a: "If your developer uses AI coding tools like Cursor or GitHub Copilot throughout the project, development time tends to be about 25% shorter on average. The tradeoff is that AI-generated code often needs more cleanup and debugging over time, so maintenance costs tend to run higher. The toggle adjusts both numbers to reflect that.",
      },
    ],
  },
  {
    category: "Alternatives",
    questions: [
      {
        q: "Can I use a no-code or low-code tool instead of hiring a developer?",
        a: "For many use cases, yes, and it's worth exploring before committing to custom development. Tools like Bubble, Webflow, and Glide can build fully functional apps at a fraction of the cost and time. The tradeoffs are limited customization, potential performance issues if your app grows, and dependency on the platform you build on. If your needs are straightforward and you don't need anything unusual, a no-code tool might be all you need.",
      },
    ],
  },
  {
    category: "Other Costs",
    questions: [
      {
        q: "What costs are not included in these estimates?",
        a: "The estimates here cover development hours only. They do not include the ongoing costs of running your app after it launches. Things like cloud hosting, database fees, your Apple Developer account ($99/year), Google Play ($25 one-time), a domain name, payment processing fees, transactional email services, and third-party API costs are all separate. Some of these are small, but a few, like Apple and Google's cut of in-app purchases (15–30%), can have a real impact on your business model. See the Before You Build page for a full breakdown.",
      },
      {
        q: "Where do infrastructure and cloud hosting costs fall?",
        a: "They are not part of the development estimate. Building the app and running the app are two different budgets. Development is a one-time cost to create it. Infrastructure is the ongoing monthly cost to keep it running, store user data, send emails, and serve traffic. A simple app might cost $20–50 per month to host. An app with heavy traffic, lots of stored files, or AI features can cost significantly more. The Before You Build page has a section on this with typical cost ranges.",
      },
    ],
  },
];

export function FaqContent() {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      {FAQS.map(({ category, questions }) => (
        <div key={category}>
          <Typography
            variant="overline"
            sx={{
              display: "block",
              fontWeight: 700,
              color: "primary.main",
              letterSpacing: "0.08em",
              mt: 4,
              mb: 1.5,
            }}
          >
            {category}
          </Typography>
          {questions.map(({ q, a }) => {
            const panelId = `${category}-${q}`;
            return (
              <Accordion
                key={q}
                expanded={expanded === panelId}
                onChange={handleChange(panelId)}
                disableGutters
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "8px !important",
                  mb: 1,
                  "&::before": { display: "none" },
                  "&.Mui-expanded": { borderColor: "primary.light" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
                  sx={{ px: 2.5, py: 0.5, minHeight: 52 }}
                >
                  <Typography variant="body1" fontWeight={500}>
                    {q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      ))}
    </>
  );
}
