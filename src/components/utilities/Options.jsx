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
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import api from '../../utils/api';
import { Badge } from '@mui/material';


export default function TemporaryDrawer() {
  const { logout } = useContext(Context)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [userLoaded, setUserLoaded] = useState(false)

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      return navigate('/login')
    }

    api.get('/users/checkuser', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setUserData(response.data)
      setUserLoaded(true)
    })

  }, [navigate])

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Minha conta', 'Configurações'].map((text, index) => (
          <ListItem key={text} disablePadding>
            {index % 2 === 0 ? (
              <ListItemButton component={Link} to={'/user/myaccount'}>
                <ListItemIcon>
                  <PersonIcon style={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            ) : (
              <ListItemButton component={Link} to={'/user/configurations'}>
                <ListItemIcon>
                  <SettingsIcon style={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            )}

          </ListItem>
        ))}
        <ListItemButton onClick={logout}>
          <ListItemIcon>
            <LogoutIcon style={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary='Sair' />
        </ListItemButton>
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      {/* <AccountCircleIcon fontSize='large' style={{ color: '#fff' }} onClick={toggleDrawer(true)} /> */}
      {userData && userData.image ? (
        <>
          <Badge overlap="circular" onClick={toggleDrawer(true)}>
            <img src={`${process.env.REACT_APP_API}/images/user/${userData.image}`} alt="Uploaded" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} />
          </Badge>
        </>
      ) : (
        <Badge overlap="circular" onClick={toggleDrawer(true)}>
          <AccountCircleIcon fontSize="large" style={{ borderRadius: '50%', color: '#ccc', width: 60, height: 60 }} />
        </Badge>
      )}
      <Drawer open={open} onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            color: '#fff',
            backgroundColor: '#F28907',
            borderRadius: '0px 20px 20px 0px',
          }
        }}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
