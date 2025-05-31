pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 24.0.2'
    }
    
    environment {
        CI = 'true'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout scm
                sh 'pwd && ls -la'
                sh 'ls -la my-jenkins-pipeline-app/'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                dir('my-jenkins-pipeline-app') {
                    sh 'pwd'
                    sh 'ls -la package.json'
                    
                    // Use npm install with verbose output
                    sh 'npm install --no-silent'
                    
                    // Verify installation
                    sh 'echo "✅ Dependencies installed successfully"'
                    sh 'ls -la node_modules/ | head -5'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running React tests...'
                dir('my-jenkins-pipeline-app') {
                    script {
                        try {
                            sh 'npm test -- --coverage --watchAll=false --testTimeout=30000'
                        } catch (Exception e) {
                            echo "⚠️ Tests failed, but continuing: ${e.getMessage()}"
                            currentBuild.result = 'UNSTABLE'
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
                    sh 'echo "✅ Build completed successfully"'
                    sh 'ls -la build/ | head -10'
                    sh 'du -sh build/'
                }
            }
            post {
                success {
                    echo 'Archiving build artifacts...'
                    archiveArtifacts artifacts: 'my-jenkins-pipeline-app/build/**/*', fingerprint: true
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo "🚀 Deployment stage for branch: ${env.BRANCH_NAME}"
                    
                    if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') {
                        echo '🎉 PRODUCTION DEPLOYMENT READY!'
                        dir('my-jenkins-pipeline-app') {
                            sh '''
                                echo "=== Production Build Summary ==="
                                echo "Build location: $(pwd)/build/"
                                echo "Build size: $(du -sh build/)"
                                echo "✅ Ready for deployment to production!"
                            '''
                        }
                    } else {
                        echo '✅ Build completed for testing'
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
            dir('my-jenkins-pipeline-app') {
                sh 'rm -rf node_modules || echo "Cleanup completed"'
            }
        }
        
        success {
            echo '🎉 React Pipeline completed successfully!'
            echo 'All stages passed. Build artifacts are ready for deployment.'
        }
        
        failure {
            echo '❌ React Pipeline failed!'
            echo 'Check the console output above for error details.'
        }
        
        unstable {
            echo '⚠️ Pipeline completed with warnings'
            echo 'Build succeeded but some tests may have failed.'
        }
    }
}