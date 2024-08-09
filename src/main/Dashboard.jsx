import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Container, Drawer, List, ListItem, ListItemText, Divider, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Products from './products'; // Assuming you have a Products component
import Profile from './Profile'; // Assuming you have a Profile component

const drawerWidth = 240;

function Dashboard() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(true); // Set default to true to show the drawer
  const [selectedIndex, setSelectedIndex] = React.useState(0); // State for tracking selected menu item
  const [name, setName] = useState(""); // Add state for the user's name

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const handleProfile = () => {
    setSelectedIndex(3); // Set index to display profile
    handleMenuClose(); // Close the profile menu
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuItemClick = (index) => {
    setSelectedIndex(index);
  };

  React.useEffect(() => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
    } else {
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      setName(userData?.name || 'User');
    }
  }, [navigate]);
  
  const handleProfileUpdate = (updatedName) => {
    setName(updatedName); // Update the name state
  };

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <div>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open} // Drawer visibility controlled by open state
      >
        <Toolbar />
        <div>
          <List>
            <ListItem 
              button 
              selected={selectedIndex === 0}
              onClick={() => handleMenuItemClick(0)}
            >
              <ListItemText primary="Dashboard" />
            </ListItem>
            <Divider />
            
            <ListItem 
              button 
              selected={selectedIndex === 2}
              onClick={() => handleMenuItemClick(2)}
            >
              <ListItemText primary="Products" />
              {/* Replace with actual DataTable component */}
            </ListItem>

            <ListItem 
              button 
              selected={selectedIndex === 1}
              onClick={() => handleMenuItemClick(1)}
            >
              <ListItemText primary="Users" />
              {/* Add dropdown here */}
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main style={{ flexGrow: 1, padding: '16px', marginLeft: drawerWidth }}>
        <Toolbar />
        <Container>
          {selectedIndex === 0 &&
          <Typography variant="h4" gutterBottom>
            Welcome, {name}!
          </Typography>
          }
          
          {selectedIndex === 2 && <Products />} {/* Conditionally render Products component */}
          {selectedIndex === 3 && <Profile onProfileUpdate={handleProfileUpdate} />} {/* Conditionally render Profile component */}

        </Container>
      </main>
    </div>
  );
}

export default Dashboard;
