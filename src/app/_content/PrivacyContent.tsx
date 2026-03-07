import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export function PrivacyContent() {
  return (
    <Stack spacing={3.5}>
      <Typography variant="body2" color="text.secondary">
        Last updated: March 2026
      </Typography>

      {[
        {
          heading: "Information We Collect",
          body: "App Cost Estimator does not require you to create an account or provide any personal information to use the tool. We do not collect, store, or transmit your feature selections, hourly rate, or estimate results to any server.",
        },
        {
          heading: "Analytics",
          body: "We may use privacy-respecting, anonymized analytics to understand general usage patterns (e.g., page views and session counts). No personally identifiable information is collected as part of this process.",
        },
        {
          heading: "Cookies",
          body: "This site does not use tracking cookies or advertising cookies. Any cookies set are strictly necessary for the site to function (e.g., session state).",
        },
        {
          heading: "Third-Party Services",
          body: "The tool is hosted on Vercel and uses standard CDN infrastructure. Their respective privacy policies apply to the delivery of this site. We do not share any data with third-party advertising networks.",
        },
        {
          heading: "Children's Privacy",
          body: "This service is not directed at children under the age of 13. We do not knowingly collect personal information from children.",
        },
        {
          heading: "Changes to This Policy",
          body: "We may update this privacy policy from time to time. The date at the top of this page reflects the most recent revision.",
        },
        {
          heading: "Contact",
          body: "If you have questions about this privacy policy, please open an issue on our GitHub repository.",
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
