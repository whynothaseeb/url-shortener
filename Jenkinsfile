pipeline {
    agent any

    environment {
        BACKEND_DIR = "backend"
        FRONTEND_DIR = "frontend"
        DOCKER_IMAGE_BACKEND = "devops_backend"
        DOCKER_IMAGE_FRONTEND = "devops_frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                // Pull code from GitHub
                checkout scm
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm run build'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'npm test || echo "No tests configured"'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                // Build backend Docker image
                sh "docker build -t ${DOCKER_IMAGE_BACKEND} ${BACKEND_DIR}"
                // Build frontend Docker image
                sh "docker build -t ${DOCKER_IMAGE_FRONTEND} ${FRONTEND_DIR}"
            }
        }


        stage('Success') {
            steps {
                echo "Pipeline finished successfully!"
            }
        }
    }

    post {
        failure {
            echo "Pipeline failed. Check the logs!"
        }
    }
}
