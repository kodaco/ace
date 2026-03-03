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
          Use AI-assisted tools to speed up development — but keep in mind that
          AI-generated work may need more hands-on maintenance down the road.
        </Typography>
      </Box>
      <Collapse in={expanded}>
        <Divider sx={{ mx: 2 }} />
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            AI coding assistants can help developers write code faster, generate
            boilerplate, and prototype features more quickly. This can
            meaningfully reduce the initial build time for most features.
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            However, AI-generated code often requires more careful review,
            testing, and refactoring to meet production standards. Over time,
            this can lead to higher maintenance costs as the codebase may need
            more frequent cleanup, bug fixes, and updates to keep things running
            smoothly.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            In short: faster to build, but plan for a bit more upkeep.
          </Typography>
        </Box>
      </Collapse>
    </Card>
  );
}
