import { MenuItem, TextField } from '@mui/material'

export function SelectField({ label, value, options, onChange, native = false }: {
  label: string; value: string; options: [string, string][]; onChange: (value: string) => void; native?: boolean
}) {
  return <TextField select fullWidth size="small" label={label} value={value}
    slotProps={{ select: native ? { native: true } : { displayEmpty: true }, inputLabel: { shrink: true } }}
    onChange={event => onChange(event.target.value)} sx={{ minWidth: { sm: 150 } }}>
    {options.map(([key, text]) => native ? <option key={key} value={key}>{text}</option> :
      <MenuItem key={key} value={key}>{text}</MenuItem>)}
  </TextField>
}
