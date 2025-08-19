import React from 'react';
import './LoginStyles.css';

interface LoginViewProps {
  isSignUpMode: boolean;
  showPassword: boolean;
  rememberMe: boolean;
  username: string;
  password: string;
  loading: boolean;
  error: string;
  onLogin: () => void;
  onModeToggle: (mode: boolean) => void;
  onPasswordToggle: () => void;
  onRememberMeToggle: () => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({
  isSignUpMode,
  showPassword,
  rememberMe,
  username,
  password,
  loading,
  error,
  onLogin,
  onModeToggle,
  onPasswordToggle,
  onRememberMeToggle,
  onUsernameChange,
  onPasswordChange
}) => {
  return (
    <div className={`login-container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign In Form */}
          <div className="login-form sign-in-form">
            {/* TSE Logo */}
            <div style={{ 
              marginBottom: '0px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img 
                src="/tse-logo.png" 
                alt="TSE Logo"
                style={{
                  width: '360px',
                  height: '360px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            
            <h2 className="login-title" style={{ marginTop: '-20px', marginBottom: '15px' }}>
              Giriş Yap
            </h2>
            
            <div className="input-field no-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <input 
                type="text" 
                placeholder="Kullanıcı Adı" 
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
              />
            </div>
            
            <div className="input-field">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10A2,2 0 0,1 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
              </svg>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Şifre" 
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
              />
              <div className="password-toggle" onClick={onPasswordToggle}>
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z"/>
                  </svg>
                )}
              </div>
            </div>
            
            <div className="remember-me-container">
              <label className="custom-checkbox">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={() => onRememberMeToggle()}
                />
                <span className="checkmark"></span>
              </label>
              <span className="remember-me-label" onClick={onRememberMeToggle}>
                Beni Hatırla
              </span>
            </div>
            
            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                padding: '10px',
                borderRadius: '8px',
                marginTop: '10px',
                marginBottom: '10px',
                fontSize: '14px',
                textAlign: 'center',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}
            
            <button 
              className="login-btn" 
              onClick={onLogin}
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
            
            <div style={{ marginTop: '30px' }} className="social-media">
              <a href="https://www.instagram.com/tsekurumsal/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://x.com/TSEKurumsal" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@tsekurumsal" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/tsekurumsal/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* About Us Form */}
          <div className="login-form sign-up-form">
            <h2 className="login-title" style={{ color: '#dc2626' }}>Hakkımızda</h2>
            
            <div style={{
              maxWidth: '380px',
              padding: '20px',
              textAlign: 'center',
              lineHeight: '1.6'
            }}>
              <p style={{
                fontSize: '16px',
                color: '#444',
                marginBottom: '20px',
                fontWeight: 'bold'
              }}>
                TSE Laboratuvar Yönetim Sistemi
              </p>
              <p style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '18px',
                textAlign: 'justify'
              }}>
                TSE Laboratuvar Yönetim Sistemi, Türk Standartları Enstitüsü laboratuvarlarının günlük operasyonlarını dijital ortamda yönetmek için geliştirilmiş bir web uygulamasıdır. Sistem, deney kayıtlarının oluşturulması, firma bilgilerinin saklanması, personel yönetimi ve raporlama işlemlerini tek platformda toplamaktadır.
              </p>
              <p style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '18px',
                textAlign: 'justify'
              }}>
                Sistem, laboratuvar süreçlerinin standardizasyonunu sağlar ve TSE'nin mevcut iş akışlarına uygun olarak tasarlanmıştır. Web tabanlı yapısı sayesinde herhangi bir kurulum gerektirmeden güncel web tarayıcıları üzerinden erişilebilir.
              </p>
              <p style={{
                fontSize: '13px',
                color: '#dc2626',
                fontStyle: 'italic',
                fontWeight: '600'
              }}>
                "Kalite standardınız, güvenilir geleceğiniz."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Panels Container */}
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>TSE Laboratuvar Sistemi</h3>
            <p style={{ color: '#ffffff' }}>
              Laboratuvar yönetim sistemimiz hakkında detaylı bilgi almak için tıklayın.
            </p>
            <button 
              className="transparent-btn"
              onClick={() => onModeToggle(true)}
            >
              Hakkımızda
            </button>
          </div>
          <img 
            src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png" 
            className="panel-image" 
            alt="TSE Login" 
          />
        </div>
        
        <div className="panel right-panel">
          <div className="content">
            <h3>Giriş yapmaya hazır mısınız?</h3>
            <p style={{ color: '#ffffff' }}>
              Sisteme giriş yapmak için tıklayınız.
            </p>
            <button 
              className="transparent-btn"
              onClick={() => onModeToggle(false)}
            >
              Giriş Yap
            </button>
          </div>
          <img 
            src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png" 
            className="panel-image" 
            alt="TSE Welcome" 
          />
        </div>
      </div>
    </div>
  );
};

export default LoginView;