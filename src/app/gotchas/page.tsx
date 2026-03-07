import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { BackLink } from "@/app/_components/BackLink";
import { GotchasContent } from "@/app/_content/GotchasContent";

export const metadata = { title: "Before You Build - App Cost Estimator" };

export default function GotchasPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <BackLink />
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Before You Build
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.75 }}>
        The cost estimator covers development hours. But there are a lot of other costs and
        considerations that catch first-time builders off guard. Here is what to plan for
        before you start and after you launch.
      </Typography>
      <GotchasContent />
    </Container>
  );
}
