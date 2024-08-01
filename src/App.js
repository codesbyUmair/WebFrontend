import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './Register';
import LoginForm from './Login';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import RecipientDashboard from './RecipientDashboard';
import AdminDashboard from './AdminDashboard';
import AppointmentsPage from './AppointmentsPage'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/recipient" element={<RecipientDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
