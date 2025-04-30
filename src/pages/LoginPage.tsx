import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import { ClipboardList } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center">
        <ClipboardList className="h-12 w-12 text-blue-600" />
        <h1 className="mt-2 text-3xl font-extrabold text-gray-900">LeadCRM</h1>
        <p className="mt-2 text-gray-600">Simplifique sua gestão de leads</p>
      </div>
      
      <LoginForm />
    </div>
  );
};

export default LoginPage;