import { Container, Button, Row, Col, Card, Form } from 'react-bootstrap';

function Home() {
  return (
    <>
      {/* Full-Screen Hero Section */}
      <div 
        style={{
          minHeight: '100vh',
          minWidth:'100wh',
          background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          padding: '0 px',
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 1,
          }}
        />
        <div style={{ zIndex: 2 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', textTransform: 'uppercase', textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
            Discover the Best Products at Unbeatable Prices 🛒
          </h1>
          <p style={{ fontSize: '1.5rem', maxWidth: '600px', margin: '20px auto' }}>
            Step into the world of <strong>EcommSite</strong> — where every product is a new adventure and every deal feels like a win.
          </p>
          <Button 
            variant="light" 
            size="lg" 
            style={{
              fontSize: '1.2rem', 
              padding: '20px',
              borderRadius: '30px',
              backgroundColor: '#ff7e5f',
              color: '#fff',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#feb47b'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ff7e5f'}
            onClick={() => window.location.href = '/products'}
          >
            🛍️ Start Shopping
          </Button>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container className="text-center">
          <h2 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#343a40' }}>
            Shop By Category
          </h2>
          <Row className="g-4">
            <Col xs={6} md={3}>
              <Card style={{ backgroundColor: '#ffcccb', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <Card.Body>👕 Fashion Trends</Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card style={{ backgroundColor: '#ffec99', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <Card.Body>📱 Latest Tech</Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card style={{ backgroundColor: '#b3e0ff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <Card.Body>🏠 Home Essentials</Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card style={{ backgroundColor: '#d3f8e2', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <Card.Body>🎮 Gaming Zone</Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Newsletter Section */}
      <div style={{ minHeight: '100vh', backgroundColor: '#28a745', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 15px' }}>
        <Container className="text-center">
          <h3 className="mb-3" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            Stay Ahead of the Trends 🚀
          </h3>
          <p style={{ fontSize: '1.2rem' }}>
            Be the first to know about exclusive drops, flash sales, and irresistible offers. Sign up now!
          </p>
          <Form className="d-flex justify-content-center mt-3">
            <Form.Control type="email" placeholder="Enter your email" style={{ maxWidth: '300px', padding: '12px' }} />
            <Button variant="light" style={{ fontSize: '1.2rem', padding: '12px 30px', borderRadius: '30px', marginLeft: '10px' }}>
              Subscribe
            </Button>
          </Form>
        </Container>
      </div>

      {/* Footer Section */}
      <footer style={{ backgroundColor: '#222', color: 'white', padding: '40px 0 0' }}>
        <Container>
          <Row>
            <Col md={4}>
              <h5>EcommSite</h5>
              <p>Making shopping easier, faster, and more delightful — every single day.</p>
            </Col>
            <Col md={2}>
              <h6>Company</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-light">About Us</a></li>
                <li><a href="#" className="text-light">Careers</a></li>
                <li><a href="#" className="text-light">Blog</a></li>
              </ul>
            </Col>
            <Col md={2}>
              <h6>Support</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-light">Contact</a></li>
                <li><a href="#" className="text-light">FAQs</a></li>
                <li><a href="#" className="text-light">Returns</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h6>Follow Us</h6>
              <div>
                <a href="#" className="text-light">Facebook</a> | 
                <a href="#" className="text-light"> Instagram</a> | 
                <a href="#" className="text-light"> Twitter</a>
              </div>
            </Col>
          </Row>
        </Container>
        <div style={{ backgroundColor: '#111', color: '#bbb', textAlign: 'center', padding: '10px 0' }}>
          © 2025 EcommSite. All rights reserved.
        </div>
      </footer>
    </>
  );
}

export default Home;
