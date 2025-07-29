import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is the placeholder for the Settings page. Admins will be able to configure platform settings, such as membership details and aims & objectives, from here.</p>
      </CardContent>
    </Card>
  );
};

export default AdminSettings; 