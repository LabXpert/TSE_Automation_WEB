import React, { useState } from 'react';

interface LoginViewProps {
  // props interface'i buraya
}

const LoginView: React.FC<LoginViewProps> = ({
  // destructure props buraya
}) => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <>
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Montserrat', sans-serif;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        body,
        input {
          font-family: 'Montserrat', sans-serif;
        }

        input {
          user-select: text !important;
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
        }

        .login-container {
          position: relative;
          width: 100%;
          background-color: #fff;
          min-height: 100vh;
          overflow: hidden;
        }

        .forms-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        .login-form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0rem 5rem;
          transition: all 0.2s 0.7s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        .sign-up-form {
          opacity: 0;
          z-index: 1;
        }

        .sign-in-form {
          z-index: 2;
        }

        .login-title {
          font-size: 2.2rem;
          color: #444;
          margin-bottom: 10px;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .input-field {
          max-width: 380px;
          width: 100%;
          background-color: #f0f0f0;
          margin: 10px 0;
          height: 55px;
          border-radius: 5px;
          display: grid;
          grid-template-columns: 15% 70% 15%;
          padding: 0 0.4rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .input-field.no-icon {
          grid-template-columns: 15% 85%;
        }

        .password-toggle {
          align-self: center;
          justify-self: center;
          color: #acacac;
          cursor: pointer;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          color: #dc2626;
        }

        .remember-me-container {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 15px 0;
          max-width: 380px;
          width: 100%;
          font-size: 14px;
          color: #666;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          line-height: 1;
        }

        .custom-checkbox {
          position: relative;
          width: 18px;
          height: 18px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .custom-checkbox input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 18px;
          width: 18px;
          background-color: #f0f0f0;
          border: 2px solid #ddd;
          border-radius: 3px;
          transition: all 0.3s ease;
        }

        .custom-checkbox:hover .checkmark {
          background-color: #e8e8e8;
          border-color: #dc2626;
        }

        .custom-checkbox input:checked ~ .checkmark {
          background-color: #dc2626;
          border-color: #dc2626;
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .custom-checkbox input:checked ~ .checkmark:after {
          display: block;
        }

        .custom-checkbox .checkmark:after {
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .remember-me-label {
          cursor: pointer;
          font-weight: 500;
          line-height: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          margin-top: 1px;
        }

        .input-field:focus-within {
          background-color: #fff;
          box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
        }

        .input-field svg {
          align-self: center;
          justify-self: center;
          color: #acacac;
          transition: 0.5s;
        }

        .input-field:focus-within svg {
          color: #dc2626;
        }

        .input-field input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 600;
          font-size: 1.1rem;
          color: #333;
        }

        .input-field input::placeholder {
          color: #aaa;
          font-weight: 500;
        }

        .social-text {
          padding: 0.7rem 0;
          font-size: 1rem;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .social-media {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .social-icon {
          height: 46px;
          width: 46px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333;
          border-radius: 50%;
          border: 1px solid #333;
          text-decoration: none;
          font-size: 1.1rem;
          transition: 0.3s;
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .social-icon:hover {
          color: #dc2626;
          border-color: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }

        .login-btn {
          width: 150px;
          background-color: #dc2626;
          border: none;
          outline: none;
          height: 49px;
          border-radius: 4px;
          color: #fff;
          text-transform: uppercase;
          font-weight: 600;
          margin: 10px 0;
          cursor: pointer;
          transition: 0.5s;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .login-btn:hover {
          background-color: #b91c1c;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);
        }

        .panels-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .login-container:before {
          content: "";
          position: absolute;
          height: 2000px;
          width: 2000px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background-image: linear-gradient(-45deg, #dc2626 0%, #b91c1c 100%);
          transition: 1.8s ease-in-out;
          border-radius: 50%;
          z-index: 6;
        }

        .panel-image {
          width: 100%;
          transition: transform 1.1s ease-in-out;
          transition-delay: 0.4s;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
          text-align: center;
          z-index: 6;
        }

        .left-panel {
          pointer-events: all;
          padding: 3rem 17% 2rem 12%;
        }

        .right-panel {
          pointer-events: none;
          padding: 3rem 12% 2rem 17%;
        }

        .panel .content {
          color: #fff;
          transition: transform 0.9s ease-in-out;
          transition-delay: 0.6s;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .panel h3 {
          font-weight: 800;
          line-height: 1.1;
          font-size: 2rem;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          background: linear-gradient(45deg, #ffffff, #f1f5f9, #e2e8f0, #ffffff);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 
            0 0 10px rgba(255, 255, 255, 0.8),
            0 0 20px rgba(255, 255, 255, 0.6),
            0 0 30px rgba(255, 255, 255, 0.4);
          animation: shimmer 3s ease-in-out infinite, float 4s ease-in-out infinite;
          letter-spacing: 1px;
          text-transform: uppercase;
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
        }

        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .panel p {
          font-size: 0.95rem;
          padding: 0.7rem 0;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .transparent-btn {
          margin: 0;
          background: none;
          border: 2px solid #fff;
          width: 130px;
          height: 41px;
          font-weight: 600;
          font-size: 0.8rem;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .transparent-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
        }

        .right-panel .panel-image,
        .right-panel .content {
          transform: translateX(800px);
        }

        /* ANIMATION */
        .login-container.sign-up-mode:before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        .login-container.sign-up-mode .left-panel .panel-image,
        .login-container.sign-up-mode .left-panel .content {
          transform: translateX(-800px);
        }

        .login-container.sign-up-mode .signin-signup {
          left: 25%;
        }

        .login-container.sign-up-mode .sign-up-form {
          opacity: 1;
          z-index: 2;
        }

        .login-container.sign-up-mode .sign-in-form {
          opacity: 0;
          z-index: 1;
        }

        .login-container.sign-up-mode .right-panel .panel-image,
        .login-container.sign-up-mode .right-panel .content {
          transform: translateX(0%);
        }

        .login-container.sign-up-mode .left-panel {
          pointer-events: none;
        }

        .login-container.sign-up-mode .right-panel {
          pointer-events: all;
        }

        p, h1, h2, h3, h4, h5, h6, span, div {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }

        @media (max-width: 870px) {
          .login-container {
            min-height: 800px;
            height: 100vh;
          }
          .signin-signup {
            width: 100%;
            top: 95%;
            transform: translate(-50%, -100%);
            transition: 1s 0.8s ease-in-out;
          }

          .signin-signup,
          .login-container.sign-up-mode .signin-signup {
            left: 50%;
          }

          .panels-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 2fr 1fr;
          }

          .panel {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 2.5rem 8%;
            grid-column: 1 / 2;
          }

          .right-panel {
            grid-row: 3 / 4;
          }

          .left-panel {
            grid-row: 1 / 2;
          }

          .panel-image {
            width: 200px;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.6s;
          }

          .panel .content {
            padding-right: 15%;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.8s;
          }

          .panel h3 {
            font-size: 1.2rem;
          }

          .panel p {
            font-size: 0.7rem;
            padding: 0.5rem 0;
          }

          .transparent-btn {
            width: 110px;
            height: 35px;
            font-size: 0.7rem;
          }

          .login-container:before {
            width: 1500px;
            height: 1500px;
            transform: translateX(-50%);
            left: 30%;
            bottom: 68%;
            right: initial;
            top: initial;
            transition: 2s ease-in-out;
          }

          .login-container.sign-up-mode:before {
            transform: translate(-50%, 100%);
            bottom: 32%;
            right: initial;
          }

          .login-container.sign-up-mode .left-panel .panel-image,
          .login-container.sign-up-mode .left-panel .content {
            transform: translateY(-300px);
          }

          .login-container.sign-up-mode .right-panel .panel-image,
          .login-container.sign-up-mode .right-panel .content {
            transform: translateY(0px);
          }

          .right-panel .panel-image,
          .right-panel .content {
            transform: translateY(300px);
          }

          .login-container.sign-up-mode .signin-signup {
            top: 5%;
            transform: translate(-50%, 0);
          }
        }

        @media (max-width: 570px) {
          .login-form {
            padding: 0 1.5rem;
          }

          .panel-image {
            display: none;
          }
          .panel .content {
            padding: 0.5rem 1rem;
          }
          .login-container {
            padding: 1.5rem;
          }

          .login-container:before {
            bottom: 72%;
            left: 50%;
          }

          .login-container.sign-up-mode:before {
            bottom: 28%;
            left: 50%;
          }
        }
      `}</style>

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
              
              <h2 className="login-title" style={{ marginTop: '-20px', marginBottom: '15px' }}>Giriş Yap</h2>
              
              <div className="input-field no-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <input type="text" placeholder="Kullanıcı Adı" />
              </div>
              
              <div className="input-field">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10A2,2 0 0,1 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                </svg>
                <input type={showPassword ? "text" : "password"} placeholder="Şifre" />
                <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
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
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                </label>
                <span className="remember-me-label" onClick={() => setRememberMe(!rememberMe)}>
                  Beni Hatırla
                </span>
              </div>
              
              <button className="login-btn">Giriş Yap</button>
              
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
                onClick={() => setIsSignUpMode(true)}
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
                onClick={() => setIsSignUpMode(false)}
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
    </>
  );
};

export default LoginView;