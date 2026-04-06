"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import AddIcon from "@mui/icons-material/Add";
import { AppFeature } from "@/features/core/models";

type FeatureSize = "small" | "medium" | "large";

const SIZE_HOURS: Record<FeatureSize, { min: number; max: number; label: string }> = {
  small:  { min: 10,  max: 30,  label: "Small (~20 hrs)" },
  medium: { min: 60,  max: 100, label: "Medium (~80 hrs)" },
  large:  { min: 160, max: 240, label: "Large (~200 hrs)" },
};

interface CustomFeatureInputProps {
  onAdd: (feature: AppFeature) => void;
}

export function CustomFeatureInput({ onAdd }: CustomFeatureInputProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [size, setSize] = useState<FeatureSize>("medium");

  const handleSizeChange = (_: React.SyntheticEvent, v: FeatureSize | null) => {
    if (v) setSize(v);
  };

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const { min, max } = SIZE_HOURS[size];
    const feature: AppFeature = {
      id: `custom-${Date.now()}`,
      category: "advanced",
      name: trimmed,
      description: "Custom feature",
      details: "",
      factors: "",
      minHours: min,
      maxHours: max,
    };
    onAdd(feature);
    setName("");
    setSize("medium");
    setOpen(false);
  };

  return (
    <Box sx={{ mt: 1 }}>
      {!open ? (
        <Button
          size="small"
          startIcon={<AddIcon fontSize="small" />}
          onClick={() => setOpen(true)}
          sx={{ textTransform: "none", color: "text.secondary", fontSize: "0.8rem" }}
        >
          Add a custom feature
        </Button>
      ) : (
        <Collapse in={open}>
          <Box
            sx={{
              mt: 0.5,
              p: 1.5,
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
              bgcolor: "rgba(0,0,0,0.015)",
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Name your feature and pick a rough size
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="e.g. Custom AI Chatbot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setOpen(false); }}
              autoFocus
              sx={{ mb: 1.5 }}
            />
            <ToggleButtonGroup
              value={size}
              exclusive
              onChange={handleSizeChange}
              size="small"
              sx={{ mb: 1.5, flexWrap: "wrap", gap: 0.5 }}
            >
              {(Object.keys(SIZE_HOURS) as FeatureSize[]).map((s) => (
                <ToggleButton
                  key={s}
                  value={s}
                  sx={{ textTransform: "none", fontSize: "0.75rem", borderRadius: "8px !important", border: "1px solid !important" }}
                >
                  {SIZE_HOURS[s].label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                onClick={handleAdd}
                disabled={!name.trim()}
                sx={{ textTransform: "none" }}
              >
                Add
              </Button>
              <Button
                size="small"
                onClick={() => { setOpen(false); setName(""); }}
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
