import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import styles from './LoginPage.module.css';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { UserContext } from '../../context/UserContext';
import { authenticateCrew, isValidEmail, isValidPassword } from '../../utils/authUtils';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, crew, setCrewMember, userType } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect based on user type
  useEffect(() => {
    if (user && userType === 'admin' && location.pathname !== '/admin') {
      navigate('/admin');
    } else if (crew && userType === 'crew' && location.pathname !== '/dining-location') {
      navigate('/dining-location');
    }
  }, [user, crew, userType, navigate, location.pathname]);

  // Login handler
  const login = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    
    try {
      // First try admin login (Firebase Auth)
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Admin login successful!');
        // Admin redirect handled by useEffect
      } catch (authError) {
        // If admin login fails, try crew login
        const crewData = await authenticateCrew(email, password);
        if (crewData) {
          setCrewMember(crewData);
          toast.success('Crew login successful!');
          // Crew redirect handled by useEffect
        } else {
          throw new Error('Invalid credentials');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>Ordering Management System</h1>
      <div className={styles.loginCard}>
        <div className={styles.loginForm}>
          <h2 className={styles.formTitle}>Login</h2>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Email</label>
            <div className={styles.inputIconContainer}>
              <AiOutlineMail className={styles.inputIcon} />
              <input
                type="email"
                className={styles.inputField}
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Password</label>
            <div className={styles.passwordInputContainer}>
              <AiOutlineLock className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                className={styles.inputField}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                className={styles.passwordToggle}
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiOutlineEyeInvisible size="1.7em" /> : <AiOutlineEye size="1.7em" />}
              </button>
            </div>
          </div>
          <button className={styles.submitButton} onClick={login} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
