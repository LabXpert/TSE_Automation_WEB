import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginView from './LoginView';

interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    username: string;
    fullName: string;
    role: string;
    email: string;
  };
}

const Login: React.FC = () => {
  // State'ler
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fonksiyonlar
  const handleLogin = async () => {
    if (!username || !password) {
      setError('Kullanıcı adı ve şifre gereklidir.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      if (data.success) {
        // Kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Remember me işlemi
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('savedUsername', username);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('savedUsername');
        }
        
        // Ana sayfaya yönlendir
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeToggle = (mode: boolean) => {
    setIsSignUpMode(mode);
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeToggle = () => {
    setRememberMe(!rememberMe);
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  return (
    <LoginView
      isSignUpMode={isSignUpMode}
      showPassword={showPassword}
      rememberMe={rememberMe}
      username={username}
      password={password}
      loading={loading}
      error={error}
      onLogin={handleLogin}
      onModeToggle={handleModeToggle}
      onPasswordToggle={handlePasswordToggle}
      onRememberMeToggle={handleRememberMeToggle}
      onUsernameChange={handleUsernameChange}
      onPasswordChange={handlePasswordChange}
    />
  );
};

export default Login;