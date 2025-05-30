import { render, screen } from '@testing-library/react';
import App from './app';

describe('App Component', () => {
  test('renders app title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Jenkins Pipeline React App/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('displays version information', () => {
    render(<App />);
    const versionElement = screen.getByText(/Version:/i);
    expect(versionElement).toBeInTheDocument();
  });

  test('displays environment information', () => {
    render(<App />);
    const environmentElement = screen.getByText(/Environment:/i);
    expect(environmentElement).toBeInTheDocument();
  });

  test('displays build time information', () => {
    render(<App />);
    const buildTimeElement = screen.getByText(/Build Time:/i);
    expect(buildTimeElement).toBeInTheDocument();
  });

  test('renders pipeline features list', () => {
    render(<App />);
    const featuresTitle = screen.getByText(/Pipeline Features/i);
    expect(featuresTitle).toBeInTheDocument();
    
    const automatedTesting = screen.getByText(/Automated Testing/i);
    expect(automatedTesting).toBeInTheDocument();
    
    const docker = screen.getByText(/Docker Containerization/i);
    expect(docker).toBeInTheDocument();
  });

  test('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://reactjs.org');
  });

  test('app logo is present and has correct alt text', () => {
    render(<App />);
    const logoElement = screen.getByAltText(/logo/i);
    expect(logoElement).toBeInTheDocument();
  });

  test('displays CI/CD description', () => {
    render(<App />);
    const descriptionElement = screen.getByText(/complete CI\/CD pipeline with Jenkins/i);
    expect(descriptionElement).toBeInTheDocument();
  });
});

// Additional utility tests
describe('App Environment Variables', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('uses default values when environment variables are not set', () => {
    delete process.env.REACT_APP_VERSION;
    delete process.env.REACT_APP_BUILD_TIME;
    
    render(<App />);
    
    const versionElement = screen.getByText(/1\.0\.0/);
    expect(versionElement).toBeInTheDocument();
  });
});