"use client";

import { useState } from "react";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface BuildWithAiToggleProps {
  checked: boolean;
  onChange: () => void;
}

export function BuildWithAiToggle({
  checked,
  onChange,
}: BuildWithAiToggleProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card variant="outlined">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
        }}
      >
        <FormControlLabel
          control={<Switch checked={checked} onChange={onChange} />}
          label={
            <Typography variant="subtitle1" component="span">
              Build with AI
            </Typography>
          }
          sx={{ flex: 1, m: 0 }}
        />
        <IconButton
          size="small"
          onClick={() => setExpanded((prev) => !prev)}
          sx={{
            ml: 1,
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
          aria-label="Learn more about building with AI"
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      <Box sx={{ px: 2, pb: expanded ? 0 : 2 }}>
        <Typography variant="body2" color="text.secondary">
          AI-assisted development reduces build time by about 25%, but expect
          higher ongoing maintenance costs as a tradeoff.
        </Typography>
      </Box>
      <Collapse in={expanded}>
        <Divider sx={{ mx: 2 }} />
        <Box sx={{ px: 2, py: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>Development speed:</Box>
            {" "}AI coding tools are most effective on standard, repeatable work
            like screens, forms, and common features. They tend to save less
            time on complex or custom functionality that requires more careful thinking.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>Maintenance costs:</Box>
            {" "}AI-generated code often needs more cleanup, debugging, and
            rework over time. Studies show developers spend more hours fixing
            issues in AI-written code than in carefully hand-written code.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            In short: faster to build, but plan for more upkeep down the road.
          </Typography>
        </Box>
      </Collapse>
    </Card>
  );
}
