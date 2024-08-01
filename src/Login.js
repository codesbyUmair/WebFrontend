import React, { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';

const Login = () => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [email , setemail] = useState('');
  const [password , setpassword] = useState('');
  const navigate = useNavigate();

  
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3030/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      if (data.Success) {
        console.log('Login successful:', data);

        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.rest._doc._id);

        setToken(data.token);
        setUserId(data.rest._doc._id);

        switch (data.rest._doc.role) {
          case 'patient':
            navigate('/patient');
            break;
          case 'doctor':
            navigate('/doctor');
            break;
          case 'recipient':
            navigate('/recipient');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/default');
            break;
        }
      } else {
        setError(data.Message);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  const styles = {
    loginContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      backgroundColor: '#f7f7f7',
    },
    loginForm: {
      width: '300px',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      textAlign: 'center',
    },
    label: {
      display: 'block',
      margin: '10px 0',
      color: '#333',
    },
    input: {
      width: '95%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      margin: '5px 0',
      fontSize: '14px',
    },
    error: {
      color: 'red',
      marginBottom: '10px',
    },
    button: {
      width: '100%',
      padding: '12px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#4CAF50',
      color: 'white',
      cursor: 'pointer',
      marginTop: '10px',
      fontSize: '16px',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#45a049',
    },
  };

  return (
    <>
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'rgb(105, 113, 243)', marginBottom: '3px' }}>
        <div>
          <h3>Healthcare App</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
           <Link to="/register" style={{ color: 'black', textDecoration: 'none' }}>Register</Link>
        </div>
      </nav>
    <div style={styles.loginContainer}>
      <div style={styles.loginForm}>
        <h2>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>
            Email:
            <input 
              type="text"
              name="email"
              onChange={(e)=> {
                setemail(e.target.value)
              }}
              required
              style={styles.input}
            />
          </label>
          <br />
          <label style={styles.label}>
            Password:
            <input
              type="password"
              name="password"
              onChange={(e)=> {
                setpassword(e.target.value)
              }}
              required
              style={styles.input}
            />
          </label>
          <br />
          <button type="submit" style={{ ...styles.button, ...styles.buttonHover }}>
            Login
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;
