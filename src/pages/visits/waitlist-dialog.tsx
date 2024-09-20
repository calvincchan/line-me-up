import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import React from "react";
import { PublicScreen } from "../bigscreen";

interface Props {
  open: boolean;
  onClose: () => void;
}

const WaitlistDialog: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogContent>
        <PublicScreen
          startContent={
            <Box mb={2}>
              <Button
                onClick={onClose}
                startIcon={<ArrowBack />}
                variant="contained"
              >
                Back
              </Button>
            </Box>
          }
        />
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default WaitlistDialog;
