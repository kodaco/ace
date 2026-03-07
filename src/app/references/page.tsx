import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { BackLink } from "@/app/_components/BackLink";
import { ReferencesContent } from "@/app/_content/ReferencesContent";

export const metadata = { title: "References — App Cost Estimator" };

export default function ReferencesPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <BackLink />
      <Typography variant="h4" fontWeight={700} gutterBottom>
        References
      </Typography>
      <ReferencesContent />
    </Container>
  );
}
