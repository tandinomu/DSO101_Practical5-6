pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 24.0.2'  // Matches your Jenkins configuration
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
                
                // Verify directory structure
                sh 'pwd'
                sh 'ls -la'
                sh 'ls -la my-jenkins-pipeline-app/'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                dir('my-jenkins-pipeline-app') {
                    sh 'pwd'
                    sh 'ls -la'
                    sh 'npm ci --silent'
                }
            }
        }
        
        stage('Lint Code') {
            steps {
                echo 'Running ESLint...'
                dir('my-jenkins-pipeline-app') {
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
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running React tests...'
                dir('my-jenkins-pipeline-app') {
                    script {
                        // Set test environment variables
                        withEnv(['CI=true']) {
                            sh 'npm test -- --coverage --watchAll=false'
                        }
                    }
                }
            }
            post {
                always {
                    // Archive test results if they exist
                    script {
                        if (fileExists('my-jenkins-pipeline-app/coverage/lcov.info')) {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'my-jenkins-pipeline-app/coverage/lcov-report',
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
                dir('my-jenkins-pipeline-app') {
                    sh 'npm run build'
                    sh 'ls -la build/'  // Show build directory contents
                }
            }
            post {
                success {
                    echo 'React build completed successfully!'
                    // Archive the build artifacts
                    archiveArtifacts artifacts: 'my-jenkins-pipeline-app/build/**/*', fingerprint: true
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo "Deploying based on branch: ${env.BRANCH_NAME}"
                    
                    if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') {
                        echo 'Deploying to PRODUCTION...'
                        dir('my-jenkins-pipeline-app') {
                            sh '''
                                echo "Production deployment steps:"
                                echo "- Build artifacts are in ./build/ directory"
                                echo "- Ready to deploy to production server"
                                ls -la build/
                                # Add your production deployment commands here
                                # Examples:
                                # scp -r build/* user@prod-server:/var/www/html/
                                # aws s3 sync build/ s3://your-prod-bucket --delete
                                # kubectl apply -f k8s/production/
                            '''
                        }
                    } else if (env.BRANCH_NAME == 'develop') {
                        echo 'Deploying to STAGING...'
                        dir('my-jenkins-pipeline-app') {
                            sh '''
                                echo "Staging deployment steps:"
                                echo "- Build artifacts are in ./build/ directory"
                                echo "- Ready to deploy to staging server"
                                ls -la build/
                                # Add your staging deployment commands here
                            '''
                        }
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
            dir('my-jenkins-pipeline-app') {
                sh 'rm -rf node_modules || echo "node_modules cleanup completed"'
            }
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