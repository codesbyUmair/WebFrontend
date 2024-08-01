import React, { useState } from 'react';
import { useNavigate , Link} from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3030/user/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'patient', 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('User registered successfully:', data);
      setEmail('');
      setPassword('');
      navigate('/');
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  const styles = {
    registrationContainer: {
      width: '400px',
      margin: 'auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      marginTop: '50px',
      textAlign: 'center',
      backgroundColor: '#fff',
    },
    registrationForm: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    label: {
      display: 'block',
      margin: '10px 0',
      color: '#333',
      fontSize: '14px',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      marginTop: '5px',
      fontSize: '14px',
    },
    button: {
      width: '100%',
      padding: '12px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#4CAF50',
      color: 'white',
      cursor: 'pointer',
      marginTop: '15px',
      fontSize: '16px',
    },
  };

  return (
    <>
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'rgb(105, 113, 243)', marginBottom: '3px' }}>
        <div>
          <h3>Healthcare App</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
           <Link to="/" style={{ color: 'black', textDecoration: 'none' }}>Login</Link>
        </div>
      </nav>
    <div style={styles.registrationContainer}>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit} style={styles.registrationForm}>
        <label style={styles.label}>
          Full Name:
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <br />
        <label style={styles.label}>
          Email:
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <br />

        <input type="hidden" name="role" value="patient" />
        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
    </div>
    </>
  );
};

export default Register;
