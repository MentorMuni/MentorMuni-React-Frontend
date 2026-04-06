import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Menu, X, Check, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const SqlTutorial = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  const topics = [
    { id: 'intro', title: 'Introduction to Databases' },
    { id: 'what-is-sql', title: 'What is SQL?' },
    { id: 'database-types', title: 'Types of Databases' },
    { id: 'database-concepts', title: 'Database Concepts' },
    { id: 'create-database', title: 'Creating a Database' },
    { id: 'create-tables', title: 'Creating Tables' },
    { id: 'insert-data', title: 'Inserting Data' },
    { id: 'select-data', title: 'Selecting Data' },
    { id: 'update-delete', title: 'Updating & Deleting Data' },
    { id: 'aggregate', title: 'Aggregate Functions' },
    { id: 'joins', title: 'Joins Basics' },
    { id: 'indexes', title: 'Indexes' },
    { id: 'constraints', title: 'Constraints' },
    { id: 'mistakes', title: 'Common Mistakes' },
    { id: 'mini-project', title: 'Mini Project' },
    { id: 'recap', title: 'Quick Recap' },
    { id: 'practice', title: 'Practice Questions' },
    { id: 'nextsteps', title: 'Next Steps' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      for (let topic of topics) {
        const element = document.getElementById(topic.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(topic.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [topics]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const CodeBlock = ({ code, id }) => {
    const copyToClipboard = () => {
      navigator.clipboard.writeText(code);
      alert('Code copied to clipboard!');
    };

    return (
      <div className="bg-[#1e1e1e] rounded-lg border border-border my-4">
        <div className="flex justify-between items-center px-4 py-2 border-b border-border">
          <span className="text-xs text-muted-foreground">SQL</span>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1 bg-[#FF9500] hover:bg-[#FF9500]/80 rounded text-white text-xs transition-all"
          >
            <Copy size={14} /> Copy
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm text-[#e0e0e0]">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-foreground font-sans antialiased">
      {/* Meta Tags for SEO */}
      <head>
        <title>SQL for Beginners - Learn SQL Step by Step | Complete SQL Basics Tutorial</title>
        <meta name="description" content="Master SQL from scratch with our complete beginner-friendly tutorial. Learn SQL step by step with practical examples. Perfect for someone with zero database knowledge." />
        <meta name="keywords" content="SQL for beginners, learn SQL step by step, SQL basics tutorial, what is SQL database, SQL for beginners tutorial, database SQL" />
      </head>

      {/* HEADER */}
      <header className="sticky top-0 z-[100] bg-[#FFFDF8]/95 backdrop-blur-md border-b border-border px-5">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between py-4">
          <Link to="/" className="transition-transform hover:scale-[1.02]">
            <img src={logo} alt="MentorMuni" className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/free-tutorials" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              ← Back to Free Tutorials
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="md:hidden rounded-lg p-2 text-foreground hover:bg-[#FFF4E0] transition-colors"
            aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
          >
            {isNavOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex gap-8 max-w-[1400px] mx-auto px-6 py-16">
        
        {/* LEFT SIDEBAR NAVIGATION - DESKTOP ONLY */}
        <aside className="hidden lg:block w-64 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto">
          <div className="bg-white border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-6 text-[#FF9500]">📑 Topics</h3>
            <nav className="space-y-2">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => scrollToSection(topic.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-semibold ${
                    activeSection === topic.id
                      ? 'bg-[#FF9500] text-white'
                      : 'text-muted-foreground hover:text-foreground hover:bg-[#FFF4E0]'
                  }`}
                >
                  {topic.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0">

        {/* HERO SECTION */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
            SQL for Beginners
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-4">
            Learn SQL step by step with this complete beginner-friendly tutorial. Perfect for someone with zero database knowledge who wants to master SQL basics and start working with data.
          </p>
          <div className="flex gap-4 flex-wrap">
            <div className="px-4 py-2 bg-[#FF9500]/20 border border-[#4F46E5]/50 rounded-lg text-sm">⏱️ 60-90 minutes read</div>
            <div className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-lg text-sm flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Beginner Friendly</div>
            <div className="px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-lg text-sm">💾 With Practical Examples</div>
          </div>
        </div>

        <div className="mb-16 bg-white border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
          <ol className="space-y-2 text-muted-foreground">
            <li>1. What is SQL and why it matters</li>
            <li>2. Creating databases and tables</li>
            <li>3. Inserting, selecting, and filtering data</li>
            <li>4. Updating and deleting records safely</li>
            <li>5. Aggregate functions and data analysis</li>
            <li>6. Joining tables together</li>
            <li>7. Indexes and performance optimization</li>
            <li>8. Real-world mini project</li>
            <li>9. Common mistakes and how to avoid them</li>
          </ol>
        </div>

        {/* SECTION 1: INTRODUCTION */}
        <section id="intro" className="mb-16">
          <h2 className="text-4xl font-black mb-6">📚 Introduction to Databases</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What is a Database?</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              A database is like a digital filing cabinet. Instead of storing papers in folders, you store data (information) in an organized way so you can find it quickly.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              <strong>Real-World Example:</strong> When you shop on Amazon, all customer information (names, addresses, orders) is stored in a database. When you log in, the database instantly retrieves your data.
            </p>

            <h4 className="text-xl font-bold mb-4 mt-6">Common Examples You Use Every Day:</h4>
            <ul className="text-muted-foreground space-y-3 ml-4">
              <li><strong className="text-cyan-400">• Banking:</strong> Your account balance, transaction history, loan details</li>
              <li><strong className="text-cyan-400">• Social Media:</strong> Facebook stores posts, messages, photos, followers</li>
              <li><strong className="text-cyan-400">• E-commerce:</strong> Amazon stores products, prices, inventory, customer orders</li>
              <li><strong className="text-cyan-400">• Colleges:</strong> Store student names, grades, enrollment records</li>
              <li><strong className="text-cyan-400">• Hospitals:</strong> Patient records, medical history, appointments</li>
            </ul>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What is DBMS?</h3>
            <p className="text-muted-foreground mb-4">
              <strong>DBMS = Database Management System</strong>
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              It's software that helps you create, organize, and manage your data. Think of it as the librarian of your digital filing cabinet—it helps you store, find, and organize information.
            </p>

            <div className="bg-[#1E293B] p-4 rounded-lg border border-border mt-4">
              <p className="text-muted-foreground text-sm"><strong>Popular DBMS Examples:</strong></p>
              <ul className="text-muted-foreground text-sm mt-2 space-y-1 ml-4">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> MySQL - Free, widely used</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> PostgreSQL - Powerful, free, open-source</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> SQL Server - Made by Microsoft</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Oracle - Enterprise-level</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> MongoDB - For non-relational data</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Why Learn SQL?</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-cyan-400 mb-2">1. High Demand Skill</h4>
                <p className="text-muted-foreground">Nearly every company needs people who can handle data. Good salary and career opportunities.</p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 mb-2">2. Universal Language</h4>
                <p className="text-muted-foreground">Works with all major databases. Learn once, use everywhere.</p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 mb-2">3. Foundation for Other Skills</h4>
                <p className="text-muted-foreground">Essential for Data Analysis, Business Intelligence, Web Development, and Data Science.</p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 mb-2">4. Relatively Easy to Learn</h4>
                <p className="text-muted-foreground">SQL reads almost like English. Much easier than programming languages like Python or Java.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHAT IS SQL */}
        <section id="what-is-sql" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🗄️ What is SQL?</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">SQL Definition</h3>
            <p className="text-muted-foreground mb-4">
              <strong>SQL = Structured Query Language</strong>
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              SQL is a language used to talk to databases. It lets you ask questions (queries) like "Show me all students with grades above 80" or "How many orders did we get this month?"
            </p>

            <h4 className="text-xl font-bold mb-4">Simple Analogy</h4>
            <p className="text-muted-foreground mb-4">
              If a database is like a library, SQL is the language you use to ask the librarian:
            </p>
            <ul className="text-muted-foreground space-y-2 ml-4">
              <li>• "Find me all books by Stephen King" (SELECT based on author)</li>
              <li>• "Add this new book to the catalog" (INSERT)</li>
              <li>• "Update the location of this book" (UPDATE)</li>
              <li>• "Remove this damaged book" (DELETE)</li>
            </ul>
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Basic SQL Commands</h3>
            <p className="text-muted-foreground mb-6">Here's what you'll learn in this tutorial:</p>

            <div className="space-y-4">
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-[#FF9500]">SELECT</strong> - Retrieve data from database
                <CodeBlock code={`SELECT name, email FROM students;`} id="select-intro" />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-[#FF9500]">INSERT</strong> - Add new data
                <CodeBlock code={`INSERT INTO students (name, email) VALUES ('John', 'john@email.com');`} id="insert-intro" />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-[#FF9500]">UPDATE</strong> - Modify existing data
                <CodeBlock code={`UPDATE students SET email = 'newemail@gmail.com' WHERE name = 'John';`} id="update-intro" />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-[#FF9500]">DELETE</strong> - Remove data
                <CodeBlock code={`DELETE FROM students WHERE name = 'John';`} id="delete-intro" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: DATABASE TYPES */}
        <section id="database-types" className="mb-16">
          <h2 className="text-4xl font-black mb-6">📊 Types of Databases</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Relational Databases</h3>
            <p className="text-muted-foreground mb-4">
              <strong>Most common type.</strong> Data is organized in tables (like Excel spreadsheets) connected by relationships.
            </p>

            <div className="bg-[#1E293B] p-4 rounded-lg border border-cyan-400/30 mb-4">
              <p className="text-muted-foreground text-sm"><strong>Examples:</strong> MySQL, PostgreSQL, SQL Server, Oracle, MariaDB</p>
            </div>

            <h4 className="text-lg font-bold mb-3">Example: Simple Student Table</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-muted-foreground">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 bg-[#1e1e1e]">StudentID</th>
                    <th className="text-left p-2 bg-[#1e1e1e]">Name</th>
                    <th className="text-left p-2 bg-[#1e1e1e]">Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-2">1</td>
                    <td className="p-2">Alice</td>
                    <td className="p-2">alice@email.com</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2">2</td>
                    <td className="p-2">Bob</td>
                    <td className="p-2">bob@email.com</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Non-Relational Databases</h3>
            <p className="text-muted-foreground mb-4">
              <strong>Newer approach.</strong> Data doesn't need to be in tables. Good for complex, unstructured data like images, videos, or documents.
            </p>

            <div className="bg-[#1E293B] p-4 rounded-lg border border-cyan-400/30">
              <p className="text-muted-foreground text-sm"><strong>Examples:</strong> MongoDB, CouchDB, Redis, Firebase</p>
            </div>

            <p className="text-muted-foreground mt-4"><strong>For beginners:</strong> Focus on relational databases first. They're more common and easier to understand.</p>
          </div>
        </section>

        {/* SECTION 4: DATABASE CONCEPTS */}
        <section id="database-concepts" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🔑 Database Concepts</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What is a Table?</h3>
            <p className="text-muted-foreground mb-4">
              Think of it like an Excel spreadsheet. It has rows and columns to organize data.
            </p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm text-muted-foreground">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 bg-[#1e1e1e]">ID (Column)</th>
                    <th className="text-left p-3 bg-[#1e1e1e]">Name</th>
                    <th className="text-left p-3 bg-[#1e1e1e]">Age</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3">1</td>
                    <td className="p-3">Alice (Row)</td>
                    <td className="p-3">20</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">2</td>
                    <td className="p-3">Bob (Row)</td>
                    <td className="p-3">22</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Primary Key</h3>
            <p className="text-muted-foreground mb-4">
              A unique identifier for each row. No two rows can have the same primary key. Like a student ID—each student has a unique ID.
            </p>

            <CodeBlock 
              code={`CREATE TABLE students (
    StudentID INT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100)
);`} 
              id="primary-key-example" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Foreign Key</h3>
            <p className="text-muted-foreground mb-4">
              Creates a link between two tables. Example: A student belongs to a class. StudentID in Enrollments table links to Students table.
            </p>

            <CodeBlock 
              code={`CREATE TABLE enrollments (
    EnrollmentID INT PRIMARY KEY,
    StudentID INT,
    CourseID INT,
    FOREIGN KEY (StudentID) REFERENCES students(StudentID)
);`} 
              id="foreign-key-example" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Constraints</h3>
            <p className="text-muted-foreground mb-4">Rules to ensure data quality:</p>

            <div className="space-y-4">
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-cyan-400">NOT NULL</strong> - Value must be provided
                <p className="text-muted-foreground text-sm mt-2">Every student must have a name</p>
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-cyan-400">UNIQUE</strong> - No duplicate values
                <p className="text-muted-foreground text-sm mt-2">Each email must be unique, no two students same email</p>
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-cyan-400">DEFAULT</strong> - Automatically set if not provided
                <p className="text-muted-foreground text-sm mt-2">If no creation date given, use today's date</p>
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-cyan-400">CHECK</strong> - Value must meet a condition
                <p className="text-muted-foreground text-sm mt-2">Age must be between 5 and 100</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: CREATE DATABASE */}
        <section id="create-database" className="mb-16">
          <h2 className="text-4xl font-black mb-6">⚙️ Creating a Database</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">CREATE DATABASE</h3>
            <p className="text-muted-foreground mb-4">
              Before creating tables, you need to create a database. Think of it as creating a new filing cabinet.
            </p>

            <CodeBlock 
              code={`CREATE DATABASE school_db;`} 
              id="create-db" 
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-cyan-400/30">
              📌 <strong>Naming tip:</strong> Use descriptive names with underscores. Good: <code className="bg-[#FFFDF8] px-2 py-1">school_db</code>, Bad: <code className="bg-[#FFFDF8] px-2 py-1">db1</code>
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">USE Database</h3>
            <p className="text-muted-foreground mb-4">
              Before working with a database, tell SQL which one to use. Like opening a specific filing cabinet.
            </p>

            <CodeBlock 
              code={`USE school_db;`} 
              id="use-db" 
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-yellow-400/30">
              ⚠️ <strong>Important:</strong> Always run <code className="bg-[#FFFDF8] px-2 py-1">USE database_name;</code> before creating tables!
            </p>
          </div>
        </section>

        {/* SECTION 6: CREATE TABLES */}
        <section id="create-tables" className="mb-16">
          <h2 className="text-4xl font-black mb-6">📋 Creating Tables</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">CREATE TABLE Basics</h3>
            <p className="text-muted-foreground mb-4">
              A table is where you store your actual data. Define columns and their data types.
            </p>

            <CodeBlock 
              code={`CREATE TABLE students (
    StudentID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Age INT,
    GPA FLOAT,
    CreatedDate DATE DEFAULT CURRENT_DATE
);`} 
              id="create-table-example" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Common Data Types</h3>

            <div className="space-y-4">
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-[#FF9500]">INT</strong> - Whole numbers
                <CodeBlock code={`Age INT,
Quantity INT`} id="int-type" />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-[#FF9500]">VARCHAR(size)</strong> - Text of variable length
                <CodeBlock code={`Name VARCHAR(100),
Email VARCHAR(100)`} id="varchar-type" />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-[#FF9500]">DATE</strong> - Date values
                <CodeBlock code={`BirthDate DATE,
JoinDate DATE`} id="date-type" />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-[#FF9500]">FLOAT / DECIMAL</strong> - Decimal numbers
                <CodeBlock code={`GPA FLOAT,
Price DECIMAL(10, 2)`} id="float-type" />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-[#FF9500]">BOOLEAN</strong> - True or False
                <CodeBlock code={`IsActive BOOLEAN,
IsGraduated BOOLEAN`} id="boolean-type" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Complete Example</h3>

            <CodeBlock 
              code={`USE school_db;

CREATE TABLE students (
    StudentID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Age INT CHECK (Age >= 5 AND Age <= 100),
    GPA FLOAT DEFAULT 0.0,
    JoinDate DATE DEFAULT CURRENT_DATE,
    IsActive BOOLEAN DEFAULT TRUE
);`} 
              id="complete-table-example" 
            />

            <p className="text-muted-foreground mt-6 p-4 bg-[#1E293B] rounded-lg border border-border">
              <strong>Explanation:</strong><br/>
              • <code className="bg-[#FFFDF8] px-1">AUTO_INCREMENT</code> - ID increases automatically<br/>
              • <code className="bg-[#FFFDF8] px-1">NOT NULL</code> - Must have a value<br/>
              • <code className="bg-[#FFFDF8] px-1">UNIQUE</code> - No duplicate emails<br/>
              • <code className="bg-[#FFFDF8] px-1">CHECK</code> - Age must be realistic<br/>
              • <code className="bg-[#FFFDF8] px-1">DEFAULT</code> - Automatic values
            </p>
          </div>
        </section>

        {/* SECTION 7: INSERT DATA */}
        <section id="insert-data" className="mb-16">
          <h2 className="text-4xl font-black mb-6">➕ Inserting Data</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">INSERT Single Row</h3>
            <p className="text-muted-foreground mb-4">
              Add one student record to the table:
            </p>

            <CodeBlock 
              code={`INSERT INTO students (Name, Email, Age, GPA) 
VALUES ('Alice Johnson', 'alice@email.com', 20, 3.8);`} 
              id="insert-single" 
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-border">
              Note: We don't specify StudentID because it's AUTO_INCREMENT. Also, JoinDate and IsActive use defaults.
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">INSERT Multiple Rows</h3>
            <p className="text-muted-foreground mb-4">
              Add multiple students at once:
            </p>

            <CodeBlock 
              code={`INSERT INTO students (Name, Email, Age, GPA) 
VALUES 
('Bob Smith', 'bob@email.com', 21, 3.6),
('Charlie Brown', 'charlie@email.com', 19, 3.9),
('Diana Prince', 'diana@email.com', 22, 3.7);`} 
              id="insert-multiple" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Quick Practice</h3>
            <p className="text-muted-foreground mb-4"><strong>Add two students: Emma (22, emma@gmail.com, 3.85) and Frank (20, frank@gmail.com, 3.45)</strong></p>
            
            <details className="cursor-pointer">
              <summary className="text-[#FF9500] font-bold mb-4 hover:text-[#CC7000]">Click to see solution</summary>
              <CodeBlock 
                code={`INSERT INTO students (Name, Email, Age, GPA)
VALUES 
('Emma White', 'emma@gmail.com', 22, 3.85),
('Frank Green', 'frank@gmail.com', 20, 3.45);`} 
                id="practice-insert" 
              />
            </details>
          </div>
        </section>

        {/* SECTION 8: SELECT DATA */}
        <section id="select-data" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🔍 Selecting Data</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">SELECT All Data</h3>
            <p className="text-muted-foreground mb-4">
              Get all columns and rows from a table:
            </p>

            <CodeBlock 
              code={`SELECT * FROM students;`} 
              id="select-all" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">SELECT Specific Columns</h3>
            <p className="text-muted-foreground mb-4">
              Get only the columns you need. Faster and cleaner:
            </p>

            <CodeBlock 
              code={`SELECT Name, Email, Age FROM students;`} 
              id="select-columns" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">WHERE Clause - Filter Data</h3>
            <p className="text-muted-foreground mb-4">
              Show only students with GPA above 3.7:
            </p>

            <CodeBlock 
              code={`SELECT Name, GPA FROM students WHERE GPA > 3.7;`} 
              id="select-where" 
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-border">
              <strong>More WHERE examples:</strong><br/>
              • <code className="bg-[#FFFDF8] px-1">WHERE Age = 20</code> - Exact match<br/>
              • <code className="bg-[#FFFDF8] px-1">WHERE Age &gt;= 20</code> - Greater than or equal<br/>
              • <code className="bg-[#FFFDF8] px-1">WHERE Name = 'Alice'</code> - Text comparison
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">AND & OR Operators</h3>
            <p className="text-muted-foreground mb-4">
              Combine multiple conditions:
            </p>

            <CodeBlock 
              code={`-- AND: Both conditions must be true
SELECT Name, Age, GPA FROM students 
WHERE Age > 20 AND GPA > 3.5;

-- OR: At least one condition must be true
SELECT Name FROM students 
WHERE Name = 'Alice' OR Name = 'Bob';`} 
              id="select-and-or" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">ORDER BY - Sort Results</h3>
            <p className="text-muted-foreground mb-4">
              Sort students by GPA (highest first):
            </p>

            <CodeBlock 
              code={`SELECT Name, GPA FROM students 
ORDER BY GPA DESC;  -- DESC = Descending (highest first)

-- ASC = Ascending (lowest first)
SELECT Name, GPA FROM students 
ORDER BY GPA ASC;`} 
              id="select-order-by" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">LIMIT - Get First N Rows</h3>
            <p className="text-muted-foreground mb-4">
              Show only the top 3 students by GPA:
            </p>

            <CodeBlock 
              code={`SELECT Name, GPA FROM students 
ORDER BY GPA DESC 
LIMIT 3;`} 
              id="select-limit" 
            />
          </div>
        </section>

        {/* SECTION 9: UPDATE & DELETE */}
        <section id="update-delete" className="mb-16">
          <h2 className="text-4xl font-black mb-6">✏️ Updating & Deleting Data</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">UPDATE - Modify Data</h3>
            <p className="text-muted-foreground mb-4">
              Update Alice's GPA to 4.0:
            </p>

            <CodeBlock 
              code={`UPDATE students 
SET GPA = 4.0 
WHERE Name = 'Alice';`} 
              id="update-example" 
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-yellow-400/30">
              ⚠️ <strong>CRITICAL:</strong> Always use WHERE to specify which rows to update! Without WHERE, you update ALL rows!
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">UPDATE Multiple Columns</h3>
            <p className="text-muted-foreground mb-4">
              Update multiple columns at once:
            </p>

            <CodeBlock 
              code={`UPDATE students 
SET Email = 'newalice@gmail.com', Age = 21 
WHERE Name = 'Alice';`} 
              id="update-multiple" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">DELETE - Remove Data</h3>
            <p className="text-muted-foreground mb-4">
              Remove a student by name:
            </p>

            <CodeBlock 
              code={`DELETE FROM students WHERE Name = 'Bob';`} 
              id="delete-example" 
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-red-400/30">
              🚨 <strong>DANGEROUS:</strong> DELETE without WHERE removes ALL rows! This is the #1 mistake beginners make!
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Safe Deletion Pattern</h3>
            <p className="text-muted-foreground mb-4">
              Always verify before deleting:
            </p>

            <CodeBlock 
              code={`-- Step 1: Check who you're about to delete
SELECT * FROM students WHERE Name = 'Bob';

-- Step 2: Once verified, delete
DELETE FROM students WHERE Name = 'Bob';`} 
              id="safe-delete" 
            />
          </div>
        </section>

        {/* SECTION 10: AGGREGATE */}
        <section id="aggregate" className="mb-16">
          <h2 className="text-4xl font-black mb-6">📈 Aggregate Functions</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">COUNT - Count Results</h3>
            <p className="text-muted-foreground mb-4">
              How many students are in the database?
            </p>

            <CodeBlock 
              code={`SELECT COUNT(*) FROM students;`} 
              id="aggregate-count" 
            />

            <p className="text-muted-foreground mt-4">Result: <strong>6</strong> (total number of students)</p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">SUM - Add Up Values</h3>
            <p className="text-muted-foreground mb-4">
              Total GPA of all students:
            </p>

            <CodeBlock 
              code={`SELECT SUM(GPA) as TotalGPA FROM students;`} 
              id="aggregate-sum" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">AVG - Average</h3>
            <p className="text-muted-foreground mb-4">
              What's the average GPA?
            </p>

            <CodeBlock 
              code={`SELECT AVG(GPA) as AverageGPA FROM students;`} 
              id="aggregate-avg" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">MIN & MAX</h3>
            <p className="text-muted-foreground mb-4">
              Highest and lowest GPA:
            </p>

            <CodeBlock 
              code={`SELECT 
    MAX(GPA) as HighestGPA,
    MIN(GPA) as LowestGPA 
FROM students;`} 
              id="aggregate-min-max" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">GROUP BY - Group Results</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              If you had a Courses table too, count how many students are in each course:
            </p>

            <CodeBlock 
              code={`SELECT CourseID, COUNT(*) as StudentCount 
FROM enrollments 
GROUP BY CourseID;`} 
              id="group-by-example" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">HAVING - Filter Groups</h3>
            <p className="text-muted-foreground mb-4">
              Which courses have more than 5 students?
            </p>

            <CodeBlock 
              code={`SELECT CourseID, COUNT(*) as StudentCount 
FROM enrollments 
GROUP BY CourseID 
HAVING COUNT(*) > 5;`} 
              id="having-example" 
            />
          </div>
        </section>

        {/* SECTION 11: JOINS */}
        <section id="joins" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🔗 Joins Basics</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What are Joins?</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Joins connect data from multiple tables. Imagine you have a Students table and a Courses table. A join lets you show which students enrolled in which courses.
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">INNER JOIN</h3>
            <p className="text-muted-foreground mb-4">
              Show students AND their courses (only matching records):
            </p>

            <CodeBlock 
              code={`SELECT students.Name, courses.CourseName 
FROM students 
INNER JOIN enrollments ON students.StudentID = enrollments.StudentID 
INNER JOIN courses ON enrollments.CourseID = courses.CourseID;`} 
              id="inner-join-example" 
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-border">
              Only students who actually enrolled appear in results. Students with no enrollments don't show up.
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">LEFT JOIN</h3>
            <p className="text-muted-foreground mb-4">
              Show ALL students, and their courses if they have any:
            </p>

            <CodeBlock 
              code={`SELECT students.Name, courses.CourseName 
FROM students 
LEFT JOIN enrollments ON students.StudentID = enrollments.StudentID 
LEFT JOIN courses ON enrollments.CourseID = courses.CourseID;`} 
              id="left-join-example" 
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-border">
              All students appear, even if they haven't enrolled in any course (course shows as NULL).
            </p>
          </div>
        </section>

        {/* SECTION 12: INDEXES */}
        <section id="indexes" className="mb-16">
          <h2 className="text-4xl font-black mb-6">⚡ Indexes</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What is an Index?</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              An index is like the index in a book. Instead of reading every page to find a topic, you look it up in the index. Indexes make searches MUCH faster.
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Without Index:</h3>
            <p className="text-muted-foreground mb-4">
              Searching 1 million students by email = Check all 1 million emails ❌ SLOW
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">With Index:</h3>
            <p className="text-muted-foreground mb-4">
              Searching 1 million students by email = Direct lookup ✓ FAST
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Creating an Index</h3>
            <p className="text-muted-foreground mb-4">
              Create an index on the Email column:
            </p>

            <CodeBlock 
              code={`CREATE INDEX idx_email ON students(Email);`} 
              id="create-index" 
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-border">
              Now searches on Email are very fast!
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">When to Use Indexes</h3>
            <ul className="text-muted-foreground space-y-3 ml-4">
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Columns used frequently in WHERE clauses</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Foreign keys (for joins)</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Columns with large tables</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Primary keys (automatically indexed)</li>
              <li>✗ NOT on small tables</li>
              <li>✗ NOT on columns with many NULLs</li>
            </ul>
          </div>
        </section>

        {/* SECTION 13: CONSTRAINTS */}
        <section id="constraints" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🛡️ Constraints</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">UNIQUE Constraint</h3>
            <p className="text-muted-foreground mb-4">
              Ensures no duplicate values:
            </p>

            <CodeBlock 
              code={`CREATE TABLE users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL
);`} 
              id="unique-constraint" 
            />

            <p className="text-muted-foreground mt-4">Result: No two users can have the same username or email.</p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">DEFAULT Constraint</h3>
            <p className="text-muted-foreground mb-4">
              Automatically set value if none provided:
            </p>

            <CodeBlock 
              code={`CREATE TABLE posts (
    PostID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(200),
    Content TEXT,
    CreatedDate DATE DEFAULT CURRENT_DATE,
    IsActive BOOLEAN DEFAULT TRUE
);`} 
              id="default-constraint" 
            />

            <p className="text-muted-foreground mt-4">Result: New posts automatically get today's date and IsActive = TRUE</p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">CHECK Constraint</h3>
            <p className="text-muted-foreground mb-4">
              Validate that data meets specific conditions:
            </p>

            <CodeBlock 
              code={`CREATE TABLE products (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    ProductName VARCHAR(100),
    Price FLOAT CHECK (Price > 0),
    Stock INT CHECK (Stock >= 0)
);`} 
              id="check-constraint" 
            />

            <p className="text-muted-foreground mt-4">Result: Price must be positive, Stock can't be negative</p>
          </div>
        </section>

        {/* SECTION 14: MINI PROJECT */}
        <section id="mini-project" className="mb-16">
          <h2 className="text-4xl font-black mb-6">Mini Project: Student Management System</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Project Description</h3>
            <p className="text-muted-foreground mb-4">
              Create a simple database to manage students and their courses.
            </p>
            <ul className="text-muted-foreground space-y-2 ml-4">
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Store student information</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Store course information</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Track which students enrolled in which courses</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Generate reports</li>
            </ul>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Step 1: Create Database</h3>

            <CodeBlock 
              code={`CREATE DATABASE student_management;
USE student_management;`} 
              id="project-step1" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Step 2: Create Tables</h3>

            <CodeBlock 
              code={`CREATE TABLE students (
    StudentID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    GPA FLOAT DEFAULT 0.0,
    EnrollmentDate DATE DEFAULT CURRENT_DATE
);

CREATE TABLE courses (
    CourseID INT PRIMARY KEY AUTO_INCREMENT,
    CourseName VARCHAR(100) NOT NULL,
    InstructorName VARCHAR(100),
    Credits INT CHECK (Credits > 0),
    MaxStudents INT
);

CREATE TABLE enrollments (
    EnrollmentID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT,
    CourseID INT,
    Grade VARCHAR(2),
    EnrollmentDate DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (StudentID) REFERENCES students(StudentID),
    FOREIGN KEY (CourseID) REFERENCES courses(CourseID)
);`} 
              id="project-step2" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Step 3: Insert Sample Data</h3>

            <CodeBlock 
              code={`INSERT INTO students (FirstName, LastName, Email, GPA) VALUES 
('Alice', 'Johnson', 'alice@email.com', 3.8),
('Bob', 'Smith', 'bob@email.com', 3.6),
('Charlie', 'Brown', 'charlie@email.com', 3.9),
('Diana', 'Prince', 'diana@email.com', 3.7);

INSERT INTO courses (CourseName, InstructorName, Credits, MaxStudents) VALUES 
('Introduction to SQL', 'Dr. Park', 3, 30),
('Database Design', 'Dr. Wilson', 4, 25),
('Advanced SQL', 'Dr. Taylor', 3, 20);

INSERT INTO enrollments (StudentID, CourseID, Grade) VALUES 
(1, 1, 'A'),
(1, 2, 'A'),
(2, 1, 'B'),
(3, 2, 'A'),
(4, 3, 'B');`} 
              id="project-step3" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Step 4: Query Examples</h3>

            <CodeBlock 
              code={`-- Show all students
SELECT * FROM students;

-- Show all courses with their instructors
SELECT CourseName, InstructorName, Credits FROM courses;

-- Show which students are enrolled in each course
SELECT courses.CourseName, students.FirstName, students.LastName, enrollments.Grade
FROM enrollments
JOIN students ON enrollments.StudentID = students.StudentID
JOIN courses ON enrollments.CourseID = courses.CourseID
ORDER BY courses.CourseName;

-- Count students in each course
SELECT courses.CourseName, COUNT(enrollments.StudentID) as StudentCount
FROM enrollments
JOIN courses ON enrollments.CourseID = courses.CourseID
GROUP BY courses.CourseID, courses.CourseName;

-- Average GPA of students
SELECT AVG(GPA) as AverageGPA FROM students;

-- Students with GPA > 3.7
SELECT FirstName, LastName, GPA FROM students WHERE GPA > 3.7;`} 
              id="project-step4" 
            />
          </div>
        </section>

        {/* SECTION 15: COMMON MISTAKES */}
        <section id="mistakes" className="mb-16">
          <h2 className="text-4xl font-black mb-6">⚠️ Common Beginner Mistakes</h2>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><AlertCircle size={24} className="text-red-400" /> Mistake #1: DELETE Without WHERE</h3>
            
            <CodeBlock 
              code={`-- WRONG! This deletes ALL students!
DELETE FROM students;

-- CORRECT! This deletes only Bob
DELETE FROM students WHERE Name = 'Bob';`} 
              id="mistake-delete" 
            />

            <p className="text-muted-foreground mt-4 p-4 bg-red-900/30 rounded-lg border border-red-400/30">
              🚨 Always use WHERE with DELETE!
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><AlertCircle size={24} className="text-red-400" /> Mistake #2: Wrong Data Type</h3>
            
            <CodeBlock 
              code={`-- WRONG! Phone number as INT loses leading zeros
CREATE TABLE contacts (
    Phone INT
);

-- CORRECT! Keep as VARCHAR
CREATE TABLE contacts (
    Phone VARCHAR(15)
);`} 
              id="mistake-datatype" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><AlertCircle size={24} className="text-red-400" /> Mistake #3: Forgetting NOT NULL</h3>
            
            <CodeBlock 
              code={`-- WRONG! Names can be empty
CREATE TABLE students (
    Name VARCHAR(100)
);

-- CORRECT! Name is required
CREATE TABLE students (
    Name VARCHAR(100) NOT NULL
);`} 
              id="mistake-notnull" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><AlertCircle size={24} className="text-red-400" /> Mistake #4: Case Sensitivity in Text</h3>
            
            <CodeBlock 
              code={`-- These might not match (depends on database)
SELECT * FROM students WHERE Name = 'alice';
SELECT * FROM students WHERE Name = 'Alice';

-- This always works
SELECT * FROM students WHERE LOWER(Name) = 'alice';`} 
              id="mistake-case" 
            />
          </div>

          <div className="bg-white border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><AlertCircle size={24} className="text-red-400" /> Mistake #5: Wrong Comparison for NULL</h3>
            
            <CodeBlock 
              code={`-- WRONG! This never works
SELECT * FROM students WHERE Email = NULL;

-- CORRECT! Use IS NULL
SELECT * FROM students WHERE Email IS NULL;

-- To find non-NULL values
SELECT * FROM students WHERE Email IS NOT NULL;`} 
              id="mistake-null" 
            />
          </div>
        </section>

        {/* RECAP SECTION */}
        <section id="recap" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🎓 Quick Recap Summary</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-border rounded-xl p-6">
              <h4 className="font-bold text-[#FF9500] mb-3">Core Concepts</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Databases store organized data in tables</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Tables have columns (fields) and rows (records)</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Primary Key = unique identifier for each row</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Foreign Key = links to another table</li>
              </ul>
            </div>

            <div className="bg-white border border-border rounded-xl p-6">
              <h4 className="font-bold text-[#FF9500] mb-3">Main Commands</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> CREATE - Make databases and tables</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> INSERT - Add data</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> SELECT - Retrieve data</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> UPDATE - Modify data</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> DELETE - Remove data</li>
              </ul>
            </div>

            <div className="bg-white border border-border rounded-xl p-6">
              <h4 className="font-bold text-[#FF9500] mb-3">Filtering & Analysis</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> WHERE - Filter for specific records</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> AND / OR - Combine conditions</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> ORDER BY - Sort results</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> LIMIT - Get first N rows</li>
              </ul>
            </div>

            <div className="bg-white border border-border rounded-xl p-6">
              <h4 className="font-bold text-[#FF9500] mb-3">Advanced Features</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> COUNT, SUM, AVG, MIN, MAX</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> GROUP BY - Group similar records</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> JOIN - Connect tables</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> INDEX - Speed up searches</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PRACTICE QUESTIONS */}
        <section id="practice" className="mb-16">
          <h2 className="text-4xl font-black mb-6">💪 Practice Questions</h2>

          <div className="space-y-6">
            <details className="group cursor-pointer bg-white border border-border rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                1. What's the difference between PRIMARY KEY and FOREIGN KEY?
              </summary>
              <p className="text-muted-foreground text-sm">
                <strong>PRIMARY KEY:</strong> Uniquely identifies each row in a table. No two rows have the same PK.<br/>
                <strong>FOREIGN KEY:</strong> References a PK in another table. Creates relationships between tables.
              </p>
            </details>

            <details className="group cursor-pointer bg-white border border-border rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                2. When should you use WHERE in DELETE?
              </summary>
              <p className="text-muted-foreground text-sm">
                ALWAYS use WHERE with DELETE! Without WHERE, you delete all rows. It's the most common SQL mistake.
              </p>
            </details>

            <details className="group cursor-pointer bg-white border border-border rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                3. What data type should you use for email addresses?
              </summary>
              <p className="text-muted-foreground text-sm">
                <strong>VARCHAR(100)</strong> or larger. Email addresses need text storage with variable length.
              </p>
            </details>

            <details className="group cursor-pointer bg-white border border-border rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                4. How do you check for NULL values?
              </summary>
              <p className="text-muted-foreground text-sm">
                Use <code className="bg-[#1e1e1e] px-2 py-1 rounded">IS NULL</code> or <code className="bg-[#1e1e1e] px-2 py-1 rounded">IS NOT NULL</code>. Never use = NULL.
              </p>
            </details>

            <details className="group cursor-pointer bg-white border border-border rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                5. What does INNER JOIN do?
              </summary>
              <p className="text-muted-foreground text-sm">
                INNER JOIN returns only matching records from both tables. If a student has no course enrollment, they won't appear in the result.
              </p>
            </details>
          </div>
        </section>

        {/* NEXT STEPS */}
        <section id="nextsteps" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🚀 Next Learning Steps</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#FF9500] to-[#E88600] rounded-xl p-6 border border-[#FFB347]/40">
              <h4 className="font-bold mb-3 text-lg">📚 Advanced SQL</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> OUTER JOIN & CROSS JOIN</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Subqueries & Nested Queries</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Views (Saved queries)</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Stored Procedures</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl p-6 border border-cyan-400/30">
              <h4 className="font-bold mb-3 text-lg">🗄️ Database Design</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Normalization (1NF, 2NF, 3NF)</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Entity-Relationship Diagrams</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Best Practices Design</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Avoiding Data Redundancy</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 border border-purple-400/30">
              <h4 className="font-bold mb-3 text-lg">⚡ Performance</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Query Optimization</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Index Strategies</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Explain & Analyze</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Scaling Databases</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 border border-green-400/30">
              <h4 className="font-bold mb-3 text-lg">🔒 Security & Admin</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> User Management & Permissions</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Backup & Recovery</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Transaction Control</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Preventing SQL Injection</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] rounded-2xl p-12 text-center border border-border">
            <h2 className="text-3xl font-black mb-4">Ready to Master SQL?</h2>
            <p className="text-lg mb-8 text-white/90">Join thousands of students learning SQL with our interactive courses and 1:1 mentorship.</p>
            <button className="bg-white text-[#4F46E5] px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all text-lg">
              Start Your SQL Journey Today
            </button>
          </div>
        </section>
      </main>
      </div>

      <footer className="py-10 text-center text-muted-foreground text-sm border-t border-border mt-16">
        © 2026 MentorMuni. Learn SQL for Beginners - Free Tutorial with Practical Examples.
      </footer>
    </div>
  );
};

export default SqlTutorial;
