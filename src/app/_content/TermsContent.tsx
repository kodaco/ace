import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export function TermsContent() {
  return (
    <Stack spacing={3.5}>
      <Typography variant="body2" color="text.secondary">
        Last updated: March 2026
      </Typography>

      {[
        {
          heading: "Acceptance of Terms",
          body: "By using App Cost Estimator, you agree to these terms. If you do not agree, please do not use the tool.",
        },
        {
          heading: "Nature of Estimates",
          body: "All cost and timeline estimates provided by this tool are for planning and informational purposes only. They are based on industry averages and should not be treated as quotes, guarantees, or professional advice. Actual development costs depend on team location, experience level, technical complexity, scope changes, and many other project-specific factors.",
        },
        {
          heading: "No Warranty",
          body: "This tool is provided \"as is\" without warranty of any kind, express or implied. We make no representations about the accuracy, completeness, or suitability of the estimates for any particular project or purpose.",
        },
        {
          heading: "Limitation of Liability",
          body: "To the fullest extent permitted by law, App Cost Estimator and its creators shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of, or reliance on, the estimates produced by this tool.",
        },
        {
          heading: "Intellectual Property",
          body: "The content, design, and code of this application are the property of their respective creators. You may use the tool freely for personal and commercial planning purposes, but you may not reproduce or redistribute the application itself without permission.",
        },
        {
          heading: "Changes to Terms",
          body: "We reserve the right to modify these terms at any time. Continued use of the tool after changes are posted constitutes your acceptance of the revised terms.",
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
