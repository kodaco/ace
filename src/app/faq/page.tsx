import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { BackLink } from "@/app/_components/BackLink";
import { FaqContent } from "@/app/_content/FaqContent";

export const metadata = { title: "FAQ - App Cost Estimator" };

export default function FaqPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }} id="faq-top">
      <BackLink />
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
        Common questions from business owners and founders planning their first app or website.
      </Typography>
      <FaqContent />
    </Container>
  );
}
