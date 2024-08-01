import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const AddRecipient = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3030/admin/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: 'recipient',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.message) {
        setError(`Recipient already exists with email ${email}`);
      } else {
        console.log('Recipient added successfully:', data);
        setEmail('');
        setPassword('');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error adding recipient:', error.message);
    }
  };

  return (
    <div>
      <h2>Add Recipient</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Recipient Email:
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Recipient Password:
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <input type="hidden" name="role" value="recipient" />
        <button type="submit">Add Recipient</button>
      </form>
    </div>
  );
};

export default AddRecipient;
