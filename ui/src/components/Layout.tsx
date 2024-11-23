import { FC, ReactNode } from 'react';
import {
  AppBar as MuiAppBar,
  Box,
  Drawer,
  styled,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  col1: ReactNode;
  col2: ReactNode;
  col3: ReactNode;
  title?: string;
}

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  zIndex: theme.zIndex.drawer + 1,
}));

const ColumnBox = styled(Box)(() => ({
  flexBasis: 0,
  height: '100%',
  overflow: 'auto',
  marginTop: '64px',
}));

const DRAWER_WIDTH = 240;

const Layout: FC<LayoutProps> = ({ col1, col2, col3, title = 'Dashboard' }) => {
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate('../../');
  };
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppBar position="fixed" color="transparent">
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: `${DRAWER_WIDTH}px`,
            }}
          >
            <Tooltip title="Home">
              <IconButton
                size="medium"
                color="inherit"
                onClick={handleHomeClick}
                sx={{ mr: 2 }}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        open
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box
          sx={{
            overflow: 'auto',
            height: '100%',
            marginTop: '64px',
          }}
        >
          {col1}
        </Box>
      </Drawer>

      <ColumnBox
        sx={{
          flexGrow: 2,
        }}
      >
        {col2}
      </ColumnBox>

      <ColumnBox
        sx={{
          flexGrow: 1,
          borderLeft: 1,
          borderColor: 'divider',
        }}
      >
        {col3}
      </ColumnBox>
    </Box>
  );
};

export default Layout;
