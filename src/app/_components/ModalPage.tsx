"use client";

import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface ModalPageProps {
  title: string;
  children: React.ReactNode;
}

export function ModalPage({ title, children }: ModalPageProps) {
  const router = useRouter();
  const handleClose = () => router.back();

  return (
    <Dialog open onClose={handleClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {title}
        <IconButton onClick={handleClose} size="small" aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>{children}</DialogContent>
    </Dialog>
  );
}
