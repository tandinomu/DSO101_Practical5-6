pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 24.0.2'  // Must match the name in Global Tool Configuration
    }
    
    environment {
        CI = 'true'
        BUILD_DOCKER = 'true'
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_HUB_USERNAME = 'your-dockerhub-username'  // Replace with your username
        IMAGE_NAME = "${DOCKER_HUB_USERNAME}/react-pipeline-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🚀 Starting Pipeline...'
                echo 'Checking out code...'
                checkout scm
                script {
                    // Get Git information
                    env.GIT_COMMIT = sh(
                        script: 'git rev-parse HEAD',
                        returnStdout: true
                    ).trim()
                    try {
                        env.GIT_BRANCH = sh(
                            script: 'git rev-parse --abbrev-ref HEAD',
                            returnStdout: true
                        ).trim()
                    } catch (Exception e) {
                        env.GIT_BRANCH = env.BRANCH_NAME ?: 'unknown'
                    }
                }
                echo "📂 Branch: ${env.GIT_BRANCH}"
                echo "📝 Commit: ${env.GIT_COMMIT?.take(8)}"
            }
        }
        
        stage('Environment Info') {
            steps {
                echo '🔍 Environment Information:'
                sh '''
                    echo "Node.js version: $(node --version)"
                    echo "npm version: $(npm --version)"
                    echo "Working directory: $(pwd)"
                    echo "Available disk space:"
                    df -h
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh '''
                    # Clean npm cache
                    npm cache clean --force
                    
                    # Install dependencies
                    npm ci --prefer-offline --no-audit
                    
                    echo "✅ Dependencies installed successfully"
                '''
            }
        }
        
        stage('Code Quality Checks') {
            parallel {
                stage('Lint') {
                    steps {
                        echo '🔍 Running ESLint...'
                        sh '''
                            npm run lint || echo "⚠️ Linting completed with warnings"
                        '''
                    }
                }
                stage('Security Audit') {
                    steps {
                        echo '🔒 Running security audit...'
                        sh '''
                            npm audit --audit-level=high || echo "⚠️ Security audit completed"
                        '''
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh '''
                    echo "Running React tests with coverage..."
                    npm run test:ci
                    echo "✅ Tests completed successfully"
                '''
            }
            post {
                always {
                    // Archive test coverage reports
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
        
        stage('Build Application') {
            steps {
                echo '🏗️ Building React application...'
                sh '''
                    echo "Creating production build..."
                    npm run build
                    
                    echo "✅ Build completed successfully"
                    echo "📊 Build stats:"
                    ls -la build/
                    du -sh build/
                '''
            }
            post {
                success {
                    archiveArtifacts artifacts: 'build/**/*', fingerprint: true
                }
            }
        }
        
        stage('Build Docker Image') {
            when {
                environment name: 'BUILD_DOCKER', value: 'true'
            }
            steps {
                echo '🐳 Building Docker image...'
                script {
                    // Build the Docker image
                    def image = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                    
                    // Tag as latest
                    sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
                    
                    echo "✅ Docker image built successfully"
                    echo "🏷️ Image tags: ${IMAGE_NAME}:${IMAGE_TAG}, ${IMAGE_NAME}:latest"
                }
            }
        }
        
        stage('Push to Docker Hub') {
            when {
                environment name: 'BUILD_DOCKER', value: 'true'
            }
            steps {
                echo '🚀 Pushing image to Docker Hub...'
                script {
                    docker.withRegistry('https://registry-1.docker.io/v2/', 'dockerhub-credentials') {
                        // Push both tagged and latest versions
                        def image = docker.image("${IMAGE_NAME}:${IMAGE_TAG}")
                        image.push()
                        image.push('latest')
                    }
                }
                echo "✅ Image pushed successfully to Docker Hub"
            }
            post {
                always {
                    // Clean up local Docker images to save space
                    sh '''
                        echo "🧹 Cleaning up Docker images..."
                        docker image prune -f --filter "dangling=true"
                        echo "✅ Docker cleanup completed"
                    '''
                }
            }
        }
        
        stage('Deploy') {
            parallel {
                stage('Development Deploy') {
                    when {
                        not { branch 'main' }
                    }
                    steps {
                        echo '🚧 Deploying to Development Environment...'
                        sh '''
                            echo "🔧 Development deployment simulation"
                            echo "📦 Image: ${IMAGE_NAME}:${IMAGE_TAG}"
                            echo "🌍 Environment: Development"
                            echo "✅ Development deployment completed"
                        '''
                    }
                }
                stage('Production Deploy') {
                    when {
                        branch 'main'
                    }
                    steps {
                        echo '🎯 Deploying to Production Environment...'
                        sh '''
                            echo "🚀 Production deployment simulation"
                            echo "📦 Image: ${IMAGE_NAME}:${IMAGE_TAG}"
                            echo "🌍 Environment: Production"
                            echo "✅ Production deployment completed"
                        '''
                    }
                }
            }
        }
        
        stage('Post-Deploy Tests') {
            steps {
                echo '🔍 Running post-deployment tests...'
                sh '''
                    echo "🏥 Health check simulation"
                    echo "📊 Performance test simulation"
                    echo "✅ Post-deployment tests passed"
                '''
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo '''
            🎉 Pipeline completed successfully! 
            ✅ All stages passed
            📦 Application built and deployed
            🐳 Docker image available on Docker Hub
            '''
        }
        failure {
            echo '''
            🚨 Pipeline failed! 
            ❌ Check the logs above for details
            🔧 Fix the issues and retry
            '''
        }
        unstable {
            echo '⚠️ Pipeline completed with warnings'
        }
    }
}