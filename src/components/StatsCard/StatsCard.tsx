import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

type Props = {
  title: string;
  value: number;
  color?: string;
};

const StatsCard: React.FC<Props> = ({ title, value, color = 'primary.main' }) => {
  return (
    <Card sx={{ 
        minWidth: 180, 
        textAlign: 'center', 
        p: 2, 
        borderRadius: 2, 
        boxShadow: 3 
    }}>
      <CardContent>
        <Typography 
          variant="h6" 
          component="div" 
          color="text.secondary" 
          sx={{ mb: 1.5 }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h2" 
          component="p" 
          sx={{ fontWeight: 'bold', color: color }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;