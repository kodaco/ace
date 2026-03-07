import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";

const AI_SOURCES = [
  {
    title: "Microsoft & Accenture: AI Productivity Research",
    url: "https://www.javacodegeeks.com/2025/12/ai-assisted-coding-in-2026-how-github-copilot-cursor-and-amazon-q-are-reshaping-developer-workflows.html",
    description:
      "Enterprise study finding roughly a 26% average productivity gain from AI coding tools across development teams of mixed experience levels. Used as the basis for the 25% build time reduction applied by this tool's AI toggle.",
  },
  {
    title: "GitClear: Code Quality in AI-Assisted Codebases",
    url: "https://leaddev.com/technical-direction/how-ai-generated-code-accelerates-technical-debt",
    description:
      "Analysis tracking an 8x increase in repeated or copy-pasted code blocks in AI-assisted projects between 2021 and 2024, along with rising rates of code that gets written and then quickly rewritten or removed. Informs the higher maintenance percentage applied when the AI toggle is on.",
  },
  {
    title: "Harness: State of Software Delivery 2025",
    url: "https://devops.com/ai-in-software-development-productivity-at-the-cost-of-code-quality-2/",
    description:
      "Survey finding that most developers spend more time tracking down and fixing bugs in AI-generated code compared to code written by hand, and more time resolving security issues.",
  },
  {
    title: "Google DORA: Accelerate State of DevOps 2024",
    url: "https://www.infoq.com/news/2025/11/ai-code-technical-debt/",
    description:
      "Annual software delivery research report finding a 7.2% drop in release stability in teams with higher AI coding tool usage, alongside some benefits to review speed and documentation.",
  },
  {
    title: "METR: Measuring AI Coding Productivity (Independent Study)",
    url: "https://ucstrategies.com/news/copilot-vs-cursor-vs-codeium-which-ai-coding-assistant-actually-wins-in-2026/",
    description:
      "Controlled study of 16 experienced open-source developers finding they were 19% slower when using AI tools, even though they believed they were 20% faster. Highlights that results vary significantly by experience level and how complex the work is.",
  },
];

const SOURCES = [
  {
    title: "Netguru: Mobile App Development Cost",
    url: "https://www.netguru.com/blog/mobile-app-development-cost",
    description:
      "Feature-level hour breakdowns for common mobile app components including login, messaging, and admin panels.",
  },
  {
    title: "GetNerdify: Mobile App Development Cost Calculator",
    url: "https://getnerdify.com/blog/mobile-app-development-cost-calculator/",
    description:
      "Per-feature hour ranges across a wide set of app capabilities used to benchmark low and high estimates.",
  },
  {
    title: "Clutch: Cost to Build a Mobile App Survey",
    url: "https://clutch.co/app-developers/resources/cost-build-mobile-app-survey-2015",
    description:
      "Survey of 10 development firms with hour ranges for wireframing, design, and core feature development.",
  },
  {
    title: "GoodFirms: Cost to Develop an App",
    url: "https://www.goodfirms.co/resources/cost-to-develop-an-app",
    description:
      "Research on app development costs by complexity level, based on developer surveys across GoodFirms listings.",
  },
  {
    title: "Cleveroad: How Much Does It Cost to Develop an App",
    url: "https://www.cleveroad.com/blog/how-much-does-it-cost-to-develop-an-app/",
    description:
      "Cost breakdowns for features including location services, payments, and real-time messaging, organized by complexity.",
  },
  {
    title: "Stormotion: App Maintenance Cost",
    url: "https://stormotion.io/blog/app-maintenance-cost/",
    description:
      "Analysis of annual maintenance cost as a percentage of initial build cost, citing 15 to 35% depending on app complexity and activity level.",
  },
  {
    title: "Appinventiv: Software Maintenance Cost",
    url: "https://appinventiv.com/blog/software-maintenance-cost/",
    description:
      "Breakdown of what drives ongoing maintenance costs, including operating system updates, security patches, third-party service changes, and performance monitoring.",
  },
  {
    title: "TopFlight Apps: App Development Costs",
    url: "https://topflightapps.com/ideas/app-development-costs/",
    description:
      "Design-phase hour estimates and overall cost ranges for consumer and business app categories.",
  },
  {
    title: "Mind Studios: How Much Does It Cost to Create an App",
    url: "https://themindstudios.com/blog/how-much-does-it-cost-to-create-an-app/",
    description:
      "Feature complexity breakdowns and hour estimates for different phases of mobile app development.",
  },
  {
    title: "Business of Apps: App Development Cost Research",
    url: "https://www.businessofapps.com/app-developers/research/app-development-cost/",
    description:
      "Broad industry research on development cost factors including team location, platform choice, and feature scope.",
  },
];

function SourceList({ sources }: { sources: typeof SOURCES }) {
  return (
    <>
      {sources.map(({ title, url, description }, i) => (
        <Stack key={url} spacing={0.75} sx={{ py: 2, borderBottom: i < sources.length - 1 ? "1px solid" : "none", borderColor: "divider" }}>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
            fontWeight={600}
            underline="hover"
          >
            {title}
          </Link>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
            {description}
          </Typography>
        </Stack>
      ))}
    </>
  );
}

export function ReferencesContent() {
  return (
    <Stack spacing={1}>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, mb: 1 }}>
        The hour ranges and maintenance percentages in this tool are based on published research
        from reputable software development industry sources. Estimates represent averages
        across multiple firms and project types. Actual costs for any specific project will vary.
        All sources were reviewed in early 2026.
      </Typography>

      <Divider sx={{ my: 1 }} />
      <SourceList sources={SOURCES} />

      <Divider sx={{ mt: 2, mb: 1 }} />

      <Typography variant="subtitle1" fontWeight={600} sx={{ pt: 0.5 }}>
        AI Toggle
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, mb: 1 }}>
        The 25% build time reduction and higher maintenance estimates applied by the
        AI toggle are based on the following research.
      </Typography>
      <SourceList sources={AI_SOURCES} />
    </Stack>
  );
}
