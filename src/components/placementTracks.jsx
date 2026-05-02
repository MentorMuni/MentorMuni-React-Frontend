import React, { useState } from 'react';
import { Clock, ChevronDown, ArrowRight, BookOpen, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlacementTracks = () => {
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);

  const placementTracks = [
    {
      id: 'python-dev',
      title: 'Python Developer',
      icon: '🐍',
      description: 'Master Python for backend development and automation',
      duration: '12 weeks',
      modules: [
        { title: 'Python Fundamentals & OOP', topics: ['Variables, Data Types & Operators', 'Control Flow & Loops', 'Functions & Modules', 'Classes, Objects & Inheritance', 'Exception Handling'] },
        { title: 'Web Frameworks (Django & Flask)', topics: ['Flask Basics & Routing', 'Django MVT Architecture', 'Templates & Forms', 'Authentication & Sessions', 'Admin Panel & ORM'] },
        { title: 'REST APIs & Microservices', topics: ['RESTful Design Principles', 'Building APIs with Flask/Django', 'JSON & Serialization', 'API Authentication (JWT)', 'Microservices Architecture'] },
        { title: 'Database Design (SQL & NoSQL)', topics: ['SQL Queries & Joins', 'PostgreSQL & MySQL', 'MongoDB Basics', 'ORM (SQLAlchemy, Django ORM)', 'Database Optimization'] },
        { title: 'Cloud Deployment (AWS/Docker)', topics: ['Docker Containers', 'AWS EC2 & S3', 'CI/CD Pipelines', 'Environment Variables', 'Production Best Practices'] },
        { title: 'Real-world Projects', topics: ['E-commerce Backend', 'REST API Project', 'Data Pipeline Project', 'Portfolio Building'] },
        { title: 'Interview Preparation', topics: ['DSA in Python', 'System Design Basics', 'Mock Interviews', 'Resume Review'] }
      ]
    },
    {
      id: 'full-stack',
      title: 'Full Stack Developer',
      icon: '🌐',
      description: 'Build complete web applications from frontend to backend',
      duration: '16 weeks',
      modules: [
        { title: 'React.js & Frontend Fundamentals', topics: ['HTML, CSS & JavaScript', 'React Components & JSX', 'Hooks (useState, useEffect)', 'React Router', 'Tailwind CSS'] },
        { title: 'State Management (Redux)', topics: ['Redux Basics', 'Actions & Reducers', 'Redux Toolkit', 'Async with Redux Thunk', 'Context API Alternative'] },
        { title: 'Node.js & Express.js', topics: ['Node.js Fundamentals', 'Express Routing', 'Middleware', 'Error Handling', 'File Uploads'] },
        { title: 'Databases (MongoDB & PostgreSQL)', topics: ['MongoDB CRUD', 'Mongoose ODM', 'PostgreSQL Basics', 'Sequelize ORM', 'Database Design'] },
        { title: 'Authentication & Authorization', topics: ['JWT Tokens', 'OAuth 2.0', 'Passport.js', 'Role-based Access', 'Session Management'] },
        { title: 'Testing & Deployment', topics: ['Jest & React Testing', 'API Testing', 'CI/CD Basics', 'Vercel/Netlify Deploy', 'Docker Basics'] },
        { title: 'MERN/MEAN Projects', topics: ['E-commerce App', 'Social Media Clone', 'Real-time Chat App', 'Portfolio Projects'] },
        { title: 'System Design Basics', topics: ['Scalability Concepts', 'Load Balancing', 'Caching Strategies', 'Database Sharding'] }
      ]
    },
    {
      id: 'data-engineer',
      title: 'Data Engineer',
      icon: '🔧',
      description: 'Build scalable data pipelines and infrastructure',
      duration: '14 weeks',
      modules: [
        { title: 'SQL & Advanced Queries', topics: ['Complex Joins', 'Window Functions', 'CTEs & Subqueries', 'Query Optimization', 'Indexing Strategies'] },
        { title: 'Python for Data Engineering', topics: ['Pandas & NumPy', 'Data Wrangling', 'File Handling (CSV, JSON, Parquet)', 'Scripting & Automation'] },
        { title: 'ETL Pipelines', topics: ['Extract, Transform, Load', 'Apache Airflow', 'Data Quality Checks', 'Scheduling & Monitoring'] },
        { title: 'Big Data Technologies (Spark)', topics: ['PySpark Basics', 'RDDs & DataFrames', 'Spark SQL', 'Performance Tuning'] },
        { title: 'Data Warehousing', topics: ['Star & Snowflake Schema', 'Dimensional Modeling', 'Data Lake Concepts', 'Slowly Changing Dimensions'] },
        { title: 'Cloud Platforms (AWS Redshift)', topics: ['AWS S3 & Glue', 'Redshift Basics', 'Data Loading', 'Cost Optimization'] },
        { title: 'Real-time Data Streaming', topics: ['Apache Kafka', 'Event-driven Architecture', 'Stream Processing', 'Real-time Dashboards'] },
        { title: 'Performance Optimization', topics: ['Query Profiling', 'Partitioning', 'Compression', 'Best Practices'] }
      ]
    },
    {
      id: 'qa-engineer',
      title: 'QA Engineer',
      icon: '🧪',
      description: 'Master quality assurance and automated testing',
      duration: '10 weeks',
      modules: [
        { title: 'QA Fundamentals & Types of Testing', topics: ['SDLC & STLC', 'Manual vs Automated', 'Black Box & White Box', 'Regression Testing'] },
        { title: 'Manual Testing Techniques', topics: ['Test Case Design', 'Boundary Value Analysis', 'Equivalence Partitioning', 'Exploratory Testing'] },
        { title: 'Selenium Automation', topics: ['Selenium WebDriver', 'Locators & Waits', 'Page Object Model', 'Cross-browser Testing'] },
        { title: 'Test Automation Frameworks', topics: ['TestNG & JUnit', 'Cucumber BDD', 'Data-driven Testing', 'Framework Design'] },
        { title: 'Performance & Load Testing', topics: ['JMeter Basics', 'Load vs Stress Testing', 'Performance Metrics', 'Bottleneck Analysis'] },
        { title: 'CI/CD Pipeline Integration', topics: ['Jenkins Integration', 'GitHub Actions', 'Automated Test Runs', 'Reporting'] },
        { title: 'Bug Tracking & Reporting', topics: ['JIRA Workflows', 'Bug Life Cycle', 'Test Documentation', 'Metrics & KPIs'] },
        { title: 'Real Projects & Case Studies', topics: ['E-commerce Testing', 'API Testing Projects', 'Mobile App Testing', 'Portfolio Building'] }
      ]
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist & AI Engineer',
      icon: '🤖',
      description: 'Build AI models and solve complex data problems',
      duration: '16 weeks',
      modules: [
        { title: 'Python for Data Science', topics: ['NumPy & Pandas', 'Data Cleaning', 'Feature Engineering', 'Jupyter Notebooks'] },
        { title: 'Statistics & Probability', topics: ['Descriptive Statistics', 'Probability Distributions', 'Hypothesis Testing', 'A/B Testing'] },
        { title: 'Data Visualization', topics: ['Matplotlib & Seaborn', 'Plotly Interactive Charts', 'Dashboard Design', 'Storytelling with Data'] },
        { title: 'Machine Learning Fundamentals', topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Scikit-learn'] },
        { title: 'Deep Learning & Neural Networks', topics: ['Neural Network Basics', 'TensorFlow & Keras', 'CNNs for Images', 'Training & Tuning'] },
        { title: 'Natural Language Processing', topics: ['Text Preprocessing', 'Word Embeddings', 'Sentiment Analysis', 'Transformers & BERT'] },
        { title: 'Deployment of ML Models', topics: ['Flask/FastAPI Serving', 'Docker for ML', 'Cloud Deployment', 'MLOps Basics'] },
        { title: 'Real-world Datasets & Projects', topics: ['Kaggle Competitions', 'End-to-end Projects', 'Portfolio Building', 'Interview Prep'] }
      ]
    },
    {
      id: 'devops',
      title: 'DevOps Engineer',
      icon: '⚙️',
      description: 'Master infrastructure automation and deployment',
      duration: '14 weeks',
      modules: [
        { title: 'Linux System Administration', topics: ['Linux Commands', 'File Permissions', 'Process Management', 'Networking Basics'] },
        { title: 'Scripting (Bash & Python)', topics: ['Bash Scripting', 'Python Automation', 'Cron Jobs', 'Error Handling'] },
        { title: 'Docker & Containerization', topics: ['Docker Images & Containers', 'Dockerfile', 'Docker Compose', 'Container Networking'] },
        { title: 'Kubernetes Orchestration', topics: ['K8s Architecture', 'Pods & Deployments', 'Services & Ingress', 'Helm Charts'] },
        { title: 'CI/CD with Jenkins & GitLab', topics: ['Jenkins Pipelines', 'GitLab CI/CD', 'GitHub Actions', 'Automated Testing'] },
        { title: 'Infrastructure as Code (Terraform)', topics: ['Terraform Basics', 'AWS with Terraform', 'State Management', 'Modules & Best Practices'] },
        { title: 'Monitoring & Logging', topics: ['Prometheus & Grafana', 'ELK Stack', 'Alerting', 'Log Analysis'] },
        { title: 'Cloud Platforms (AWS/Azure)', topics: ['AWS Core Services', 'Azure Basics', 'Cloud Security', 'Cost Management'] }
      ]
    }
  ];

  return (
    <div className="min-h-screen mm-site-theme overflow-x-hidden text-foreground">
      {!showCurriculum ? (
        <>
          <section className="mm-marketing-hero-backdrop border-b border-border">
            <div className="relative z-10 mx-auto max-w-6xl px-6 pb-14 pt-20 text-center md:pb-16">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-warning-bg/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-warning-text">
                <Target size={14} className="text-cta" aria-hidden />
                Career Tracks
              </div>
              <h1 className="mb-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">
                Placement <span className="mm-gradient-text-cta">Tracks</span>
              </h1>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
                Choose your career path and master the skills that companies actually test in interviews
              </p>
            </div>
          </section>

          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
            {/* 6 Tiles Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {placementTracks.map((track) => (
                <div 
                  key={track.id} 
                  className="group cursor-pointer rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:border-cta/35 hover:shadow-md"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{track.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{track.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{track.description}</p>
                  <div className="mb-5 flex items-center gap-2 text-sm font-medium text-cta">
                    <Clock size={14} />
                    {track.duration}
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTrack(track);
                      setShowCurriculum(true);
                      window.scrollTo(0, 0);
                    }}
                    className="w-full rounded-xl bg-cta py-3 font-bold text-white shadow-button transition-all hover:bg-cta-hover group-hover:shadow-lg"
                  >
                    Explore Curriculum
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-14 text-center">
              <p className="mb-4 text-sm text-muted-foreground">Not sure which track is right for you?</p>
              <Link
                to="/start-assessment"
                className="inline-flex items-center gap-2 rounded-xl border border-cta px-6 py-3 text-sm font-bold text-cta transition hover:bg-accent-soft"
              >
                Take the free readiness check first <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            {/* Curriculum View */}
            <button 
              onClick={() => {
                setShowCurriculum(false);
                setSelectedTrack(null);
              }}
              className="mb-8 flex items-center gap-2 font-bold text-cta transition-colors hover:text-cta-hover"
            >
              ← Back to Tracks
            </button>

            {/* Track Header */}
            <div className="mb-10 rounded-2xl border border-border bg-gradient-to-r from-accent-soft/60 to-secondary p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="text-6xl">{selectedTrack?.icon}</div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">{selectedTrack?.title}</h2>
                  <p className="text-muted-foreground mb-3">{selectedTrack?.description}</p>
                  <div className="flex items-center gap-2 font-semibold text-cta">
                    <Clock size={18} />
                    Duration: {selectedTrack?.duration}
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum Modules */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen size={20} className="text-cta" aria-hidden />
                <h3 className="text-2xl font-bold text-foreground">Curriculum Modules</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Click on any module to see detailed topics</p>
              <div className="space-y-3">
                {selectedTrack?.modules.map((module, index) => (
                  <div 
                    key={index} 
                    className={`cursor-pointer rounded-xl border bg-card transition-all ${
                      expandedModule === index 
                        ? 'border-cta shadow-md shadow-cta-card' 
                        : 'border-border hover:border-cta/40'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                      className="w-full p-5 flex items-center justify-between gap-4 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cta text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        <div className="text-base font-semibold text-foreground">{module.title}</div>
                      </div>
                      <ChevronDown 
                        size={20} 
                        className={`shrink-0 text-cta transition-transform ${
                          expandedModule === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {expandedModule === index && (
                      <div className="px-5 pb-5 pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-3 font-medium">Topics covered:</p>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {module.topics.map((topic, topicIndex) => (
                            <li 
                              key={topicIndex}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cta" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="rounded-2xl border border-border bg-gradient-to-r from-accent-soft/60 to-secondary p-8 text-center md:p-10">
              <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Start Your Journey?</h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Get access to the complete {selectedTrack?.title} curriculum with 1:1 mentorship and interview prep
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-8 py-4 font-bold text-white shadow-button transition-colors hover:bg-cta-hover"
              >
                Contact us to enroll
                <ArrowRight size={18} />
              </Link>
            </div>
        </div>
      )}
    </div>
  );
};

export default PlacementTracks;
