import React from 'react';
import { Box, Paper, Typography, Button, RadioGroup, FormControlLabel, Radio, TextField, Checkbox, Divider, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../contexts/store.context';
import { useReturnRules } from '../../contexts/return-rules.context';

const CreateReturnRules: React.FC = () => {
  const navigate = useNavigate();
  const { activeStoreId } = useStore();
  const { createRules, loading } = useReturnRules();

  const [enabled, setEnabled] = React.useState(false);
  const [windowType, setWindowType] = React.useState<'14' | '30' | '90' | 'unlimited' | 'custom'>('30');
  const [customDays, setCustomDays] = React.useState<string>('');

  const [shippingCost, setShippingCost] = React.useState<'customer' | 'free' | 'flat'>('free');
  const [flatRate, setFlatRate] = React.useState<string>('');

  const [chargeRestock, setChargeRestock] = React.useState<boolean>(false);
  const [restockFee, setRestockFee] = React.useState<string>('');

  const onCreate = async () => {
    if (!activeStoreId) return;
    await createRules({
      storeId: activeStoreId,
      enabled,
      returnWindow: windowType === 'custom' ? (customDays || '0') : windowType,
      returnShippingCost:
        shippingCost === 'customer'
          ? 'customer provides return shipping'
          : shippingCost === 'flat'
            ? 'flat rate return shipping'
            : 'free return shipping',
      flatRate: shippingCost === 'flat' ? Number(flatRate || 0) : undefined,
      chargeRestockingFree: chargeRestock,
      restockingFee: chargeRestock ? Number(restockFee || 0) : undefined,
    });
    navigate('/settings/policies');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Create return rules</Typography>
        </Box>
        <Button variant={enabled ? 'outlined' : 'contained'} onClick={() => setEnabled(v => !v)}>
          {enabled ? 'Turn off' : 'Turn on'}
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e5e7eb' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Return window</Typography>
        <RadioGroup value={windowType} onChange={(e) => setWindowType(e.target.value as any)}>
          <FormControlLabel value="14" control={<Radio />} label="14 days" />
          <FormControlLabel value="30" control={<Radio />} label="30 days" />
          <FormControlLabel value="90" control={<Radio />} label="90 days" />
          <FormControlLabel value="unlimited" control={<Radio />} label="Unlimited" />
          <FormControlLabel value="custom" control={<Radio />} label="Custom days" />
        </RadioGroup>
        {windowType === 'custom' && (
          <TextField
            size="small"
            label="Number of days"
            value={customDays}
            onChange={(e) => setCustomDays(e.target.value)}
            sx={{ mt: 1, maxWidth: 220 }}
          />
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Return shipping cost</Typography>
        <RadioGroup value={shippingCost} onChange={(e) => setShippingCost(e.target.value as any)}>
          <FormControlLabel value="customer" control={<Radio />} label="Customer provides return shipping" />
          <FormControlLabel value="free" control={<Radio />} label="Free return shipping" />
          <FormControlLabel value="flat" control={<Radio />} label="Flat rate return shipping" />
        </RadioGroup>
        {shippingCost === 'flat' && (
          <TextField
            size="small"
            type="number"
            label="Flat rate"
            placeholder="0.00"
            value={flatRate}
            onChange={(e) => setFlatRate(e.target.value)}
            sx={{ mt: 1, maxWidth: 220 }}
            InputProps={{ startAdornment: <Box component="span" sx={{ mr: 1 }}>₹</Box> as any }}
          />
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Restocking fee</Typography>
        <FormControlLabel
          control={<Checkbox checked={chargeRestock} onChange={(e) => setChargeRestock(e.target.checked)} />}
          label="Charge restocking fee"
        />
        {chargeRestock && (
          <TextField
            size="small"
            type="number"
            label="Restocking fee (%)"
            placeholder="0"
            value={restockFee}
            onChange={(e) => setRestockFee(e.target.value)}
            sx={{ mt: 1, maxWidth: 220 }}
          />
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={onCreate} disabled={loading || !activeStoreId}>Create</Button>
      </Box>
    </Box>
  );
};

export default CreateReturnRules;


