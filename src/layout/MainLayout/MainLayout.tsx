import React from 'react';
import { 
    Box, 
    AppBar, 
    Toolbar, 
    Typography, 
    Button 
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/tickets' },
        { name: 'Agents', path: '/agents' },
        { name: 'Live Debug', path: '/live' },
    ];

    const isCurrentPath = (path: string) => location.pathname === path;

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ flexGrow: 1, cursor: 'pointer' }}
                        onClick={() => navigate('/tickets')}
                    >
                        Live Support Dashboard
                    </Typography>
                    
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.name}
                                sx={{ color: '#fff', mx: 1 }}
                                onClick={() => navigate(item.path)}
                                variant={isCurrentPath(item.path) ? 'outlined' : 'text'}
                                color="inherit"
                            >
                                {item.name}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    p: 3, 
                    backgroundColor: 'background.default' 
                }}
            >
                <Outlet />
            </Box>

        </Box>
    );
};

export default MainLayout;