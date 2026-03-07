import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { BackLink } from "@/app/_components/BackLink";
import { TermsContent } from "@/app/_content/TermsContent";

export const metadata = { title: "Terms of Service — App Cost Estimator" };

export default function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <BackLink />
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Terms of Service
      </Typography>
      <TermsContent />
    </Container>
  );
}
