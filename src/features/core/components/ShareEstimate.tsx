"use client";

import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import EmailIcon from "@mui/icons-material/Email";
import { AppFeature, EstimateResult } from "@/features/core/models";
import { shareEstimateByEmail } from "@/features/core/services/estimate-email";

interface ShareEstimateProps {
  estimate: EstimateResult | null;
  selectedFeatures: AppFeature[];
  loading?: boolean;
}

export function ShareEstimate({ estimate, selectedFeatures, loading }: ShareEstimateProps) {
  const [toEmail, setToEmail] = useState("");

  const handleShare = () => {
    shareEstimateByEmail(estimate!, selectedFeatures, toEmail);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Share This Estimate
        </Typography>

        {loading ? (
          <>
            <Skeleton variant="text" width="72%" sx={{ fontSize: "0.875rem" }} />
            <Box sx={{ display: "flex", gap: 2, mt: 2, alignItems: "flex-start" }}>
              <Skeleton variant="rounded" height={40} sx={{ flex: 1 }} />
              <Skeleton variant="rounded" width={148} height={40} />
            </Box>
          </>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary">
              Send a copy of this estimate to yourself or a colleague.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2, alignItems: "flex-start" }}>
              <TextField
                label="Email address"
                type="email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="you@example.com"
                size="small"
                sx={{
                  flex: 1,
                  "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
                    WebkitBoxShadow: "0 0 0 100px #fff inset",
                    WebkitTextFillColor: "inherit",
                  },
                }}
              />
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={handleShare}
                disabled={!estimate}
              >
                Preview &amp; Share
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
