"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { PREDEFINED_FEATURES } from "@/features/core/data/predefined-features";

// MUI md breakpoint in px
const MD_BREAKPOINT = 900;

function PhoneMockup() {
  return (
    <Box
      sx={{
        position: "relative",
        width: 240,
        mx: "auto",
        filter: "drop-shadow(0 32px 48px rgba(0,0,0,0.5))",
      }}
    >
      {/* Phone frame */}
      <Box
        sx={{
          width: 240,
          height: 480,
          bgcolor: "#111",
          borderRadius: "36px",
          border: "6px solid #2a2a2a",
          overflow: "hidden",
          position: "relative",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
        }}
      >
        {/* Notch */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 24,
            bgcolor: "#111",
            borderRadius: "0 0 16px 16px",
            zIndex: 2,
          }}
        />

        {/* Screen */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 5,
            px: 2,
            gap: 1.5,
          }}
        >
          {/* App icon */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              boxShadow: "0 4px 16px rgba(129,140,248,0.4)",
            }}
          >
            🧮
          </Box>

          {/* App name */}
          <Typography
            sx={{ color: "#fff", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.02em" }}
          >
            App Cost Estimator
          </Typography>

          {/* Mock cost display */}
          <Box
            sx={{
              mt: 1,
              width: "100%",
              bgcolor: "rgba(255,255,255,0.08)",
              borderRadius: 3,
              p: 1.5,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Estimated Cost
            </Typography>
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem", mt: 0.25 }}>
              ~$84,000
            </Typography>
          </Box>

          {/* Mock feature rows */}
          {[
            { label: "Auth", color: "#818cf8" },
            { label: "Payments", color: "#a78bfa" },
            { label: "Push Notifications", color: "#c4b5fd" },
          ].map(({ label, color }) => (
            <Box
              key={label}
              sx={{
                width: "100%",
                bgcolor: "rgba(255,255,255,0.06)",
                borderRadius: 2,
                px: 1.5,
                py: 0.75,
                display: "flex",
                alignItems: "center",
                gap: 1,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color, flexShrink: 0 }} />
              <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: "0.6rem" }}>
                {label}
              </Typography>
              <Box sx={{ ml: "auto", width: 28, height: 6, borderRadius: 1, bgcolor: "rgba(255,255,255,0.15)" }} />
            </Box>
          ))}

          {/* Mock CTA button */}
          <Box
            sx={{
              mt: 1,
              width: "100%",
              height: 32,
              borderRadius: 2,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "#fff", fontSize: "0.6rem", fontWeight: 600 }}>
              Calculate Estimate
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Glow beneath phone */}
      <Box
        sx={{
          position: "absolute",
          bottom: -24,
          left: "50%",
          transform: "translateX(-50%)",
          width: 160,
          height: 24,
          background: "radial-gradient(ellipse, rgba(99,102,241,0.35) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </Box>
  );
}

export function AppHero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || window.innerWidth < MD_BREAKPOINT) return;
      contentRef.current.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    };

    const handleResize = () => {
      if (!contentRef.current || window.innerWidth < MD_BREAKPOINT) {
        contentRef.current!.style.transform = "none";
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0d1117 100%)",
        position: "relative",
        overflow: "hidden",
        // Fill the viewport below the sticky header
        minHeight: { xs: "calc(100svh - 56px)", sm: "calc(100svh - 64px)" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: { xs: 8, md: 10 },
      }}
    >
      {/* Radial accent glow */}
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          left: "30%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg">
        <Box
          ref={contentRef}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 4, md: 8 },
            flexDirection: { xs: "column", md: "row" },
            willChange: "transform",
          }}
        >
          {/* Left: text */}
          <Box sx={{ flex: 1, minWidth: 0, textAlign: { xs: "center", md: "left" } }}>
            <Chip
              label="Free · No signup required"
              size="small"
              sx={{
                mb: 3,
                bgcolor: "rgba(99,102,241,0.15)",
                color: "#a5b4fc",
                border: "1px solid rgba(99,102,241,0.3)",
                fontWeight: 500,
                fontSize: "0.75rem",
                "& .MuiChip-label": { px: 1.5 },
              }}
            />

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3.25rem" },
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: "#fff",
                mb: 2,
              }}
            >
              Know your build cost{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(90deg, #818cf8, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                before you start.
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.55)",
                fontWeight: 400,
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.6,
                mb: 1.5,
              }}
            >
              Stop guessing. Start planning with confidence.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.38)",
                lineHeight: 1.7,
                maxWidth: { xs: "100%", md: 480 },
              }}
            >
              Select the features your app or website needs, set your hourly rate,
              and get an instant cost and timeline estimate. No account needed.
            </Typography>

            <Box sx={{ mt: 4, display: "flex", justifyContent: { xs: "center", md: "flex-start" } }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
                  "&:hover": { boxShadow: "0 6px 32px rgba(99,102,241,0.45)" },
                }}
              >
                Get Started
              </Button>
            </Box>

            <Stack
              direction="row"
              spacing={3}
              sx={{
                mt: 4,
                justifyContent: { xs: "center", md: "flex-start" },
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {[
                { value: `${Math.floor(PREDEFINED_FEATURES.length / 10) * 10}+`, label: "Features covered" },
                { value: "< 1 min", label: "To get an estimate" },
                { value: "Free", label: "Always" },
              ].map(({ value, label }) => (
                <Box key={label}>
                  <Typography sx={{ color: "#a5b4fc", fontWeight: 700, fontSize: "1.1rem" }}>
                    {value}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Right: phone mockup */}
          <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
              mt: { xs: 5, md: 0 },
            }}
          >
            <PhoneMockup />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
