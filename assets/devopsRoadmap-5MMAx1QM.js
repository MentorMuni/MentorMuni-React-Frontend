import{j as e}from"./index-CoYNtXpj.js";import{r as l}from"./vendor-1Xl1G8Az.js";import{l as p}from"./logo-BorjR2R0.js";import{X as b,c as u,_ as g,k as r,y as j}from"./icons-UixAEz13.js";const C=()=>{const[n,c]=l.useState(!1),[a,i]=l.useState("intro"),d=[{id:"intro",title:"Introduction to DevOps"},{id:"linux",title:"Linux Fundamentals"},{id:"networking",title:"Networking Basics"},{id:"git",title:"Git & Version Control"},{id:"cicd",title:"CI/CD Concepts"},{id:"docker",title:"Docker & Containers"},{id:"kubernetes",title:"Kubernetes Basics"},{id:"cloud",title:"Cloud Fundamentals"},{id:"iac",title:"Infrastructure as Code"},{id:"monitoring",title:"Monitoring & Logging"},{id:"interview",title:"Interview Preparation"}],s=({code:t,language:m="bash",id:f})=>{const[x,o]=l.useState(!1),h=()=>{navigator.clipboard.writeText(t),o(!0),setTimeout(()=>o(!1),2e3)};return e.jsxs("div",{className:"bg-[#1E293B] rounded-lg border border-[#E0DCCF] mb-6 overflow-hidden",children:[e.jsxs("div",{className:"flex justify-between items-center px-4 py-2 bg-[#FFFDF8] border-b border-[#E0DCCF]",children:[e.jsx("span",{className:"text-xs text-slate-400",children:m}),e.jsxs("button",{onClick:h,className:"text-slate-400 hover:text-white transition-colors flex items-center gap-2",children:[e.jsx(j,{size:16}),x?"Copied!":"Copy"]})]}),e.jsx("pre",{className:"p-4 overflow-x-auto",children:e.jsx("code",{className:"text-sm text-slate-300 font-mono",children:t})})]})};return e.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white",children:[e.jsx("header",{className:"sticky top-0 z-[100] bg-gradient-to-r from-slate-900 to-slate-900/95 backdrop-blur-md border-b border-[#F0ECE0] shadow-xl",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("img",{src:p,alt:"MentorMuni Logo",className:"h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-contain"}),e.jsx("span",{className:"font-bold text-xl text-white hidden sm:inline",children:"MentorMuni"})]}),e.jsx("nav",{className:"hidden md:flex items-center gap-2"}),e.jsx("button",{onClick:()=>c(!n),className:"md:hidden p-2 hover:bg-white/5 rounded-lg transition-all",children:n?e.jsx(b,{size:24}):e.jsx(u,{size:24})})]})}),e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:[e.jsxs("section",{className:"mb-20",children:[e.jsx("h1",{className:"text-5xl md:text-6xl font-black mb-4",children:"DevOps Roadmap for Beginners"}),e.jsx("p",{className:"text-xl text-slate-300 mb-8 max-w-3xl",children:"Step-by-step roadmap to become a DevOps Engineer in 2026. Learn Linux, Docker, Kubernetes, CI/CD, cloud platforms, and infrastructure automation with practical examples."}),e.jsxs("div",{className:"flex gap-4 flex-wrap",children:[e.jsx("a",{href:"#linux",onClick:t=>{t.preventDefault(),i("linux")},className:"px-8 py-4 bg-cyan-600 hover:bg-cyan-700 rounded-xl font-bold transition-all text-lg",children:"Start Learning"}),e.jsxs("button",{className:"px-8 py-4 border-2 border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white rounded-xl font-bold transition-all flex items-center gap-2",children:[e.jsx(g,{size:20}),"Download Roadmap PDF"]})]}),e.jsx("div",{className:"mt-12 bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:e.jsxs("div",{className:"grid md:grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"What is DevOps?"}),e.jsx("p",{className:"text-slate-300 mb-4",children:"DevOps is a cultural and technical movement that combines software development (Dev) and IT operations (Ops) to shorten development cycles, increase deployment frequency, and enable rapid feature releases with greater reliability."}),e.jsx("p",{className:"text-slate-300",children:"It emphasizes automation, collaboration, continuous integration, continuous deployment, and infrastructure as code."})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Why DevOps Matters in 2026"}),e.jsxs("ul",{className:"space-y-3 text-slate-300",children:[e.jsxs("li",{className:"flex items-center gap-2",children:[e.jsx(r,{size:20,className:"text-green-400 flex-shrink-0"}),"High demand with competitive salaries ($120K-$180K+)"]}),e.jsxs("li",{className:"flex items-center gap-2",children:[e.jsx(r,{size:20,className:"text-green-400 flex-shrink-0"}),"Critical role in modern cloud-native development"]}),e.jsxs("li",{className:"flex items-center gap-2",children:[e.jsx(r,{size:20,className:"text-green-400 flex-shrink-0"}),"Diverse career paths (Platform Engineer, SRE, Cloud Architect)"]}),e.jsxs("li",{className:"flex items-center gap-2",children:[e.jsx(r,{size:20,className:"text-green-400 flex-shrink-0"}),"Remote-friendly with global opportunities"]})]})]})]})})]}),e.jsxs("div",{className:"grid lg:grid-cols-4 gap-8 mb-20",children:[e.jsx("div",{className:"lg:col-span-1",children:e.jsxs("nav",{className:"sticky top-24 bg-white/5 border border-[#E0DCCF] rounded-xl p-4",children:[e.jsx("h3",{className:"font-bold mb-4",children:"Course Modules"}),e.jsx("ul",{className:"space-y-2",children:d.map(t=>e.jsx("li",{children:e.jsx("button",{onClick:()=>i(t.id),className:`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${a===t.id?"bg-cyan-600 text-white font-semibold":"text-slate-300 hover:bg-white/5"}`,children:t.title})},t.id))})]})}),e.jsxs("div",{className:"lg:col-span-3 space-y-12",children:[a==="intro"&&e.jsxs("section",{className:"space-y-8",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Introduction to DevOps"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Career Roles in DevOps"}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"DevOps Engineer"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Builds and maintains deployment pipelines, infrastructure, and tools. Average salary: $130K-$160K"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Site Reliability Engineer (SRE)"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Focuses on system reliability, scaling, and incident response. Average salary: $150K-$180K"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Platform Engineer"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Builds internal platforms for developers. Average salary: $140K-$170K"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Cloud Architect"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Designs cloud infrastructure and solutions. Average salary: $160K-$200K+"})]})]})]}),e.jsxs("div",{className:"bg-gradient-to-r from-[#FF9500]/20 to-cyan-600/20 border border-[#FFB347]/40 rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"2026 Salary Trends"}),e.jsx("p",{className:"text-slate-300 mb-4",children:"DevOps professionals are among the highest-paid in tech with salaries increasing 5-8% annually:"}),e.jsxs("ul",{className:"space-y-2 text-slate-300",children:[e.jsx("li",{children:"Entry Level (0-2 years): $100K-$130K"}),e.jsx("li",{children:"Mid Level (3-5 years): $130K-$160K"}),e.jsx("li",{children:"Senior (5+ years): $160K-$210K+"}),e.jsx("li",{children:"Staff/Principal: $200K-$300K+"})]})]})]}),a==="linux"&&e.jsxs("section",{id:"linux",className:"space-y-8",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Linux Fundamentals"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"File System Structure"}),e.jsx("p",{className:"text-slate-300 mb-4",children:"Linux uses a hierarchical directory structure starting from the root directory (/)."}),e.jsx(s,{code:`# Common Linux directories
/              # Root directory
/home          # User home directories
/etc           # Configuration files
/var           # Variable data (logs, caches)
/usr           # User programs and data
/tmp           # Temporary files
/bin           # Essential command binaries
/sbin          # System binaries (admin commands)
/opt           # Optional software
/var/log       # System logs`,language:"bash",id:"linux-dirs"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"File Permissions"}),e.jsx("p",{className:"text-slate-300 mb-4",children:"Linux permissions use read (r), write (w), and execute (x) for owner, group, and others."}),e.jsx(s,{code:`# View file permissions
ls -la

# Change permissions
chmod 755 script.sh       # Owner: rwx, Group: r-x, Others: r-x
chmod +x script.sh        # Add execute permission
chmod u=rwx,g=rx,o=rx    # Explicit permission setting

# Change ownership
chown user:group file.txt
chown -R user:group /directory`,language:"bash",id:"linux-perms"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Essential Shell Commands"}),e.jsx(s,{code:`# Navigation
pwd                    # Print working directory
cd /path              # Change directory
ls -la                # List files with details

# File operations
mkdir directory        # Create directory
touch file.txt        # Create empty file
cp source dest        # Copy file
mv source dest        # Move/rename file
rm file               # Delete file
rm -r directory       # Delete directory recursively

# Text processing
cat file.txt          # Display file contents
grep "pattern" file   # Search for pattern
sed 's/old/new/g'     # Find and replace
awk '{print $1}'      # Process columns

# System information
whoami                # Current user
uname -a              # System information
df -h                 # Disk usage
ps aux                # Running processes
top                   # Resource monitor`,language:"bash",id:"linux-commands"})]})]}),a==="networking"&&e.jsxs("section",{id:"networking",className:"space-y-8",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Networking Basics"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"TCP/IP Model"}),e.jsx("p",{className:"text-slate-300 mb-6",children:"The TCP/IP model has four layers that enable internet communication."}),e.jsxs("div",{className:"space-y-4 mb-6",children:[e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Application Layer"}),e.jsx("p",{className:"text-sm text-slate-300",children:"HTTP, HTTPS, SSH, FTP, DNS, SMTP"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Transport Layer"}),e.jsx("p",{className:"text-sm text-slate-300",children:"TCP (reliable), UDP (fast), connection management"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Internet Layer"}),e.jsx("p",{className:"text-sm text-slate-300",children:"IP (IPv4, IPv6), routing, ICMP, ARP"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Link Layer"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Ethernet, WiFi, hardware addressing"})]})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"DNS & HTTP/HTTPS"}),e.jsx(s,{code:`# DNS Lookup
nslookup google.com
dig google.com
host google.com

# HTTP Status Codes
200 - OK (request successful)
301 - Moved Permanently (redirect)
400 - Bad Request (client error)
401 - Unauthorized (authentication required)
403 - Forbidden (access denied)
404 - Not Found (resource missing)
500 - Internal Server Error
503 - Service Unavailable

# HTTPS
Uses SSL/TLS for encrypted communication
Port 443 (HTTPS) vs Port 80 (HTTP)
Certificates verify server identity`,language:"bash",id:"networking-dns"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Ports & Protocols"}),e.jsx(s,{code:`# Well-known ports
22   - SSH (secure shell)
80   - HTTP (web)
443  - HTTPS (secure web)
3306 - MySQL database
5432 - PostgreSQL database
6379 - Redis cache
8080 - Alternative HTTP
9200 - Elasticsearch

# Check open ports
netstat -tlnp
ss -tlnp

# Test connection
telnet host port
nc -zv host port`,language:"bash",id:"networking-ports"})]})]}),a==="git"&&e.jsxs("section",{id:"git",className:"space-y-8",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Git & Version Control"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Git Workflow"}),e.jsx(s,{code:`# Initialize repository
git init
git clone https://github.com/user/repo.git

# Configure git
git config --global user.name "Your Name"
git config --global user.email "email@example.com"

# Check status
git status
git log --oneline

# Stage and commit
git add file.txt              # Stage specific file
git add .                     # Stage all changes
git commit -m "Commit message"

# Push and pull
git push origin main
git pull origin main

# View differences
git diff                      # Unstaged changes
git diff --staged             # Staged changes
git diff branch1 branch2      # Between branches`,language:"bash",id:"git-workflow"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Branching & Merging"}),e.jsx(s,{code:`# Create and switch branches
git branch feature/new-feature
git checkout feature/new-feature
git checkout -b feature/new-feature    # Create and switch

# List branches
git branch                    # Local branches
git branch -a                 # All branches

# Merge branches
git checkout main
git merge feature/new-feature

# Merge strategies
git merge --no-ff             # Create merge commit
git merge --squash            # Squash commits

# Delete branch
git branch -d feature/new-feature      # Local
git push origin --delete feature/new-feature  # Remote

# Rebase (alternative to merge)
git rebase main
git rebase -i HEAD~3          # Interactive rebase last 3 commits`,language:"bash",id:"git-branching"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Pull Requests"}),e.jsx("p",{className:"text-slate-300 mb-4",children:"Pull Requests (PRs) are the standard for code review and collaboration:"}),e.jsx(s,{code:`# Typical PR workflow
1. Create feature branch
   git checkout -b feature/amazing-feature

2. Make changes and commit
   git add .
   git commit -m "Add amazing feature"

3. Push to remote
   git push origin feature/amazing-feature

4. Open PR on GitHub
   - Describe changes
   - Request reviewers
   - Link related issues

5. Address review comments
   git add .
   git commit -m "Address review feedback"
   git push

6. Merge when approved
   - Squash if needed
   - Delete branch
   - Confirm in main branch`,language:"bash",id:"git-pr"})]})]}),a==="cicd"&&e.jsxs("section",{id:"cicd",className:"space-y-8",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"CI/CD Concepts"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"What is CI/CD?"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Continuous Integration (CI)"}),e.jsx("p",{className:"text-slate-300",children:"Automatically test and validate code changes on each commit. Catches bugs early and ensures code quality."})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Continuous Deployment (CD)"}),e.jsx("p",{className:"text-slate-300",children:"Automatically deploy approved changes to production. Enables rapid and reliable releases."})]})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Jenkins Pipeline Example"}),e.jsx(s,{code:`pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/user/repo.git'
      }
    }

    stage('Build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
        sh 'npm run lint'
      }
    }

    stage('Deploy') {
      steps {
        sh 'sh ./deploy.sh'
      }
    }
  }

  post {
    always {
      deleteDir()
    }
  }
}`,language:"groovy",id:"jenkins-pipeline"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"GitHub Actions Workflow"}),e.jsx(s,{code:`name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Run tests
      run: npm test

    - name: Run linter
      run: npm run lint

    - name: Build application
      run: npm run build

    - name: Deploy
      if: github.ref == 'refs/heads/main'
      run: |
        deploy-script.sh`,language:"yaml",id:"github-actions"})]})]}),a==="docker"&&e.jsxs("section",{id:"docker",className:"space-y-8",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Docker & Containers"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"What is Docker?"}),e.jsx("p",{className:"text-slate-300 mb-4",children:"Docker containerizes applications with all dependencies into portable units that run consistently across environments."}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-4 mb-6",children:[e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Image"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Blueprint for containers, includes code and dependencies"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Container"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Running instance of an image, isolated process"})]})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Dockerfile Example"}),e.jsx(s,{code:`FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]`,language:"dockerfile",id:"dockerfile"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Docker Commands"}),e.jsx(s,{code:`# Build image
docker build -t myapp:1.0 .

# Run container
docker run -d -p 3000:3000 --name myapp myapp:1.0

# List images and containers
docker images
docker ps -a

# View logs
docker logs myapp
docker logs -f myapp        # Follow logs

# Stop and remove
docker stop myapp
docker rm myapp

# Push to registry
docker tag myapp:1.0 user/myapp:1.0
docker push user/myapp:1.0`,language:"bash",id:"docker-commands"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Docker Compose"}),e.jsx(s,{code:`version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: db
    depends_on:
      - db
    volumes:
      - ./src:/app/src

  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`,language:"yaml",id:"docker-compose"})]})]}),a==="kubernetes"&&e.jsxs("section",{id:"kubernetes",className:"space-y-8",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Kubernetes Basics"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Kubernetes Concepts"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Pod"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Smallest deployable unit, usually one container per pod"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Service"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Exposes pods for network access, provides stable IP"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Deployment"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Manages pod replicas, handles rolling updates"})]})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Kubernetes Deployment YAML"}),e.jsx(s,{code:`apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: myapp:1.0
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: webapp-service
spec:
  selector:
    app: webapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer`,language:"yaml",id:"k8s-deployment"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"kubectl Commands"}),e.jsx(s,{code:`# Cluster information
kubectl cluster-info
kubectl get nodes

# Deployments
kubectl apply -f deployment.yaml
kubectl get deployments
kubectl describe deployment webapp
kubectl scale deployment webapp --replicas=5

# Pods
kubectl get pods
kubectl describe pod pod-name
kubectl logs pod-name
kubectl exec -it pod-name -- bash

# Services
kubectl get services
kubectl port-forward service/webapp-service 8080:80

# Updates
kubectl set image deployment/webapp webapp=myapp:2.0 --record
kubectl rollout history deployment/webapp
kubectl rollout undo deployment/webapp`,language:"bash",id:"kubectl-commands"})]})]}),a==="cloud"&&e.jsxs("section",{id:"cloud",className:"space-y-8",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Cloud Fundamentals"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"AWS Core Services"}),e.jsxs("div",{className:"space-y-4 mb-6",children:[e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-orange-400 mb-2",children:"EC2 (Elastic Compute Cloud)"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Virtual servers in the cloud. Scalable computing capacity on demand."})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-orange-400 mb-2",children:"S3 (Simple Storage Service)"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Object storage for files, backups, and static content."})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-orange-400 mb-2",children:"RDS (Relational Database Service)"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Managed databases (PostgreSQL, MySQL, etc.)"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-orange-400 mb-2",children:"IAM (Identity & Access Management)"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Control access to AWS resources with users, roles, policies"})]})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"GCP Core Services"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-blue-400 mb-2",children:"Compute Engine"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Virtual machines similar to AWS EC2"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-blue-400 mb-2",children:"Cloud Storage"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Object storage for files and data"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-blue-400 mb-2",children:"Cloud SQL"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Managed relational databases"})]})]})]})]}),a==="iac"&&e.jsxs("section",{id:"iac",className:"space-y-8",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Infrastructure as Code"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Terraform Basics"}),e.jsx("p",{className:"text-slate-300 mb-4",children:"Terraform allows you to define infrastructure in code, enabling version control and reproducible deployments."}),e.jsx(s,{code:`# Configure AWS provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Create EC2 instance
resource "aws_instance" "webapp" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.deployer.key_name

  tags = {
    Name = "WebApp"
  }
}

# Create security group
resource "aws_security_group" "web" {
  name = "web-security-group"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`,language:"hcl",id:"terraform-example"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Terraform State Management"}),e.jsx(s,{code:`# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Plan changes
terraform plan -out=tfplan

# Apply changes
terraform apply tfplan

# Destroy infrastructure
terraform destroy

# View state
terraform state list
terraform state show aws_instance.webapp

# Remote state (S3 backend)
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}`,language:"bash",id:"terraform-commands"})]})]}),a==="monitoring"&&e.jsxs("section",{id:"monitoring",className:"space-y-8",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Monitoring & Logging"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p=8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Monitoring Stack"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Prometheus"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Time-series database for metrics. Pulls metrics from targets and stores them."})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Grafana"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Data visualization and dashboards. Creates graphs from Prometheus data."})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Alertmanager"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Handles alerts from Prometheus. Routes and groups alerts."})]})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"ELK Stack (Elasticsearch, Logstash, Kibana)"}),e.jsx("p",{className:"text-slate-300 mb-6",children:"The ELK stack collects, processes, and visualizes logs:"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-yellow-400 mb-2",children:"Elasticsearch"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Distributed search engine for log storage and analysis"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-yellow-400 mb-2",children:"Logstash"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Log processor that collects, parses, and forwards logs"})]}),e.jsxs("div",{className:"bg-[#1E293B] p-4 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-yellow-400 mb-2",children:"Kibana"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Visualization layer for searching and analyzing logs"})]})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Key Metrics to Monitor"}),e.jsx(s,{code:`# System metrics
CPU usage          # % of CPU utilization
Memory usage       # % of RAM in use
Disk I/O           # Read/write operations
Network bandwidth  # Data in/out

# Application metrics
Request latency    # Response time (p50, p95, p99)
Error rate         # % of failed requests
Throughput         # Requests per second
Database queries   # Query duration and count

# Infrastructure metrics
Pod/container restarts
Deployment replicas
Node availability
Load balancer health`,language:"bash",id:"monitoring-metrics"})]})]}),a==="interview"&&e.jsxs("section",{id:"interview",className:"space-y-8",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Interview Preparation"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Common Interview Questions"}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"What is the difference between traditional IT operations and DevOps?"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Traditional IT operations have separate Dev and Ops teams, slow release cycles, and manual processes. DevOps combines teams, automates everything, uses CI/CD, and focuses on rapid, reliable deployments."})]}),e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Explain the benefits of containerization"}),e.jsx("p",{className:"text-sm text-slate-300",children:'Containers provide consistency across environments, lightweight isolation, fast startup, efficient resource usage, and easy scaling. No more "works on my machine" problems.'})]}),e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"What are the advantages of Infrastructure as Code?"}),e.jsx("p",{className:"text-sm text-slate-300",children:"Version control, reproducibility, disaster recovery, easier testing, reduced manual errors, self-documentation, and ability to provision/tear down infrastructure quickly."})]}),e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"How would you handle a production outage?"}),e.jsx("p",{className:"text-sm text-slate-300",children:"1) Declare incident and form war room. 2) Assess impact. 3) Implement immediate fix if available, rollback if needed. 4) Root cause analysis. 5) Implement permanent fix. 6) Post-mortem and process improvements."})]})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Scenario-Based Questions"}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"Design a CI/CD pipeline for a microservices application"}),e.jsx("p",{className:"text-sm text-slate-300 mb-3",children:"Consider: Git triggers → automated tests → build Docker images → push to registry → deploy to staging → run integration tests → deploy to production with blue-green or canary strategy."})]}),e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"How would you ensure high availability for a critical application?"}),e.jsx("p",{className:"text-sm text-slate-300 mb-3",children:"Use load balancers, multiple replicas, health checks, auto-scaling, redundant databases with replication, multi-region deployment, automated failover, and proper monitoring/alerting."})]}),e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"How would you handle secrets in your infrastructure?"}),e.jsx("p",{className:"text-sm text-slate-300 mb-3",children:"Use secret management tools (Vault, AWS Secrets Manager), never commit secrets to Git, rotate regularly, use least privilege access, audit access logs, and integrate with CI/CD safely."})]})]})]}),e.jsxs("div",{className:"bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-8 text-center",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Ready for Your Interview?"}),e.jsx("p",{className:"text-white mb-6",children:"Take our DevOps assessment or practice with mock interviews"}),e.jsxs("div",{className:"flex flex-wrap gap-4 justify-center",children:[e.jsx("a",{href:"/start-assessment",className:"px-6 py-3 bg-white text-cyan-600 font-bold rounded-lg hover:bg-slate-100 transition-all",children:"Start Assessment"}),e.jsx("a",{href:"/mock-interviews",className:"px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all",children:"Mock Interviews"})]})]})]})]})]}),e.jsxs("section",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-20",children:[e.jsx("h2",{className:"text-3xl font-bold mb-6",children:"Additional Resources"}),e.jsxs("div",{className:"grid md:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h3",{className:"font-bold text-cyan-400 mb-3",children:"Recommended Tools"}),e.jsxs("ul",{className:"text-sm text-slate-300 space-y-2",children:[e.jsx("li",{children:"Docker & Docker Compose"}),e.jsx("li",{children:"Kubernetes (k3s for learning)"}),e.jsx("li",{children:"Jenkins or GitHub Actions"}),e.jsx("li",{children:"Terraform"}),e.jsx("li",{children:"Prometheus & Grafana"})]})]}),e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h3",{className:"font-bold text-cyan-400 mb-3",children:"Learning Path"}),e.jsxs("ul",{className:"text-sm text-slate-300 space-y-2",children:[e.jsx("li",{children:"1. Linux & Bash scripting"}),e.jsx("li",{children:"2. Git & version control"}),e.jsx("li",{children:"3. Docker containers"}),e.jsx("li",{children:"4. CI/CD pipelines"}),e.jsx("li",{children:"5. Kubernetes & orchestration"})]})]}),e.jsxs("div",{className:"bg-[#1E293B] p-6 rounded-lg",children:[e.jsx("h3",{className:"font-bold text-cyan-400 mb-3",children:"Next Steps"}),e.jsxs("ul",{className:"text-sm text-slate-300 space-y-2",children:[e.jsx("li",{children:e.jsx("a",{href:"/resume-analyzer",className:"text-cyan-400 hover:text-cyan-300",children:"Optimize your resume"})}),e.jsx("li",{children:e.jsx("a",{href:"/start-assessment",className:"text-cyan-400 hover:text-cyan-300",children:"Take DevOps assessment"})}),e.jsx("li",{children:e.jsx("a",{href:"/mock-interviews",className:"text-cyan-400 hover:text-cyan-300",children:"Practice with mock interviews"})})]})]})]})]}),e.jsxs("section",{className:"bg-gradient-to-r from-[#FF9500] to-cyan-600 rounded-2xl p-12 text-center",children:[e.jsx("h2",{className:"text-3xl font-black mb-4",children:"Ready to Become a DevOps Engineer?"}),e.jsx("p",{className:"text-lg mb-8 text-white/90",children:"Master DevOps with hands-on projects, assessments, and 1:1 mentorship from industry experts."}),e.jsxs("div",{className:"flex flex-wrap gap-4 justify-center",children:[e.jsx("a",{href:"/start-assessment",className:"px-8 py-4 bg-white text-[#FF9500] rounded-xl font-bold hover:bg-slate-100 transition-all",children:"Start Assessment"}),e.jsx("a",{href:"/learning-paths",className:"px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all",children:"View All Paths"})]})]})]})]})};export{C as default};
