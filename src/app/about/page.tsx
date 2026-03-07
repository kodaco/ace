import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { BackLink } from "@/app/_components/BackLink";
import { AboutContent } from "@/app/_content/AboutContent";

export const metadata = { title: "About — App Cost Estimator" };

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <BackLink />
      <Typography variant="h4" fontWeight={700} gutterBottom>
        About
      </Typography>
      <AboutContent />
    </Container>
  );
}
