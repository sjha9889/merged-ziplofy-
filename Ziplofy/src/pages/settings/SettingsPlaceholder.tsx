import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const SettingsPlaceholder: React.FC<{ title?: string }> = ({ title = 'Settings' }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>{title}</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          This settings section is not implemented yet.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SettingsPlaceholder;


