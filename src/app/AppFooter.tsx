import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import Link from "next/link";

export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0d1117 100%)",
        color: "rgba(255,255,255,0.6)",
        pt: 6,
        pb: 4,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        {/* Top row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "flex-start" }}
          spacing={4}
          sx={{ mb: 4 }}
        >
          {/* Brand */}
          <Box sx={{ maxWidth: 280 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <CalculateOutlinedIcon
                sx={{ fontSize: 22, color: "#818cf8" }}
              />
              <Typography 
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.01em" }}
              >
                ace
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ lineHeight: 1.6, color: "rgba(255,255,255,0.4)" }}>
              Get accurate development cost estimates for your next app. No signup required.
            </Typography>
          </Box>

          {/* Links */}
          <Stack direction="row" spacing={6}>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  display: "block",
                  mb: 1.5,
                }}
              >
                Tool
              </Typography>
              <Stack spacing={1.25}>
                <Link href="/about" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.5)", transition: "color 0.15s", "&:hover": { color: "rgba(255,255,255,0.9)" } }}
                  >
                    About
                  </Typography>
                </Link>
                <Link href="/#how-it-works" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.5)", transition: "color 0.15s", "&:hover": { color: "rgba(255,255,255,0.9)" } }}
                  >
                    How It Works
                  </Typography>
                </Link>
                <Link href="/faq" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.5)", transition: "color 0.15s", "&:hover": { color: "rgba(255,255,255,0.9)" } }}
                  >
                    FAQs
                  </Typography>
                </Link>
                <Link href="/gotchas" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.5)", transition: "color 0.15s", "&:hover": { color: "rgba(255,255,255,0.9)" } }}
                  >
                    Before You Build
                  </Typography>
                </Link>
                {/* <Link href="/providers" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.5)", transition: "color 0.15s", "&:hover": { color: "rgba(255,255,255,0.9)" } }}
                  >
                    Service Providers
                  </Typography>
                </Link> */}
              </Stack>
            </Box>

            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  display: "block",
                  mb: 1.5,
                }}
              >
                Legal
              </Typography>
              <Stack spacing={1.25}>
                {[
                  { label: "Privacy", href: "/privacy" },
                  { label: "Terms", href: "/terms" },
                  { label: "References", href: "/references" },
                ].map(({ label, href }) => (
                  <Link key={href} href={href} style={{ textDecoration: "none" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        transition: "color 0.15s",
                        "&:hover": { color: "rgba(255,255,255,0.9)" },
                      }}
                    >
                      {label}
                    </Typography>
                  </Link>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 3 }} />

        {/* Bottom row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
        >
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)" }}>
            © {year} ace estimates are for planning purposes only.
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.25)" }}>
            Designed by koda co., Sun & Prairie Studios
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
