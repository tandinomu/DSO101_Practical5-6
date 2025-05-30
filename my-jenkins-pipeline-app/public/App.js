import logo from './logo.svg';
import './App.css';

function App() {
  const appInfo = {
    name: 'Jenkins Pipeline React App',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    buildTime: process.env.REACT_APP_BUILD_TIME || new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to {appInfo.name}</h1>
        <div className="app-info">
          <p>Version: <span className="highlight">{appInfo.version}</span></p>
          <p>Environment: <span className="highlight">{appInfo.environment}</span></p>
          <p>Build Time: <span className="highlight">{appInfo.buildTime}</span></p>
        </div>
        <div className="features">
          <h2>Pipeline Features</h2>
          <ul>
            <li>✅ Automated Testing</li>
            <li>✅ Code Quality Checks</li>
            <li>✅ Docker Containerization</li>
            <li>✅ Automated Deployment</li>
            <li>✅ CI/CD with Jenkins</li>
          </ul>
        </div>
        <p>
          This app demonstrates a complete CI/CD pipeline with Jenkins!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;