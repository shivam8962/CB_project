import './App.css';
import { useState } from 'react';
import { Button, Container, Form, Navbar, Tab, Tabs, Table, Image, Modal } from 'react-bootstrap';
import logo from './components/img/logo.jfif';

function App() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [repo, setRepo] = useState([]);
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState('');

  const searchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/search/users?q=${username}`);
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

  const getCommits = async (repoName) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${profile.login}/${repoName}/commits`);
      const data = await res.json();
      console.log('Commits', data);
      setCommits(data);
      setSelectedRepo(repoName);
      setShowModal(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchProfile();
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
          <Navbar.Collapse id="responsive-navbar-nav" />
          <Form className="ml-auto d-flex align-items-center" style={{ paddingTop: '30px' }} onSubmit={handleSubmit}>
            <Form.Control
              type="text"
              placeholder="Enter Github Username"
              className="mr-3"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              style={{ maxWidth: '300px', width: '100%', marginRight: '10px' }}
            />
            <Button
              variant="outline-light"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Searching' : 'Search'}
            </Button>
          </Form>
        </Container>
      </Navbar>

      {profile?.login && (
        <Container>
          <div style={{ marginTop: 30 }}>
            <span style={{ marginTop: 30, display: 'flex', alignItems: 'center', paddingBottom: 20 }}>
              <Image
                src={profile?.avatar_url}
                roundedCircle
                width="80"
                height="80"
                alt={profile?.login}
                style={{ marginRight: '10px' }}
              />
              <h3 style={{ fontFamily: "cursive", marginTop: 20 }}>{profile?.login}</h3>
            </span>

            <Tabs
              id="controlled-tab"
              activeKey={selectedIndex}
              onSelect={(k) => setSelectedIndex(parseInt(k, 10))}
              defaultActiveKey={0}
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
                          <Button variant="outline-light" onClick={() => window.open(`https://github.com/${f?.login}`, '_blank', 'noopener,noreferrer')}>
                            Visit Profile
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>

              <Tab eventKey={1} title="Followings">
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
                          <Button variant="outline-light" onClick={() => window.open(`https://github.com/${f?.login}`, '_blank', 'noopener,noreferrer')}>
                            Visit Profile
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>

              <Tab eventKey={2} title="Repositories">
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Repositories Name</th>
                      <th>Description</th>
                      <th>View Repositories</th>
                      <th>Commits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repo?.map((r) => (
                      <tr key={r.id}>
                        <td>{r?.name}</td>
                        <td>{r?.description?.length ? r?.description : 'N/A'}</td>
                        <td>
                          <Button variant="outline-light" onClick={() => window.open(r?.html_url, '_blank', 'noopener,noreferrer')}>
                            View Repo
                          </Button>
                        </td>
                        <td>
                          <Button variant="outline-light" onClick={() => getCommits(r.name)}>
                            View Commits
                          </Button>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Commits for {selectedRepo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>SHA</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {commits?.map((commit) => (
                  <tr key={commit.sha}>
                    <td>{commit.sha}</td>
                    <td>{commit.commit.message}</td>
                    <td>{new Date(commit.commit.author.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
