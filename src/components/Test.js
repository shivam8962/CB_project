import './App.css';
import { useState } from 'react';
import { Button, Container, Form, Navbar, ListGroup, Image } from 'react-bootstrap';
import logo from './components/img/logo.jfif';

function App() {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/search/users?q=${username}&per_page=100`);
      const data = await res.json();
      console.log(data);
      setUsers(data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="https://codingblocks.com/">
            <img
              alt=""
              src={logo}
              width="80px"
              height="80px"
              className="d-inline-block align-top" 
            />
            <span className="navbar-text" style={{ fontSize: '3rem' }}>Github Search</span>
          </Navbar.Brand>
          <Form className="ml-auto d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Enter Github Username"
              className="mr-3"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              style={{ maxWidth: '300px', width: '100%' }}
            />
            <Button
              variant="outline-light"
              onClick={searchUsers}
              disabled={loading}
            >
              {loading ? 'Searching…' : 'Search'}
            </Button>
          </Form>
        </Container>
      </Navbar>

      <Container>
        <ListGroup>
          {users.map((user) => (
            <ListGroup.Item key={user.id} action onClick={() => selectUser(user)}>
              <Image
                src={user.avatar_url}
                roundedCircle
                width="40"
                height="40"
                alt={user.login}
                className="mr-3"
              />
              {user.login}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>

      {selectedUser && (
        <Container>
          <div style={{ marginTop: 30 }}>
            <Image
              src={selectedUser.avatar_url}
              roundedCircle
              width="40"
              height="40"
              alt={selectedUser.login}
            />
            <h3>{selectedUser.login}</h3>
          </div>
        </Container>
      )}
    </div>
  );
}

export default App;
