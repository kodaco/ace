import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Link from "next/link";

interface HourlyRateInputProps {
  value: number;
  onChange: (rate: number) => void;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function HourlyRateInput({ value, onChange }: HourlyRateInputProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));

  // Sync display when parent resets value
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleAccept = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setInputValue(String(value));
    setEditing(false);
  };

  return (
    <Card variant="outlined">
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Hourly Rate
          </Typography>
          {/* <Typography
            component={Link}
            href="/providers"
            variant="body2"
            sx={{
              color: "primary.main",
              fontWeight: 500,
              fontSize: "0.8rem",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            View provider rates →
          </Typography> */}
        </Box>

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
                "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]": { MozAppearance: "textfield" },
              }}
            />
            <Button size="small" variant="contained" onClick={handleAccept} sx={{ fontWeight: 600, textTransform: "none", boxShadow: "none", "&:hover": { boxShadow: "none" } }}>
              Set Rate
            </Button>
            <Button size="small" onClick={handleCancel} sx={{ fontWeight: 500, textTransform: "none", color: "text.secondary" }}>
              Cancel
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: "primary.dark" }}>
              {currencyFormatter.format(value)}<Typography component="span" variant="body2" color="text.secondary" fontWeight={400}> / hr</Typography>
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setEditing(true)}
              sx={{ fontWeight: 500, textTransform: "none", fontSize: "0.75rem" }}
            >
              Change Rate
            </Button>
          </Box>
        )}

        {/* <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, lineHeight: 1.5 }}>
          Not sure what to enter? View local provider rates to see what teams in your area typically charge.
        </Typography> */}
      </Box>
    </Card>
  );
}
