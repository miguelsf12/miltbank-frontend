import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useContext, useState } from 'react';
import { Context } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function TemporaryDrawer() {
  const { logout } = useContext(Context)
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Minha conta', 'Configurações'].map((text, index) => (
          <ListItem key={text} disablePadding>
            {/* Use o Link do React Router para "Minha conta" e "Configurações" */}
            {index % 2 === 0 ? (
              <ListItemButton component={Link} to={'/myaccount'}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            ) : (
              <ListItemButton component={Link} to={'/configurations'}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            )}

          </ListItem>
        ))}
        <ListItemButton onClick={logout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary='Sair' />
        </ListItemButton>
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <AccountCircleIcon fontSize='large' style={{ color: '#ccc' }} onClick={toggleDrawer(true)} />
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}