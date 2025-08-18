import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Main app routes */}
        <Route path="/" element={<App />}>
          {/* Redirect root to home */}
          <Route index element={<Navigate to="/home" replace />} />
        </Route>
        
        {/* Catch all other routes and redirect to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
