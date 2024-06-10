import './App.css';
import { useState } from 'react';
import { Button, Container, Form, Navbar, Tab, Tabs, Table, Image } from 'react-bootstrap';
import logo from './components/img/logo.jfif';

function App() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [repo, setRepo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/search/users?q=${username}&per_page=100`);
      const data = await res.json();
      console.log(data);

      setProfile(data?.items[0]);
      getFollowers(data?.items[0]);
      getRepo(data?.items[0]);
      getFollowing(data?.items[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getFollowers = async (profile) => {
    try {
      const res = await fetch(profile?.followers_url);
      const data = await res.json();
      console.log('Followers', data);
      setFollowers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const getRepo = async (profile) => {
    try {
      const res = await fetch(profile?.repos_url);
      const data = await res.json();
      console.log('Repositories', data);
      setRepo(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const getFollowing = async (profile) => {
    try {
      const res = await fetch(profile?.url + '/following');
      const data = await res.json();
      console.log('Following', data);
      setFollowing(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="https://codingblocks.com/" target='_blank'>
            <Image
              src={logo}
              width="80px"
              height="80px"
              className="d-inline-block align-top"
              alt="Coding Blocks"
            />
            <span className="navbar-text" style={{ fontSize: '3rem' }}>Github Search</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav"/>
          <Form  className="ml-auto d-flex align-items-center" style={{paddingTop: '30px'}}>
            <Form.Control
              type="text"
              placeholder="Enter Github Username"
              className="mr-3"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              style={{maxWidth: '300px', width: '100%', marginRight: '10px' }}
            />
            <Button
              variant="outline-light"
              onClick={searchProfile}
              disabled={loading}
            >
              {loading ? 'Searching…' : 'Search'}
            </Button>
          </Form>
        </Container>
      </Navbar>

      {profile?.login && (
        <Container>
          <div style={{ marginTop: 30}}>
            <span style={{ marginTop: 30, display: 'flex', alignItems: 'center', paddingBottom: 20}}>
              <Image
                src={profile?.avatar_url}
                roundedCircle
                width="80"
                height="80"
                alt={profile?.login}
                style={{marginRight: '10px'}}
              />
              <h3 style={{fontFamily: "cursive", marginTop: 20}}>{profile?.login}</h3>
            </span>

            <Tabs
              id="controlled-tab-example"
              activeKey={selectedIndex}
              onSelect={(k) => setSelectedIndex(k)}
            >
              <Tab eventKey={0} title="Followers">
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th></th>
                      <th>User Name</th>
                      <th>Profiles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {followers?.map((f) => (
                      <tr key={f.id}>
                        <td>
                          <Image
                            src={f?.avatar_url}
                            roundedCircle
                            width="40"
                            height="40"
                            alt={f?.login}
                          />
                        </td>
                        <td>{f.login}</td>
                        <td>
                          <a href={`https://github.com/${f?.login}`} target='_blank'>Visit Profile</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>

              <Tab eventKey={1} title="Repositories">
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Repositories Name</th>
                      <th>Description</th>
                      <th>View Repositories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repo?.map((r) => (
                      <tr key={r.id}>
                        <td>{r?.name}</td>
                        <td>{r?.description?.length ? r?.description : 'N/A'}</td>
                        <td>
                          <a href={r?.html_url} target='_blank'>View Repo</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>

              <Tab eventKey={2} title="Followings">
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>User Name</th>
                      <th>Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {following?.map((f) => (
                      <tr key={f.id}>
                        <td>
                          <Image
                            src={f?.avatar_url}
                            roundedCircle
                            width="40"
                            height="40"
                            alt={f?.login}
                          />
                        </td>
                        <td>{f.login}</td>
                        <td>
                          <a href={`https://github.com/${f?.login}`} target='_blank'>Visit Profile</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>
            </Tabs>
          </div>
        </Container>
      )}
    </div>
  );
}

export default App;
