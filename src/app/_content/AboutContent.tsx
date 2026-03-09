import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export function AboutContent() {
  return (
    <Stack spacing={3.5}>
      {[
        {
          heading: "What is this?",
          body: "ace is a free tool for getting a ballpark cost on a software project, whether that's a mobile app, a web app, or a website. Pick the features you need, plug in an hourly rate, and get a number in under a minute. No signup, no sales calls.",
        },
        {
          heading: "Who is it for?",
          body: "Mostly people in the early stages of planning something: a solo founder trying to figure out if an idea is affordable, a small business owner who got a quote and wants a sanity check, a freelancer putting together a proposal, or someone who just wants to know what building their idea would actually cost.",
        },
        {
          heading: "How are the numbers calculated?",
          body: "Each feature has a low and high hour range based on published industry research from sources like Clutch, GoodFirms, and Netguru. The tool adds up those hours, applies a maintenance buffer, and multiplies by your hourly rate. The main number shown is the midpoint. Tap \"View cost range\" in the results to see the full spread.",
        },
        {
          heading: "What does the AI toggle do?",
          body: "If you plan to build with AI coding tools like Cursor or GitHub Copilot, the toggle cuts development hours by about 25%, based on enterprise research from Microsoft and Accenture. The tradeoff is that AI-generated code tends to accumulate more technical debt and require more debugging, so the maintenance estimate goes up too.",
        },
        {
          heading: "How accurate is this?",
          body: "Think of it as a starting point, not a final price. The actual cost of your app or website will depend on who you hire, how complex your requirements turn out to be, and how much things change along the way. Use this to get a rough sense of scale before you start talking to developers.",
        },
        {
          heading: "Is anything saved or tracked?",
          body: "No. Everything runs in your browser. Nothing is sent to a server and no account is needed.",
        },
      ].map(({ heading, body }) => (
        <div key={heading}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {heading}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
            {body}
          </Typography>
        </div>
      ))}
    </Stack>
  );
}
