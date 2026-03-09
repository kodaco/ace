"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";

const navBtnSx = {
  fontSize: "0.8rem",
  fontWeight: 500,
  textTransform: "none" as const,
  borderRadius: 2,
  px: 1.5,
  color: "text.secondary",
  "&:hover": { bgcolor: "rgba(0,0,0,0.05)", color: "text.primary" },
};

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCalcClick = () => {
    setDrawerOpen(false);
    if (pathname === "/") scrollTo("calculator");
    else router.push("/#calculator");
  };

  const handleGotchasClick = () => {
    setDrawerOpen(false);
    router.push("/gotchas");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: "rgba(0,0,0,0.08)",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 4 }, minHeight: { xs: 56, sm: 64 } }}>
          {/* Logo */}
          <Box
            component={Link}
            href="/"
            sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1, textDecoration: "none" }}
          >
            {/* <CalculateOutlinedIcon
              sx={{
                fontSize: 26,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            /> */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: "1.05rem",
                letterSpacing: "-0.01em",
                background: "linear-gradient(135deg, #1e1e2e 0%, #374151 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ace
            </Typography>
            <Chip
              label="Free"
              size="small"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                bgcolor: "rgba(99,102,241,0.1)",
                color: "#6366f1",
                border: "1px solid rgba(99,102,241,0.2)",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Box>

          {/* Desktop nav */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
            <Button size="small" component={Link} href="/gotchas" sx={navBtnSx}>
              Before you build
            </Button>
            <Button size="small" component={Link} href="/faq" sx={navBtnSx}>
              FAQs
            </Button>
            {/* <Button size="small" component={Link} href="/providers" sx={navBtnSx}>
              Providers
            </Button>             */}
            <Button
              size="small"
              variant="contained"
              onClick={handleCalcClick}
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
            >
              Calculator
            </Button>
            <Button
              href="https://github.com/kodaco/ace"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              startIcon={<GitHubIcon fontSize="small" />}
              sx={navBtnSx}
            >
              GitHub
            </Button>
          </Box>

          {/* Mobile: hamburger only */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="small"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              sx={{ color: "text.primary" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={/* istanbul ignore next */ () => setDrawerOpen(false)}
        slotProps={{ paper:{ sx: { width: 260 } }}}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Menu
          </Typography>
          <IconButton size="small" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider />

        <List disablePadding>
          <ListItem sx={{ px: 2, pt: 2, pb: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCalcClick}
              sx={{
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
            >
              Calculator
            </Button>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/faq" onClick={() => setDrawerOpen(false)}>
              <ListItemText primary="FAQs" slotProps={{ primary: { fontWeight: 500} }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleGotchasClick}>
              <ListItemText primary="Before You Build" slotProps={{ primary: { fontWeight: 500} }} />
            </ListItemButton>
          </ListItem>
          {/* <ListItem disablePadding>
            <ListItemButton component={Link} href="/providers" onClick={() => setDrawerOpen(false)}>
              <ListItemText primary="Service Providers" slotProps={{ primary: { fontWeight: 500} }} />
            </ListItemButton>
          </ListItem> */}
        </List>

        <Divider />

        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="https://github.com/kodaco/ace"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setDrawerOpen(false)}
            >
              <GitHubIcon fontSize="small" sx={{ mr: 1.5, color: "text.secondary" }} />
              <ListItemText primary="GitHub" slotProps={{ primary: { fontWeight: 500} }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
