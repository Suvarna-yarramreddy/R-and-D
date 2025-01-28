import React, { useEffect, useState } from 'react'; // Import React hooks
import { Card, Row, Col, Container, Spinner, Alert } from 'react-bootstrap'; // Import Bootstrap components
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'; // Import Recharts components
import axios from 'axios'; // Import axios for HTTP requests
import { Book, Assignment } from '@mui/icons-material'; // Import Material UI icons

const HomePage = () => {
  const [stats, setStats] = useState({
    total_faculty: 0,
    total_logins: 0,
    total_publications: 0,
    total_patents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const facultyName = sessionStorage.getItem('faculty_name');
  const facultyId = sessionStorage.getItem('faculty_id');
  
  useEffect(() => {
    // Fetch overall statistics
    axios
      .get(`http://localhost:5009/api/stats/${facultyId}`)
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching statistics:', error);
        setError('Failed to load overall statistics. Please try again later.');
        setLoading(false);
      });
  }, [facultyId]);

  const pieData = [
    { name: 'Faculties', value: stats.total_faculty },
    { name: 'Publications', value: stats.total_publications },
    { name: 'Patents', value: stats.total_patents },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Container className="text-center" style={{ paddingTop: '20px' }}>
        <Spinner animation="border" variant="primary" />
        <h3>Loading statistics...</h3>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center" style={{ paddingTop: '20px' }}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>

        {/* Main Content Area */}
        <Col xs={12} md={9} className="main-content" style={{ paddingTop: '20px' }}>
          <h2>Welcome, {facultyName}!</h2>
          <p>This is your dashboard with key statistics visualized.</p>

          {/* Pie Chart Section */}
          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Overall Faculty Statistics Overview</Card.Title>
                  {pieData.some((item) => item.value > 0) ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p>No data available to display.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>
                    <Book /> Total Publications
                  </Card.Title>
                  <Card.Text>{stats.total_publications}</Card.Text>
                </Card.Body>
              </Card>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>
                    <Assignment /> Total Patents
                  </Card.Title>
                  <Card.Text>{stats.total_patents}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
    </Container>
  );
};

export default HomePage;
