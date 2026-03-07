"use client";

import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { BackLink } from "@/app/_components/BackLink";
import { PROVIDERS } from "@/features/core/data/providers";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function ProvidersPage() {
  const router = useRouter();

  const handleRunEstimate = (providerId: string) => {
    sessionStorage.setItem("selectedProviderId", providerId);
    router.push("/#calculator");
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <BackLink />
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Service Providers
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.75 }}>
        Select a provider to pre-load their hourly rate into the cost estimator. Rates shown
        are typical starting points and may vary by project scope and complexity.
      </Typography>

      <Grid container spacing={3}>
        {PROVIDERS.map((provider) => (
          <Grid key={provider.id} size={{ xs: 12, sm: 6 }}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "border-color 0.15s, box-shadow 0.15s",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: "0 2px 12px rgba(99,102,241,0.12)",
                },
              }}
            >
              <CardContent sx={{ flex: 1, pb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 1 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                    {provider.name}
                  </Typography>
                  <Box
                    sx={{
                      px: 1.25,
                      py: 0.4,
                      borderRadius: 1.5,
                      bgcolor: "rgba(99,102,241,0.09)",
                      color: "primary.dark",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {currencyFormatter.format(provider.hourlyRate)}/hr
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1.5 }}>
                  {provider.description}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {provider.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.72rem",
                        bgcolor: "grey.100",
                        color: "text.secondary",
                      }}
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2, pt: 0.5, gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={() => handleRunEstimate(provider.id)}
                  sx={{
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": { boxShadow: "none" },
                  }}
                >
                  Run Estimate
                </Button>
                {provider.website && (
                  <Button
                    size="small"
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textTransform: "none", flexShrink: 0 }}
                  >
                    Website
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
