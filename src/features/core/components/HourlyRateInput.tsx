import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";

interface HourlyRateInputProps {
  value: number;
  onChange: (rate: number) => void;
}

export function HourlyRateInput({ value, onChange }: HourlyRateInputProps) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Hourly Rate
      </Typography>
      <TextField
        type="number"
        value={value}
        onChange={(e) => {
          const parsed = parseFloat(e.target.value);
          if (!isNaN(parsed) && parsed >= 0) {
            onChange(parsed);
          }
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">$</InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">/ hr</InputAdornment>
            ),
          },
        }}
        fullWidth
        sx={{ maxWidth: 300 }}
      />
    </div>
  );
}
