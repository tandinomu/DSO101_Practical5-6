pipeline {
    agent any
    
    environment {
        DOCKER_USERNAME = 'tandinomu'  // Replace with your Docker Hub username
        IMAGE_NAME = 'my-jenkins-pipeline-app'
        CONTAINER_NAME = 'my-jenkins-app'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "🐳 Building Docker image..."
                    docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .
                    docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest
                    docker tag ${IMAGE_NAME}:latest ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
                    docker tag ${IMAGE_NAME}:latest ${DOCKER_USERNAME}/${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }
        
        stage('Test Container') {
            steps {
                sh '''
                    echo "🧪 Testing container..."
                    docker run -d --name test-${BUILD_NUMBER} -p 8080:80 ${IMAGE_NAME}:latest
                    sleep 10
                    curl -f http://localhost:8080 && echo "✅ Container test passed"
                    docker stop test-${BUILD_NUMBER}
                    docker rm test-${BUILD_NUMBER}
                '''
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "🚀 Pushing to Docker Hub..."
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${BUILD_NUMBER}
                        docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
                        echo "✅ Pushed to Docker Hub!"
                    '''
                }
            }
        }
        
        stage('Deploy Container') {
            steps {
                sh '''
                    echo "🚀 Deploying container..."
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker run -d --name ${CONTAINER_NAME} -p 3000:80 --restart unless-stopped ${DOCKER_USERNAME}/${IMAGE_NAME}:${BUILD_NUMBER}
                    echo "✅ Deployed! Access at http://localhost:3000"
                '''
            }
        }
    }
    
    post {
        always {
            sh 'docker system prune -f || true'
        }
        success {
            echo '''
            🎉 Pipeline completed successfully!
            🐳 Image pushed to Docker Hub
            🚀 Container deployed and running
            🌐 Access: http://localhost:3000
            '''
        }
    }
}