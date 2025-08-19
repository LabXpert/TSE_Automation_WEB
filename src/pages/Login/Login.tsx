import React, { useState } from 'react';
import LoginView from './LoginView';

const Login: React.FC = () => {
  // State'ler
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Fonksiyonlar
  const handleLogin = () => {
    // Login logic'i buraya gelecek
    console.log('Login attempt:', { username, rememberMe });
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