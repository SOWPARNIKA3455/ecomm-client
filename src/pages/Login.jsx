import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

function Login({ setAuthToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://esite-backend.onrender.com/api/auth/login', { email, password });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setAuthToken(response.data.token);
        navigate('/products');
      } else {
        alert('Login failed!');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid credentials!');
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Card className="login-card">
          <Card.Body className="p-4">
            <h2 className="text-center mb-3 text-primary fw-bold">Welcome Back 👋</h2>
            <p className="text-center text-muted mb-4">
              Log in to <strong>EcommSite</strong> and explore unbeatable deals.
            </p>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">
                🔐 Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Login;
