pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 24.0.2'  // Updated to match your Jenkins configuration
    }
    
    environment {
        CI = 'true'
        NODE_ENV = 'production'
        REACT_APP_ENV = 'production'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm ci --silent'  // Using ci for faster, reliable installs
            }
        }
        
        stage('Lint Code') {
            steps {
                echo 'Running ESLint...'
                script {
                    // Check if lint script exists in package.json
                    def packageJson = readJSON file: 'package.json'
                    if (packageJson.scripts?.lint) {
                        sh 'npm run lint'
                    } else {
                        echo 'No lint script found, skipping linting'
                    }
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running React tests...'
                script {
                    // Set test environment variables
                    withEnv(['CI=true']) {
                        sh 'npm test -- --coverage --watchAll=false'
                    }
                }
            }
            post {
                always {
                    // Archive test results if they exist
                    script {
                        if (fileExists('coverage/lcov.info')) {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        }
                    }
                }
            }
        }
        
        stage('Build React App') {
            steps {
                echo 'Building React application...'
                sh 'npm run build'
                
                // Archive the build artifacts
                archiveArtifacts artifacts: 'build/**/*', fingerprint: true
            }
            post {
                success {
                    echo 'React build completed successfully!'
                    sh 'ls -la build/'  // Show build directory contents
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo "Deploying based on branch: ${env.BRANCH_NAME}"
                    
                    if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') {
                        echo 'Deploying to PRODUCTION...'
                        sh '''
                            echo "Production deployment steps:"
                            echo "- Build artifacts are in ./build/ directory"
                            echo "- Ready to deploy to production server"
                            # Add your production deployment commands here
                            # Examples:
                            # scp -r build/* user@prod-server:/var/www/html/
                            # aws s3 sync build/ s3://your-prod-bucket --delete
                            # kubectl apply -f k8s/production/
                        '''
                    } else if (env.BRANCH_NAME == 'develop') {
                        echo 'Deploying to STAGING...'
                        sh '''
                            echo "Staging deployment steps:"
                            echo "- Build artifacts are in ./build/ directory"
                            echo "- Ready to deploy to staging server"
                            # Add your staging deployment commands here
                        '''
                    } else {
                        echo 'Feature branch detected, skipping deployment'
                        echo 'Build artifacts are available for testing'
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
            // Clean up node_modules to save space, but keep build artifacts
            sh 'rm -rf node_modules'
            // Note: not using cleanWs() to preserve build artifacts
        }
        
        success {
            echo '✅ React Pipeline succeeded!'
            script {
                if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') {
                    echo '🚀 Production build ready for deployment!'
                }
            }
        }
        
        failure {
            echo '❌ React Pipeline failed!'
            echo 'Check the console output for details'
        }
        
        unstable {
            echo '⚠️ Pipeline completed with warnings'
        }
    }
}