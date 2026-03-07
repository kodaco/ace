import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";

const STEPS = [
  {
    number: "01",
    Icon: ListAltOutlinedIcon,
    title: "Pick your features",
    body: "Check off the features your app or website needs. Not sure what something includes? Tap the arrow on any feature to see a plain-English breakdown of what goes into it and what makes it cheaper or more expensive.",
  },
  {
    number: "02",
    Icon: TuneOutlinedIcon,
    title: "Set your rate",
    body: "Enter what you expect to pay per hour, whether that's a freelancer, a local agency, or an overseas team. You can also flip on the AI-assisted toggle if you plan to use tools like Cursor or Copilot to speed things up.",
  },
  {
    number: "03",
    Icon: InsightsOutlinedIcon,
    title: "See your number",
    body: "Hit Calculate and you'll get a realistic cost and timeline based on real industry data. If you want more detail, expand the summary to see the full range and what could push the price up or down.",
  },
];

export function HowItWorks() {
  return (
    <Box
      id="how-it-works"
      sx={{
        bgcolor: "grey.50",
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "divider",
        py: { xs: 8, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              letterSpacing: "0.1em",
              display: "block",
              mb: 1,
            }}
          >
            How It Works
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ letterSpacing: "-0.02em", mb: 1.5 }}
          >
            Three steps to a real number
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 520, mx: "auto", lineHeight: 1.7 }}
          >
            No account needed, no forms to fill out. Just answer a few
            questions about your app and walk away with a number you can
            actually use.
          </Typography>
        </Box>

        {/* Steps */}
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {STEPS.map(({ number, Icon, title, body }) => (
            <Grid key={number} size={{ xs: 12, md: 4 }}>
              <Box>
                {/* Number + icon row */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "2.5rem",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      color: "primary.main",
                      opacity: 0.2,
                      userSelect: "none",
                    }}
                  >
                    {number}
                  </Typography>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ color: "#fff", fontSize: 22 }} />
                  </Box>
                </Box>

                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  {body}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
