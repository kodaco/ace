"use client";

import { useState } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "next/link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Provider } from "@/features/core/data/providers";

interface ProviderRateCardProps {
  provider: Provider;
  onSetRate: (rate: number) => void;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function ProviderRateCard({ provider, onSetRate }: ProviderRateCardProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(provider.hourlyRate));

  const handleAccept = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onSetRate(parsed);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setInputValue(String(provider.hourlyRate));
    setEditing(false);
  };

  return (
    <Card variant="outlined" sx={{ flex: 1 }}>
      <Box sx={{ p: 2 }}>
        {/* Header row */}
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, fontSize: "0.65rem" }}>
              Estimating with
            </Typography>
            <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
              {provider.name}
            </Typography>
          </Box>
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

        {/* Rate / edit row */}
        <Box sx={{ mt: 1.5 }}>
          {editing ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAccept();
                  if (e.key === "Escape") handleCancel();
                }}
                autoFocus
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/ hr</InputAdornment>,
                  },
                }}
                size="small"
                sx={{
                  width: 160,
                  "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": { WebkitAppearance: "none", margin: 0 },
                  "& input[type=number]": { MozAppearance: "textfield" },
                }}
              />
              <Button
                size="small"
                variant="contained"
                onClick={handleAccept}
                sx={{ fontWeight: 600, textTransform: "none", boxShadow: "none", "&:hover": { boxShadow: "none" } }}
              >
                Set Rate
              </Button>
              <Button
                size="small"
                onClick={handleCancel}
                sx={{ fontWeight: 500, textTransform: "none", color: "text.secondary" }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setEditing(true)}
                sx={{ fontWeight: 500, textTransform: "none", fontSize: "0.75rem" }}
              >
                Change Rate
              </Button>
              <Button
                size="small"
                endIcon={
                  <KeyboardArrowDownIcon
                    fontSize="small"
                    sx={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                }
                onClick={() => setOpen((v) => !v)}
                sx={{ fontWeight: 500, textTransform: "none", fontSize: "0.75rem", color: "text.secondary" }}
              >
                {open ? "Hide details" : "Show details"}
              </Button>
            </Box>
          )}
        </Box>

        {/* Collapsible details */}
        <Collapse in={open && !editing} timeout="auto">
          <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1.5 }}>
              {provider.description}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1.5 }}>
              {provider.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{ height: 22, fontSize: "0.72rem", bgcolor: "grey.100", color: "text.secondary" }}
                />
              ))}
            </Box>
            <Typography
              component={Link}
              href="/providers"
              variant="body2"
              sx={{ color: "primary.main", fontWeight: 500, fontSize: "0.8rem", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              View all providers →
            </Typography>
          </Box>
        </Collapse>
      </Box>
    </Card>
  );
}
