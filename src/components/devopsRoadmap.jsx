import React, { useState, useEffect } from 'react';
import { Copy, Menu, X, Check, AlertCircle, Download } from 'lucide-react';
import logo from '../assets/logo.png';

const DevOpsRoadmap = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  const topics = [
    { id: 'intro', title: 'Introduction to DevOps' },
    { id: 'linux', title: 'Linux Fundamentals' },
    { id: 'networking', title: 'Networking Basics' },
    { id: 'git', title: 'Git & Version Control' },
    { id: 'cicd', title: 'CI/CD Concepts' },
    { id: 'docker', title: 'Docker & Containers' },
    { id: 'kubernetes', title: 'Kubernetes Basics' },
    { id: 'cloud', title: 'Cloud Fundamentals' },
    { id: 'iac', title: 'Infrastructure as Code' },
    { id: 'monitoring', title: 'Monitoring & Logging' },
    { id: 'interview', title: 'Interview Preparation' },
  ];

  const CodeBlock = ({ code, language = 'bash', id }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="bg-[#1E293B] rounded-lg border border-white/10 mb-6 overflow-hidden">
        <div className="flex justify-between items-center px-4 py-2 bg-[#0F172A] border-b border-white/10">
          <span className="text-xs text-slate-400">{language}</span>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <Copy size={16} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto">
          <code className="text-sm text-slate-300 font-mono">{code}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-gradient-to-r from-slate-900 to-slate-900/95 backdrop-blur-md border-b border-white/5 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MentorMuni Logo" className="h-8 w-auto" />
            <span className="font-bold text-xl text-white hidden sm:inline">MentorMuni</span>
          </div>

          <nav className="hidden md:flex items-center gap-2">
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            {isNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-20">
          <h1 className="text-5xl md:text-6xl font-black mb-4">DevOps Roadmap for Beginners</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl">
            Step-by-step roadmap to become a DevOps Engineer in 2026. Learn Linux, Docker, Kubernetes, CI/CD, cloud platforms, and infrastructure automation with practical examples.
          </p>

          <div className="flex gap-4 flex-wrap">
            <a
              href="#linux"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('linux');
              }}
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 rounded-xl font-bold transition-all text-lg"
            >
              Start Learning
            </a>
            <button className="px-8 py-4 border-2 border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white rounded-xl font-bold transition-all flex items-center gap-2">
              <Download size={20} />
              Download Roadmap PDF
            </button>
          </div>

          <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">What is DevOps?</h3>
                <p className="text-slate-300 mb-4">
                  DevOps is a cultural and technical movement that combines software development (Dev) and IT operations (Ops) to shorten development cycles, increase deployment frequency, and enable rapid feature releases with greater reliability.
                </p>
                <p className="text-slate-300">
                  It emphasizes automation, collaboration, continuous integration, continuous deployment, and infrastructure as code.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Why DevOps Matters in 2026</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check size={20} className="text-green-400 flex-shrink-0" />
                    High demand with competitive salaries ($120K-$180K+)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={20} className="text-green-400 flex-shrink-0" />
                    Critical role in modern cloud-native development
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={20} className="text-green-400 flex-shrink-0" />
                    Diverse career paths (Platform Engineer, SRE, Cloud Architect)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={20} className="text-green-400 flex-shrink-0" />
                    Remote-friendly with global opportunities
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <div className="grid lg:grid-cols-4 gap-8 mb-20">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="sticky top-24 bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="font-bold mb-4">Course Modules</h3>
              <ul className="space-y-2">
                {topics.map((topic) => (
                  <li key={topic.id}>
                    <button
                      onClick={() => setActiveSection(topic.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === topic.id
                          ? 'bg-cyan-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {topic.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Intro */}
            {activeSection === 'intro' && (
              <section className="space-y-8">
                <h2 className="text-4xl font-black mb-6">Introduction to DevOps</h2>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Career Roles in DevOps</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-[#1E293B] p-6 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">DevOps Engineer</h4>
                      <p className="text-sm text-slate-300">Builds and maintains deployment pipelines, infrastructure, and tools. Average salary: $130K-$160K</p>
                    </div>
                    <div className="bg-[#1E293B] p-6 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Site Reliability Engineer (SRE)</h4>
                      <p className="text-sm text-slate-300">Focuses on system reliability, scaling, and incident response. Average salary: $150K-$180K</p>
                    </div>
                    <div className="bg-[#1E293B] p-6 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Platform Engineer</h4>
                      <p className="text-sm text-slate-300">Builds internal platforms for developers. Average salary: $140K-$170K</p>
                    </div>
                    <div className="bg-[#1E293B] p-6 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Cloud Architect</h4>
                      <p className="text-sm text-slate-300">Designs cloud infrastructure and solutions. Average salary: $160K-$200K+</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-indigo-400/30 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">2026 Salary Trends</h3>
                  <p className="text-slate-300 mb-4">
                    DevOps professionals are among the highest-paid in tech with salaries increasing 5-8% annually:
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li>Entry Level (0-2 years): $100K-$130K</li>
                    <li>Mid Level (3-5 years): $130K-$160K</li>
                    <li>Senior (5+ years): $160K-$210K+</li>
                    <li>Staff/Principal: $200K-$300K+</li>
                  </ul>
                </div>
              </section>
            )}

            {/* Linux Fundamentals */}
            {activeSection === 'linux' && (
              <section id="linux" className="space-y-8">
                <h2 className="text-4xl font-black mb-6">Linux Fundamentals</h2>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">File System Structure</h3>
                  <p className="text-slate-300 mb-4">Linux uses a hierarchical directory structure starting from the root directory (/).</p>

                  <CodeBlock
                    code={`# Common Linux directories
/              # Root directory
/home          # User home directories
/etc           # Configuration files
/var           # Variable data (logs, caches)
/usr           # User programs and data
/tmp           # Temporary files
/bin           # Essential command binaries
/sbin          # System binaries (admin commands)
/opt           # Optional software
/var/log       # System logs`}
                    language="bash"
                    id="linux-dirs"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">File Permissions</h3>
                  <p className="text-slate-300 mb-4">Linux permissions use read (r), write (w), and execute (x) for owner, group, and others.</p>

                  <CodeBlock
                    code={`# View file permissions
ls -la

# Change permissions
chmod 755 script.sh       # Owner: rwx, Group: r-x, Others: r-x
chmod +x script.sh        # Add execute permission
chmod u=rwx,g=rx,o=rx    # Explicit permission setting

# Change ownership
chown user:group file.txt
chown -R user:group /directory`}
                    language="bash"
                    id="linux-perms"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Essential Shell Commands</h3>

                  <CodeBlock
                    code={`# Navigation
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
top                   # Resource monitor`}
                    language="bash"
                    id="linux-commands"
                  />
                </div>
              </section>
            )}

            {/* Networking */}
            {activeSection === 'networking' && (
              <section id="networking" className="space-y-8">
                <h2 className="text-4xl font-black mb-6">Networking Basics</h2>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">TCP/IP Model</h3>
                  <p className="text-slate-300 mb-6">The TCP/IP model has four layers that enable internet communication.</p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Application Layer</h4>
                      <p className="text-sm text-slate-300">HTTP, HTTPS, SSH, FTP, DNS, SMTP</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Transport Layer</h4>
                      <p className="text-sm text-slate-300">TCP (reliable), UDP (fast), connection management</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Internet Layer</h4>
                      <p className="text-sm text-slate-300">IP (IPv4, IPv6), routing, ICMP, ARP</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Link Layer</h4>
                      <p className="text-sm text-slate-300">Ethernet, WiFi, hardware addressing</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">DNS & HTTP/HTTPS</h3>

                  <CodeBlock
                    code={`# DNS Lookup
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
Certificates verify server identity`}
                    language="bash"
                    id="networking-dns"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Ports & Protocols</h3>

                  <CodeBlock
                    code={`# Well-known ports
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
nc -zv host port`}
                    language="bash"
                    id="networking-ports"
                  />
                </div>
              </section>
            )}

            {/* Git & Version Control */}
            {activeSection === 'git' && (
              <section id="git" className="space-y-8">
                <h2 className="text-4xl font-black mb-6">Git & Version Control</h2>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Git Workflow</h3>

                  <CodeBlock
                    code={`# Initialize repository
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
git diff branch1 branch2      # Between branches`}
                    language="bash"
                    id="git-workflow"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Branching & Merging</h3>

                  <CodeBlock
                    code={`# Create and switch branches
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
git rebase -i HEAD~3          # Interactive rebase last 3 commits`}
                    language="bash"
                    id="git-branching"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Pull Requests</h3>
                  <p className="text-slate-300 mb-4">
                    Pull Requests (PRs) are the standard for code review and collaboration:
                  </p>

                  <CodeBlock
                    code={`# Typical PR workflow
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
   - Confirm in main branch`}
                    language="bash"
                    id="git-pr"
                  />
                </div>
              </section>
            )}

            {/* CI/CD */}
            {activeSection === 'cicd' && (
              <section id="cicd" className="space-y-8">
                <h2 className="text-4xl font-black mb-6">CI/CD Concepts</h2>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">What is CI/CD?</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-cyan-400 mb-2">Continuous Integration (CI)</h4>
                      <p className="text-slate-300">Automatically test and validate code changes on each commit. Catches bugs early and ensures code quality.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-cyan-400 mb-2">Continuous Deployment (CD)</h4>
                      <p className="text-slate-300">Automatically deploy approved changes to production. Enables rapid and reliable releases.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Jenkins Pipeline Example</h3>

                  <CodeBlock
                    code={`pipeline {
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
}`}
                    language="groovy"
                    id="jenkins-pipeline"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">GitHub Actions Workflow</h3>

                  <CodeBlock
                    code={`name: CI/CD Pipeline

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
        deploy-script.sh`}
                    language="yaml"
                    id="github-actions"
                  />
                </div>
              </section>
            )}

            {/* Docker */}
            {activeSection === 'docker' && (
              <section id="docker" className="space-y-8">
                <h2 className="text-4xl font-black mb-6">Docker & Containers</h2>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">What is Docker?</h3>
                  <p className="text-slate-300 mb-4">
                    Docker containerizes applications with all dependencies into portable units that run consistently across environments.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Image</h4>
                      <p className="text-sm text-slate-300">Blueprint for containers, includes code and dependencies</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Container</h4>
                      <p className="text-sm text-slate-300">Running instance of an image, isolated process</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Dockerfile Example</h3>

                  <CodeBlock
                    code={`FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]`}
                    language="dockerfile"
                    id="dockerfile"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Docker Commands</h3>

                  <CodeBlock
                    code={`# Build image
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
docker push user/myapp:1.0`}
                    language="bash"
                    id="docker-commands"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Docker Compose</h3>

                  <CodeBlock
                    code={`version: '3.8'

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
  postgres_data:`}
                    language="yaml"
                    id="docker-compose"
                  />
                </div>
              </section>
            )}

            {/* Kubernetes */}
            {activeSection === 'kubernetes' && (
              <section id="kubernetes" className="space-y-8">
                <h2 className="text-4xl font-black mb-6">Kubernetes Basics</h2>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Kubernetes Concepts</h3>

                  <div className="space-y-4">
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Pod</h4>
                      <p className="text-sm text-slate-300">Smallest deployable unit, usually one container per pod</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Service</h4>
                      <p className="text-sm text-slate-300">Exposes pods for network access, provides stable IP</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Deployment</h4>
                      <p className="text-sm text-slate-300">Manages pod replicas, handles rolling updates</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Kubernetes Deployment YAML</h3>

                  <CodeBlock
                    code={`apiVersion: apps/v1
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
  type: LoadBalancer`}
                    language="yaml"
                    id="k8s-deployment"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">kubectl Commands</h3>

                  <CodeBlock
                    code={`# Cluster information
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
kubectl rollout undo deployment/webapp`}
                    language="bash"
                    id="kubectl-commands"
                  />
                </div>
              </section>
            )}

            {/* Cloud Fundamentals */}
            {activeSection === 'cloud' && (
              <section id="cloud" className="space-y-8">
                <h2 className="text-4xl font-black mb-6">Cloud Fundamentals</h2>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">AWS Core Services</h3>

                  <div className="space-y-4 mb-6">
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-orange-400 mb-2">EC2 (Elastic Compute Cloud)</h4>
                      <p className="text-sm text-slate-300">Virtual servers in the cloud. Scalable computing capacity on demand.</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-orange-400 mb-2">S3 (Simple Storage Service)</h4>
                      <p className="text-sm text-slate-300">Object storage for files, backups, and static content.</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-orange-400 mb-2">RDS (Relational Database Service)</h4>
                      <p className="text-sm text-slate-300">Managed databases (PostgreSQL, MySQL, etc.)</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-orange-400 mb-2">IAM (Identity & Access Management)</h4>
                      <p className="text-sm text-slate-300">Control access to AWS resources with users, roles, policies</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">GCP Core Services</h3>

                  <div className="space-y-4">
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-blue-400 mb-2">Compute Engine</h4>
                      <p className="text-sm text-slate-300">Virtual machines similar to AWS EC2</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-blue-400 mb-2">Cloud Storage</h4>
                      <p className="text-sm text-slate-300">Object storage for files and data</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-blue-400 mb-2">Cloud SQL</h4>
                      <p className="text-sm text-slate-300">Managed relational databases</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Infrastructure as Code */}
            {activeSection === 'iac' && (
              <section id="iac" className="space-y-8">
                <h2 className="text-4xl font-black mb-6">Infrastructure as Code</h2>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Terraform Basics</h3>
                  <p className="text-slate-300 mb-4">
                    Terraform allows you to define infrastructure in code, enabling version control and reproducible deployments.
                  </p>

                  <CodeBlock
                    code={`# Configure AWS provider
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
}`}
                    language="hcl"
                    id="terraform-example"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Terraform State Management</h3>

                  <CodeBlock
                    code={`# Initialize Terraform
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
}`}
                    language="bash"
                    id="terraform-commands"
                  />
                </div>
              </section>
            )}

            {/* Monitoring & Logging */}
            {activeSection === 'monitoring' && (
              <section id="monitoring" className="space-y-8">
                <h2 className="text-4xl font-black mb-6">Monitoring & Logging</h2>

                <div className="bg-white/5 border border-white/10 rounded-xl p=8">
                  <h3 className="text-2xl font-bold mb-4">Monitoring Stack</h3>

                  <div className="space-y-4">
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Prometheus</h4>
                      <p className="text-sm text-slate-300">Time-series database for metrics. Pulls metrics from targets and stores them.</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Grafana</h4>
                      <p className="text-sm text-slate-300">Data visualization and dashboards. Creates graphs from Prometheus data.</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Alertmanager</h4>
                      <p className="text-sm text-slate-300">Handles alerts from Prometheus. Routes and groups alerts.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">ELK Stack (Elasticsearch, Logstash, Kibana)</h3>

                  <p className="text-slate-300 mb-6">The ELK stack collects, processes, and visualizes logs:</p>

                  <div className="space-y-4">
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-yellow-400 mb-2">Elasticsearch</h4>
                      <p className="text-sm text-slate-300">Distributed search engine for log storage and analysis</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-yellow-400 mb-2">Logstash</h4>
                      <p className="text-sm text-slate-300">Log processor that collects, parses, and forwards logs</p>
                    </div>
                    <div className="bg-[#1E293B] p-4 rounded-lg">
                      <h4 className="font-bold text-yellow-400 mb-2">Kibana</h4>
                      <p className="text-sm text-slate-300">Visualization layer for searching and analyzing logs</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Key Metrics to Monitor</h3>

                  <CodeBlock
                    code={`# System metrics
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
Load balancer health`}
                    language="bash"
                    id="monitoring-metrics"
                  />
                </div>
              </section>
            )}

            {/* Interview Preparation */}
            {activeSection === 'interview' && (
              <section id="interview" className="space-y-8">
                <h2 className="text-4xl font-black mb-6">Interview Preparation</h2>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Common Interview Questions</h3>

                  <div className="space-y-6">
                    <div className="bg-[#1E293B] p-6 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">What is the difference between traditional IT operations and DevOps?</h4>
                      <p className="text-sm text-slate-300">
                        Traditional IT operations have separate Dev and Ops teams, slow release cycles, and manual processes. DevOps combines teams, automates everything, uses CI/CD, and focuses on rapid, reliable deployments.
                      </p>
                    </div>

                    <div className="bg-[#1E293B] p-6 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Explain the benefits of containerization</h4>
                      <p className="text-sm text-slate-300">
                        Containers provide consistency across environments, lightweight isolation, fast startup, efficient resource usage, and easy scaling. No more "works on my machine" problems.
                      </p>
                    </div>

                    <div className="bg-[#1E293B] p-6 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">What are the advantages of Infrastructure as Code?</h4>
                      <p className="text-sm text-slate-300">
                        Version control, reproducibility, disaster recovery, easier testing, reduced manual errors, self-documentation, and ability to provision/tear down infrastructure quickly.
                      </p>
                    </div>

                    <div className="bg-[#1E293B] p-6 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">How would you handle a production outage?</h4>
                      <p className="text-sm text-slate-300">
                        1) Declare incident and form war room. 2) Assess impact. 3) Implement immediate fix if available, rollback if needed. 4) Root cause analysis. 5) Implement permanent fix. 6) Post-mortem and process improvements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4">Scenario-Based Questions</h3>

                  <div className="space-y-6">
                    <div className="bg-[#1E293B] p-6 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">Design a CI/CD pipeline for a microservices application</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        Consider: Git triggers → automated tests → build Docker images → push to registry → deploy to staging → run integration tests → deploy to production with blue-green or canary strategy.
                      </p>
                    </div>

                    <div className="bg-[#1E293B] p-6 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">How would you ensure high availability for a critical application?</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        Use load balancers, multiple replicas, health checks, auto-scaling, redundant databases with replication, multi-region deployment, automated failover, and proper monitoring/alerting.
                      </p>
                    </div>

                    <div className="bg-[#1E293B] p-6 rounded-lg">
                      <h4 className="font-bold text-cyan-400 mb-2">How would you handle secrets in your infrastructure?</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        Use secret management tools (Vault, AWS Secrets Manager), never commit secrets to Git, rotate regularly, use least privilege access, audit access logs, and integrate with CI/CD safely.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready for Your Interview?</h3>
                  <p className="text-white mb-6">Take our DevOps assessment or practice with mock interviews</p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <a
                      href="/start-assessment"
                      className="px-6 py-3 bg-white text-cyan-600 font-bold rounded-lg hover:bg-slate-100 transition-all"
                    >
                      Start Assessment
                    </a>
                    <a
                      href="/mock-interviews"
                      className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all"
                    >
                      Mock Interviews
                    </a>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Additional Resources */}
        <section className="bg-white/5 border border-white/10 rounded-xl p-8 mb-20">
          <h2 className="text-3xl font-bold mb-6">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1E293B] p-6 rounded-lg">
              <h3 className="font-bold text-cyan-400 mb-3">Recommended Tools</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>Docker & Docker Compose</li>
                <li>Kubernetes (k3s for learning)</li>
                <li>Jenkins or GitHub Actions</li>
                <li>Terraform</li>
                <li>Prometheus & Grafana</li>
              </ul>
            </div>

            <div className="bg-[#1E293B] p-6 rounded-lg">
              <h3 className="font-bold text-cyan-400 mb-3">Learning Path</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>1. Linux & Bash scripting</li>
                <li>2. Git & version control</li>
                <li>3. Docker containers</li>
                <li>4. CI/CD pipelines</li>
                <li>5. Kubernetes & orchestration</li>
              </ul>
            </div>

            <div className="bg-[#1E293B] p-6 rounded-lg">
              <h3 className="font-bold text-cyan-400 mb-3">Next Steps</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>
                  <a href="/resume-analyzer" className="text-cyan-400 hover:text-cyan-300">
                    Optimize your resume
                  </a>
                </li>
                <li>
                  <a href="/start-assessment" className="text-cyan-400 hover:text-cyan-300">
                    Take DevOps assessment
                  </a>
                </li>
                <li>
                  <a href="/mock-interviews" className="text-cyan-400 hover:text-cyan-300">
                    Practice with mock interviews
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-black mb-4">Ready to Become a DevOps Engineer?</h2>
          <p className="text-lg mb-8 text-white/90">
            Master DevOps with hands-on projects, assessments, and 1:1 mentorship from industry experts.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/start-assessment"
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-slate-100 transition-all"
            >
              Start Assessment
            </a>
            <a
              href="/learning-paths"
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              View All Paths
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DevOpsRoadmap;
