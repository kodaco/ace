import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { BackLink } from "@/app/_components/BackLink";
import { PrivacyContent } from "@/app/_content/PrivacyContent";

export const metadata = { title: "Privacy Policy — ace" };

export default function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <BackLink />
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Privacy Policy
      </Typography>
      <PrivacyContent />
    </Container>
  );
}
