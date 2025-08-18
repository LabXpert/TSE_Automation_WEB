import React from 'react';

interface LoginViewProps {
  // Login sayfası props'ları gelecek
  className?: string;
}

const LoginView: React.FC<LoginViewProps> = () => {
  return (
    <div style={{ 
      padding: '32px', 
      fontFamily: 'inherit',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
      {/* Page Header */}
      <div style={{ 
        marginBottom: '32px',
        borderBottom: '2px solid #dc2626',
        paddingBottom: '16px'
      }}>
        <h1 style={{ 
          fontSize: '32px',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 8px 0',
          letterSpacing: '-0.025em'
        }}>
          Giriş Yap
        </h1>
        <p style={{ 
          color: '#64748b',
          fontSize: '16px',
          margin: 0
        }}>
          Hesabınıza giriş yapın
        </p>
      </div>

      {/* İçerik buraya */}
      <div>
        Login sayfası içeriği buraya gelecek
      </div>
    </div>
  );
};

export default LoginView;