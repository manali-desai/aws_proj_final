# AWS EC2 Deployment and CI/CD Pipeline

This repository contains the Flask backend and Express frontend applications deployed on an AWS EC2 instance, along with Jenkins CI/CD pipeline configuration to automate the deployment process.

---

## Part 1: Deployment on AWS EC2

### Overview
In Part 1, both the Flask backend and Express frontend were deployed on a single Amazon EC2 instance. The applications are configured to run on different ports and are managed using **pm2** to ensure they remain active even after logout or instance restart.

### Setup Steps

#### 1. SSH into EC2
```bash
ssh -i "course_manali.pem" ubuntu@15.207.254.229
```

#### 2. Update and Install Dependencies
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3.12-venv nodejs npm git
```

#### 3. Clone Project Repository
```bash
cd ~
git clone https://github.com/manali-desai/aws_proj_final.git jenkins_proj
```

#### 4. Flask Backend Setup
```bash
cd ~/jenkins_proj/flask_backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pm2 start venv/bin/python --name flask-app -- -m flask run --host=0.0.0.0 --port=8000
```

#### 5. Express Frontend Setup
```bash
cd ~/jenkins_proj/flask_frontend
npm install
pm2 start server.js --name express-app --watch
```

### Access Applications
- **Flask Backend:** `http://15.207.254.229:8000/`  
- **Express Frontend:** `http://15.207.254.229:3000/`

---

## Part 2: CI/CD Pipeline Using Jenkins

### Jenkins Installation

1. Add Jenkins repository and key:
```bash
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
```

2. Update and install Jenkins:
```bash
sudo apt update
sudo apt install -y openjdk-17-jdk jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

3. Access Jenkins via SSH tunnel:
```powershell
ssh -i "C:/Users/Admin/aws/course_manali.pem" -L 8080:localhost:8080 ubuntu@15.207.254.229
```
Open in browser:
```
http://localhost:8080
```

---

## Jenkins Pipelines

### Flask CI/CD Pipeline (`flask_backend/Jenkinsfile`)
```groovy
pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/manali-desai/aws_proj_final.git'
            }
        }
        stage('Create Python Virtualenv') {
            steps {
                sh '''
                  python3 -m venv venv
                  venv/bin/python3 -m pip install --upgrade pip
                  venv/bin/python3 -m pip install -r flask_backend/requirements.txt
                '''
            }
        }
        stage('Deploy Flask App') {
            steps {
                sh '''
                  venv/bin/python3 -m pip install pm2 || true
                  pm2 delete flask-app || true
                  pm2 start venv/bin/python --name flask-app -- -m flask run --host=0.0.0.0 --port=8000
                '''
            }
        }
    }
}
```

### Express CI/CD Pipeline (`flask_frontend/Jenkinsfile`)
```groovy
pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/manali-desai/aws_proj_final.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                dir('flask_frontend') {
                    sh 'npm install'
                }
            }
        }
        stage('Deploy Express App') {
            steps {
                sh '''
                  pm2 delete express-app || true
                  pm2 start flask_frontend/server.js --name express-app --watch
                '''
            }
        }
    }
}
```

---

## Pipeline Configuration 

- In Jenkins job configuration, set:
  - **Script Path (Flask):** `flask_backend/Jenkinsfile`
  - **Script Path (Express):** `flask_frontend/Jenkinsfile`
  - **Disable Lightweight checkout**
- Ensure the Git repository URL and branch (`main`) are correct.

---

## Summary of Achievements

- Installed and configured Jenkins on AWS EC2  
- Deployed Flask and Express manually  
- Configured pm2 to keep apps running  
- Created automated CI/CD pipelines in Jenkins  
- Verified pipelines and application access via public IP




