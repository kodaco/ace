"use client";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { SavedEstimate, deleteSavedEstimate } from "@/features/core/services/estimate-storage";
import { CURRENCIES } from "@/features/core/data/currencies";

interface SavedEstimatesDrawerProps {
  open: boolean;
  onClose: () => void;
  savedEstimates: SavedEstimate[];
  onLoad: (saved: SavedEstimate) => void;
  onDelete: (id: string) => void;
}

function formatCost(usdAmount: number, currencyCode: string): string {
  const currency = CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0];
  const converted = Math.round(usdAmount * currency.rateFromUsd);
  return `${currency.symbol}${converted.toLocaleString()}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SavedEstimatesDrawer({
  open,
  onClose,
  savedEstimates,
  onLoad,
  onDelete,
}: SavedEstimatesDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 360 }, p: 0 } }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" fontWeight={600}>
          Saved Estimates
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2 }}>
        {savedEstimates.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <BookmarkBorderIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1.5 }} />
            <Typography variant="body2" color="text.secondary">
              No saved estimates yet.
            </Typography>
            <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
              Run an estimate and click "Save Estimate" to store it here.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {savedEstimates.map((saved) => (
              <Box
                key={saved.id}
                sx={{
                  p: 1.75,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { borderColor: "primary.main", bgcolor: "rgba(99,102,241,0.02)" },
                  transition: "border-color 0.15s, background-color 0.15s",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ flex: 1, mr: 1 }}>
                    {saved.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(saved.id)}
                    aria-label="Delete saved estimate"
                    sx={{ color: "text.disabled", "&:hover": { color: "error.main" } }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
                  {saved.featureCount} feature{saved.featureCount !== 1 ? "s" : ""} · {formatCost(saved.midpointCost, saved.config.currencyCode)} midpoint · {formatDate(saved.savedAt)}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => { onLoad(saved); onClose(); }}
                  sx={{ mt: 1.25, textTransform: "none", fontSize: "0.75rem", borderRadius: 1.5 }}
                >
                  Restore estimate
                </Button>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {savedEstimates.length > 0 && (
        <Box sx={{ px: 2.5, py: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography variant="caption" color="text.disabled">
            Up to 5 estimates saved locally in your browser.
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}
