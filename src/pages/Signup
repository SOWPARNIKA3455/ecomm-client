import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios'; // Import axios for making the HTTP request
import { useNavigate } from 'react-router-dom'; // For navigation after signup

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(''); // For error handling
  const navigate = useNavigate(); // For redirecting after signup

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://esite-backend.onrender.com/api/auth/signup', formData);
      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        navigate('/products');  // Redirect to the products page on successful signup
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Error signing up, please try again.');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Create Your Account</h2>
        <p className="text-muted">Join us and start shopping today!</p>
      </div>
      {error && <Alert variant="danger">{error}</Alert>} {/* Display error message */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="signupUsername">
          <Form.Label className="fw-semibold">Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
            className="border-primary rounded-pill"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="signupEmail">
          <Form.Label className="fw-semibold">Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="border-primary rounded-pill"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="signupPassword">
          <Form.Label className="fw-semibold">Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className="border-primary rounded-pill"
          />
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          className="w-100 rounded-pill py-2 mt-3"
        >
          Create Account
        </Button>
      </Form>

      <div className="text-center mt-3">
        <p className="text-muted">
          Already have an account? 
          <Button variant="link" onClick={() => navigate('/login')} className="p-0">
            Login here
          </Button>
        </p>
      </div>
    </Container>
  );
}

export default Signup;
