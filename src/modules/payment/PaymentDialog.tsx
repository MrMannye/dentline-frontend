import {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import TabTarjeta from './components/TabTarjeta'

interface Props { 
  open: boolean,
  setOpen: (open: boolean) => void
}

export default function CustomizedDialogs(params: Props) {

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, tabIndex: number) => {
    setValue(tabIndex);
  };
  const handleClose = () => {
    params.setOpen(false);
  };

  return (
      <Dialog
        onClose={handleClose}
        maxWidth='xs'
        aria-labelledby="customized-dialog-title"
        open={params.open}
      >
        <DialogTitle className='flex justify-between items-center' id="customized-dialog-title">
          Metodo de Pago
          <IconButton
          aria-label="close"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="secondary tabs example"
          >
          <Tab label="Tarjeta"/>
          <Tab label="Metamask" />
          <Tab label="Efectivo" />
        </Tabs>
        {value === 0 && (<TabTarjeta/>)}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Abonar
          </Button>
        </DialogActions>
      </Dialog>
  );
}
