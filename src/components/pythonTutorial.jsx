import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Menu, X, Check, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const PythonTutorial = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  const topics = [
    { id: 'intro', title: 'Introduction to Python' },
    { id: 'installation', title: 'Installing Python' },
    { id: 'first-program', title: 'Your First Program' },
    { id: 'variables', title: 'Variables & Data Types' },
    { id: 'user-input', title: 'User Input' },
    { id: 'operators', title: 'Operators' },
    { id: 'conditionals', title: 'Conditionals' },
    { id: 'loops', title: 'Loops' },
    { id: 'strings', title: 'Strings' },
    { id: 'lists', title: 'Lists' },
    { id: 'tuples-sets', title: 'Tuples & Sets' },
    { id: 'dictionaries', title: 'Dictionaries' },
    { id: 'functions', title: 'Functions' },
    { id: 'errors', title: 'Error Handling' },
    { id: 'project', title: 'Mini Project' },
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
          <span className="text-xs text-muted-foreground">Python</span>
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
    <div className="min-h-screen bg-[#FFFDF8] text-muted-foreground font-sans antialiased">
      {/* Meta Tags for SEO */}
      <head>
        <title>Python for Beginners - Learn Python Step by Step | Complete Tutorial</title>
        <meta name="description" content="Master Python programming from scratch. Complete Python basics tutorial for beginners with zero coding experience. Learn Python step by step with practical examples." />
        <meta name="keywords" content="Python for beginners, learn Python step by step, Python basics tutorial, Python programming for beginners, beginner Python" />
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

          <button onClick={() => setIsNavOpen(!isNavOpen)} className="md:hidden text-white">
            {isNavOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex gap-8 max-w-[1400px] mx-auto px-6 py-16">
        
        {/* LEFT SIDEBAR NAVIGATION - DESKTOP ONLY */}
        <aside className="hidden lg:block w-64 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto">
          <div className="bg-white/5 border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-6 text-[#FF9500]">📑 Topics</h3>
            <nav className="space-y-2">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => scrollToSection(topic.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-semibold ${
                    activeSection === topic.id
                      ? 'bg-[#FF9500] text-white'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
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
            Python for Beginners
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-4">
            Learn Python step by step with this complete beginner-friendly tutorial. Perfect for someone with zero programming experience who wants to master Python basics and start their programming journey.
          </p>
          <div className="flex gap-4 flex-wrap">
            <div className="px-4 py-2 bg-[#FF9500]/20 border border-[#4F46E5]/50 rounded-lg text-sm">⏱️ 2-3 hours read</div>
            <div className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-lg text-sm flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Beginner Friendly</div>
            <div className="px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-lg text-sm">💻 With Practical Examples</div>
          </div>
        </div>

        <div className="mb-16 bg-white/5 border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
          <ol className="space-y-2 text-muted-foreground">
            <li>1. What is Python and why learn it</li>
            <li>2. Installing Python on your computer</li>
            <li>3. Writing your first program</li>
            <li>4. Variables and data types</li>
            <li>5. Getting user input</li>
            <li>6. Operators and expressions</li>
            <li>7. Making decisions with conditionals</li>
            <li>8. Repeating code with loops</li>
            <li>9. Working with strings and text</li>
            <li>10. Lists, tuples, and dictionaries</li>
            <li>11. Creating reusable functions</li>
            <li>12. Handling errors gracefully</li>
            <li>13. Building a mini project</li>
            <li>14. Practice questions and next steps</li>
          </ol>
        </div>

        {/* SECTION 1: INTRODUCTION */}
        <section id="intro" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🐍 Introduction to Python</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What is Python?</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Python is a programming language that lets you give instructions to computers in a way that reads almost like English. Created in 1991 by Guido van Rossum, Python has become one of the most popular programming languages in the world because it's easy to learn and incredibly powerful.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              <strong>Think of Python like writing recipes:</strong> Just as you give step-by-step instructions to cook food, Python lets you give step-by-step instructions to tell a computer what to do!
            </p>
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Why Learn Python?</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-cyan-400 mb-2">1. Super Easy to Learn</h4>
                <p className="text-muted-foreground">Python reads like English. If you can read English, you can understand Python code. It's the perfect first programming language.</p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 mb-2">2. Highly Demanded Skill</h4>
                <p className="text-muted-foreground">Companies worldwide need Python developers. Great career opportunities and excellent salaries. Used by companies like Google, Netflix, Instagram, and Spotify.</p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 mb-2">3. Used Everywhere</h4>
                <ul className="text-muted-foreground ml-4 space-y-1">
                  <li>• Web development (building websites)</li>
                  <li>• Data science (analyzing huge amounts of data)</li>
                  <li>• Artificial intelligence and machine learning</li>
                  <li>• Game development</li>
                  <li>• Automation (making computers do repetitive tasks)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 mb-2">4. Strong Community</h4>
                <p className="text-muted-foreground">Millions of Python developers. Tons of free libraries (pre-written code) to use. Easy to find help and solutions online.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Where is Python Used?</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-[#FF9500] mb-2">Data Science</h4>
                <p className="text-muted-foreground text-sm">Analyzing data, creating charts, predicting trends</p>
              </div>

              <div>
                <h4 className="font-bold text-[#FF9500] mb-2">Artificial Intelligence</h4>
                <p className="text-muted-foreground text-sm">ChatGPT, image recognition, smart assistants</p>
              </div>

              <div>
                <h4 className="font-bold text-[#FF9500] mb-2">Web Development</h4>
                <p className="text-muted-foreground text-sm">Building Instagram, Spotify, YouTube backends</p>
              </div>

              <div>
                <h4 className="font-bold text-[#FF9500] mb-2">Automation</h4>
                <p className="text-muted-foreground text-sm">Making computers do repetitive tasks automatically</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: INSTALLATION */}
        <section id="installation" className="mb-16">
          <h2 className="text-4xl font-black mb-6">⚙️ Installing Python</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Step-by-Step Installation</h3>

            <h4 className="text-xl font-bold mb-4 text-cyan-400">For Windows:</h4>
            <ol className="text-muted-foreground space-y-2 ml-4 mb-6">
              <li>1. Go to: https://www.python.org/</li>
              <li>2. Click "Downloads"</li>
              <li>3. Download Python 3.12 (or latest version)</li>
              <li>4. Run the installer</li>
              <li>5. ⚠️ <strong>IMPORTANT:</strong> Check "Add Python to PATH" before clicking Install</li>
              <li>6. Click Install Now</li>
              <li>7. Wait for installation to complete</li>
            </ol>

            <h4 className="text-xl font-bold mb-4 text-cyan-400">For Mac:</h4>
            <ol className="text-muted-foreground space-y-2 ml-4 mb-6">
              <li>1. Go to: https://www.python.org/</li>
              <li>2. Download macOS installer</li>
              <li>3. Run the installer</li>
              <li>4. Follow on-screen instructions</li>
            </ol>

            <h4 className="text-xl font-bold mb-4 text-cyan-400">For Linux:</h4>
            <CodeBlock
              code={`sudo apt-get update
sudo apt-get install python3 python3-pip`}
              id="linux-install"
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-cyan-400/30 flex items-center gap-2">
              <Check size={16} className="text-green-400 flex-shrink-0" /> Python is now installed on your computer!  
            </p>
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Verify Installation</h3>

            <p className="text-muted-foreground mb-4">Open Command Prompt (Windows) or Terminal (Mac/Linux) and type:</p>

            <CodeBlock
              code={`python --version`}
              id="verify-python"
            />

            <p className="text-muted-foreground mt-4">You should see something like: <code className="bg-[#1e1e1e] px-2 py-1 rounded">Python 3.12.0</code></p>
          </div>
        </section>

        {/* SECTION 3: FIRST PROGRAM */}
        <section id="first-program" className="mb-16">
          <h2 className="text-4xl font-black mb-6">💻 Your First Program</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">The print() Function</h3>
            <p className="text-muted-foreground mb-4">
              The simplest way to use Python is to print text to the screen using the <code className="bg-[#1e1e1e] px-2 py-1 rounded">print()</code> function.
            </p>

            <CodeBlock
              code={`print("Hello, World!")`}
              id="hello-world"
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-cyan-400/30">
              <strong>Output:</strong> <code>Hello, World!</code>
            </p>
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">How to Run Python Code</h3>

            <h4 className="text-lg font-bold mb-4 text-cyan-400">Step 1: Create a file</h4>
            <p className="text-muted-foreground mb-4">Create a new file named <code className="bg-[#1e1e1e] px-2 py-1 rounded">hello.py</code> (the .py extension means it's a Python file)</p>

            <h4 className="text-lg font-bold mb-4 text-cyan-400">Step 2: Write the code</h4>
            <CodeBlock
              code={`print("Hello, World!")`}
              id="hello-code"
            />

            <h4 className="text-lg font-bold mb-4 text-cyan-400">Step 3: Run the code</h4>
            <p className="text-muted-foreground mb-2">Open Command Prompt/Terminal and type:</p>
            <CodeBlock
              code={`python hello.py`}
              id="run-python"
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-border">
              You should see: <code>Hello, World!</code>
            </p>
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">More print() Examples</h3>

            <CodeBlock
              code={`print("Python is awesome!")
print("I'm learning to code")
print(123)
print(3.14)
print(True)`}
              id="print-examples"
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-border">
              <strong>Output:</strong><br/>
              Python is awesome!<br/>
              I'm learning to code<br/>
              123<br/>
              3.14<br/>
              True
            </p>
          </div>
        </section>

        {/* SECTION 4: VARIABLES */}
        <section id="variables" className="mb-16">
          <h2 className="text-4xl font-black mb-6">📦 Variables & Data Types</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What is a Variable?</h3>
            <p className="text-muted-foreground mb-4">
              A variable is like a box that stores information. You give it a name, and then you can use that name to refer to the information stored in the box.
            </p>

            <CodeBlock
              code={`name = "Alice"
age = 25
height = 5.6
is_student = True

print(name)
print(age)
print(height)
print(is_student)`}
              id="variables-intro"
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-border">
              <strong>Output:</strong><br/>
              Alice<br/>
              25<br/>
              5.6<br/>
              True
            </p>
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Data Types</h3>

            <div className="space-y-4">
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-[#FF9500]">int (Integer)</strong> - Whole numbers
                <CodeBlock code={`age = 25
year = 2026
count = -5`} id="int-type" />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-[#FF9500]">float (Decimal)</strong> - Numbers with decimals
                <CodeBlock code={`height = 5.6
price = 19.99
temperature = -3.5`} id="float-type" />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-[#FF9500]">str (String)</strong> - Text
                <CodeBlock code={`name = "Alice"
city = "New York"
message = "Hello, World!"`} id="str-type" />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-[#FF9500]">bool (Boolean)</strong> - True or False
                <CodeBlock code={`is_student = True
is_active = False`} id="bool-type" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Checking Data Types</h3>
            <p className="text-muted-foreground mb-4">Use the <code className="bg-[#1e1e1e] px-2 py-1 rounded">type()</code> function:</p>

            <CodeBlock
              code={`print(type(25))       # &lt;class 'int'&gt;
print(type(5.6))      # &lt;class 'float'&gt;
print(type("Alice"))  # &lt;class 'str'&gt;
print(type(True))     # &lt;class 'bool'&gt;`}
              id="type-function"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Variable Naming Rules</h3>
            <ul className="text-muted-foreground space-y-2 ml-4">
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Start with a letter or underscore: <code className="bg-[#1e1e1e] px-1">name</code>, <code className="bg-[#1e1e1e] px-1">_age</code></li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Use lowercase with underscores: <code className="bg-[#1e1e1e] px-1">student_name</code>, <code className="bg-[#1e1e1e] px-1">is_active</code></li>
              <li><span className="flex items-center gap-1"><AlertCircle size={16} className="text-red-400" /></span> Don't use spaces or special characters: <code className="bg-[#1e1e1e] px-1">my age</code> ❌, <code className="bg-[#1e1e1e] px-1">age@</code> ❌</li>
              <li><span className="flex items-center gap-1"><AlertCircle size={16} className="text-red-400" /></span> Don't start with numbers: <code className="bg-[#1e1e1e] px-1">2name</code> ❌</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Use descriptive names: <code className="bg-[#1e1e1e] px-1">student_name</code> ✓ instead of <code className="bg-[#1e1e1e] px-1">x</code> ❌</li>
            </ul>
          </div>
        </section>

        {/* SECTION 5: USER INPUT */}
        <section id="user-input" className="mb-16">
          <h2 className="text-4xl font-black mb-6">⌨️ User Input</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Getting Input from Users</h3>
            <p className="text-muted-foreground mb-4">
              Use the <code className="bg-[#1e1e1e] px-2 py-1 rounded">input()</code> function to ask users to type something:
            </p>

            <CodeBlock
              code={`name = input("What is your name? ")
print("Hello, " + name)`}
              id="input-example"
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-border">
              <strong>Output:</strong><br/>
              What is your name? <strong>Alice</strong><br/>
              Hello, Alice
            </p>
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Converting Input to Numbers</h3>
            <p className="text-muted-foreground mb-4">
              By default, <code className="bg-[#1e1e1e] px-2 py-1 rounded">input()</code> gives you text (string). To do math, convert it to a number:
            </p>

            <CodeBlock
              code={`age = int(input("How old are you? "))
print("Next year you'll be: " + str(age + 1))

price = float(input("Enter price: "))
print("Total with tax: " + str(price * 1.1))`}
              id="input-conversion"
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-yellow-400/30">
              ⚠️ Remember: <code className="bg-[#1e1e1e] px-1">int()</code> converts to integer, <code className="bg-[#1e1e1e] px-1">float()</code> converts to decimal
            </p>
          </div>
        </section>

        {/* SECTION 6: OPERATORS */}
        <section id="operators" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🔢 Operators</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Arithmetic Operators</h3>
            <p className="text-muted-foreground mb-4">Used to do math:</p>

            <CodeBlock
              code={`x = 10
y = 3

print(x + y)   # 13 (addition)
print(x - y)   # 7 (subtraction)
print(x * y)   # 30 (multiplication)
print(x / y)   # 3.33... (division)
print(x // y)  # 3 (floor division - whole number only)
print(x % y)   # 1 (remainder)
print(x ** y)  # 1000 (exponent - power)`}
              id="arithmetic-ops"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Comparison Operators</h3>
            <p className="text-muted-foreground mb-4">Compare values (returns True or False):</p>

            <CodeBlock
              code={`x = 5
y = 8

print(x == y)  # False (equal to)
print(x != y)  # True (not equal to)
print(x &lt; y)   # True (less than)
print(x &gt; y)   # False (greater than)
print(x &lt;= y)  # True (less than or equal)
print(x &gt;= y)  # False (greater than or equal)`}
              id="comparison-ops"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Logical Operators</h3>
            <p className="text-muted-foreground mb-4">Combine conditions:</p>

            <CodeBlock
              code={`is_student = True
has_pass = True

print(is_student and has_pass)  # True (both true)
print(is_student or has_pass)   # True (at least one true)
print(not is_student)           # False (reverses value)`}
              id="logical-ops"
            />
          </div>
        </section>

        {/* SECTION 7: CONDITIONALS */}
        <section id="conditionals" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🔄 Conditionals</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">if Statement</h3>
            <p className="text-muted-foreground mb-4">Do something only if a condition is true:</p>

            <CodeBlock
              code={`age = 18

if age >= 18:
    print("You are an adult")`}
              id="if-statement"
            />

            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-border">
              Note: Python uses indentation (spaces) to show what code belongs to the if block.
            </p>
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">if-else Statement</h3>
            <p className="text-muted-foreground mb-4">Do one thing if true, something else if false:</p>

            <CodeBlock
              code={`age = 15

if age >= 18:
    print("You are an adult")
else:
    print("You are a teenager")`}
              id="if-else-statement"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">if-elif-else Statement</h3>
            <p className="text-muted-foreground mb-4">Multiple conditions:</p>

            <CodeBlock
              code={`score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")`}
              id="if-elif-else-statement"
            />
          </div>
        </section>

        {/* SECTION 8: LOOPS */}
        <section id="loops" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🔁 Loops</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">for Loop</h3>
            <p className="text-muted-foreground mb-4">Repeat code a specific number of times:</p>

            <CodeBlock
              code={`for i in range(5):
    print(i)

# Output: 0, 1, 2, 3, 4`}
              id="for-loop-basic"
            />

            <p className="text-muted-foreground mt-4">Or loop through a list:</p>

            <CodeBlock
              code={`fruits = ["apple", "banana", "orange"]

for fruit in fruits:
    print(fruit)`}
              id="for-loop-list"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">while Loop</h3>
            <p className="text-muted-foreground mb-4">Repeat while a condition is true:</p>

            <CodeBlock
              code={`count = 0

while count &lt; 3:
    print(count)
    count = count + 1

# Output: 0, 1, 2`}
              id="while-loop"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">break and continue</h3>

            <p className="text-muted-foreground mb-4"><strong className="text-cyan-400">break</strong> - Exit loop immediately:</p>
            <CodeBlock
              code={`for i in range(10):
    if i == 5:
        break
    print(i)

# Output: 0, 1, 2, 3, 4`}
              id="break-example"
            />

            <p className="text-muted-foreground my-4"><strong className="text-cyan-400">continue</strong> - Skip to next iteration:</p>
            <CodeBlock
              code={`for i in range(5):
    if i == 2:
        continue
    print(i)

# Output: 0, 1, 3, 4`}
              id="continue-example"
            />
          </div>
        </section>

        {/* SECTION 9: STRINGS */}
        <section id="strings" className="mb-16">
          <h2 className="text-4xl font-black mb-6">📝 Strings</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">String Basics</h3>

            <CodeBlock
              code={`text = "Hello, World!"

print(len(text))           # 13 (length)
print(text.upper())        # HELLO, WORLD!
print(text.lower())        # hello, world!
print(text.replace("World", "Python"))  # Hello, Python!
print("World" in text)     # True (contains?)`}
              id="string-methods"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Indexing (Getting Characters)</h3>
            <p className="text-muted-foreground mb-4">Remember: Counting starts at 0!</p>

            <CodeBlock
              code={`text = "Python"

print(text[0])   # P (first character)
print(text[1])   # y (second character)
print(text[-1])  # n (last character)`}
              id="string-indexing"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Slicing (Getting Substrings)</h3>

            <CodeBlock
              code={`text = "Python"

print(text[0:2])   # Py (characters 0 and 1)
print(text[2:])    # thon (from 2 to end)
print(text[:3])    # Pyt (first 3 characters)`}
              id="string-slicing"
            />
          </div>
        </section>

        {/* SECTION 10: LISTS */}
        <section id="lists" className="mb-16">
          <h2 className="text-4xl font-black mb-6">📋 Lists</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Creating and Accessing Lists</h3>

            <CodeBlock
              code={`fruits = ["apple", "banana", "orange"]

print(fruits[0])    # apple
print(fruits[1])    # banana
print(len(fruits))  # 3 (how many items)`}
              id="list-basics"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Adding and Removing Items</h3>

            <CodeBlock
              code={`fruits = ["apple", "banana"]

fruits.append("orange")    # Add to end
print(fruits)  # ["apple", "banana", "orange"]

fruits.remove("banana")    # Remove item
print(fruits)  # ["apple", "orange"]

fruits.pop()   # Remove last item
print(fruits)  # ["apple"]`}
              id="list-modify"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Looping Through Lists</h3>

            <CodeBlock
              code={`numbers = [1, 2, 3, 4, 5]

for number in numbers:
    print(number)

# Output: 1, 2, 3, 4, 5`}
              id="list-loop"
            />
          </div>
        </section>

        {/* SECTION 11: TUPLES AND SETS */}
        <section id="tuples-sets" className="mb-16">
          <h2 className="text-4xl font-black mb-6">📦 Tuples &amp; Sets</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Tuples (Lists You Can't Change)</h3>
            <p className="text-muted-foreground mb-4">Tuples are like lists but you can't modify them after creating:</p>

            <CodeBlock
              code={`colors = ("red", "green", "blue")

print(colors[0])   # red
print(len(colors)) # 3

# colors.append("yellow")  # Error! Can't modify tuples`}
              id="tuples-example"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Sets (Unique Values Only)</h3>
            <p className="text-muted-foreground mb-4">Sets can only contain unique values. Duplicates are automatically removed:</p>

            <CodeBlock
              code={`numbers = {1, 2, 3, 2, 1}
print(numbers)  # {1, 2, 3} (duplicates removed)

numbers.add(4)
print(numbers)  # {1, 2, 3, 4}`}
              id="sets-example"
            />
          </div>
        </section>

        {/* SECTION 12: DICTIONARIES */}
        <section id="dictionaries" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🗝️ Dictionaries</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What are Dictionaries?</h3>
            <p className="text-muted-foreground mb-4">
              Dictionaries store data as key-value pairs. Think of it like a real dictionary where you look up a word (key) to find its definition (value).
            </p>

            <CodeBlock
              code={`student = {
    "name": "Alice",
    "age": 20,
    "gpa": 3.8
}

print(student["name"])  # Alice
print(student["age"])   # 20`}
              id="dictionary-basics"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Modifying Dictionaries</h3>

            <CodeBlock
              code={`student = {"name": "Alice", "age": 20}

student["gpa"] = 3.8        # Add new key-value
student["age"] = 21         # Update existing value

del student["name"]         # Delete a key

print(student)  # {"age": 21, "gpa": 3.8}`}
              id="dictionary-modify"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Looping Through Dictionaries</h3>

            <CodeBlock
              code={`student = {"name": "Alice", "age": 20, "gpa": 3.8}

for key in student:
    print(key, student[key])

# Output:
# name Alice
# age 20
# gpa 3.8`}
              id="dictionary-loop"
            />
          </div>
        </section>

        {/* SECTION 13: FUNCTIONS */}
        <section id="functions" className="mb-16">
          <h2 className="text-4xl font-black mb-6">Functions</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Creating Functions</h3>
            <p className="text-muted-foreground mb-4">Functions let you write code once and use it many times:</p>

            <CodeBlock
              code={`def greet():
    print("Hello!")

greet()  # Call the function
greet()  # Call it again`}
              id="function-basic"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Functions with Parameters</h3>
            <p className="text-muted-foreground mb-4">Pass information to functions:</p>

            <CodeBlock
              code={`def greet(name):
    print("Hello, " + name)

greet("Alice")  # Hello, Alice
greet("Bob")    # Hello, Bob`}
              id="function-params"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Functions with Return Values</h3>
            <p className="text-muted-foreground mb-4">Get results back from functions:</p>

            <CodeBlock
              code={`def add(a, b):
    return a + b

result = add(5, 3)
print(result)  # 8`}
              id="function-return"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Complete Function Example</h3>

            <CodeBlock
              code={`def calculate_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    else:
        return "F"

grade = calculate_grade(85)
print("Your grade is:", grade)  # Your grade is: B`}
              id="function-complete"
            />
          </div>
        </section>

        {/* SECTION 14: ERROR HANDLING */}
        <section id="errors" className="mb-16">
          <h2 className="text-4xl font-black mb-6">⚠️ Error Handling</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">try-except Blocks</h3>
            <p className="text-muted-foreground mb-4">Handle errors gracefully without crashing:</p>

            <CodeBlock
              code={`try:
    number = int(input("Enter a number: "))
    print("You entered:", number)
except ValueError:
    print("Error: Please enter a valid number!")`}
              id="try-except"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Catching Different Errors</h3>

            <CodeBlock
              code={`try:
    x = 10 / 0  # This causes an error
except ZeroDivisionError:
    print("Error: Can't divide by zero!")`}
              id="specific-errors"
            />
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Common Beginner Mistakes</h3>

            <div className="space-y-3">
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-red-400 flex items-center gap-1"><AlertCircle size={16} className="flex-shrink-0" /> Mistake:</strong> Forgetting to convert input
                <CodeBlock
                  code={`age = input("Age: ")
print(age + 1)  # Error! Can't add string + number`}
                  id="mistake-conversion"
                />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-red-400 flex items-center gap-1"><AlertCircle size={16} className="flex-shrink-0" /> Mistake:</strong> Indentation errors
                <CodeBlock
                  code={`for i in range(5):
print(i)  # Error! Wrong indentation`}
                  id="mistake-indent"
                />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-border">
                <strong className="text-red-400 flex items-center gap-1"><AlertCircle size={16} className="flex-shrink-0" /> Mistake:</strong> Using undefined variables
                <CodeBlock
                  code={`print(name)  # Error! If 'name' was never defined`}
                  id="mistake-undefined"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 15: MINI PROJECT */}
        <section id="project" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🎮 Mini Project: Number Guessing Game</h2>

          <div className="bg-white/5 border border-border rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Project Description</h3>
            <p className="text-muted-foreground mb-4">
              Create a simple game where the computer picks a random number between 1-100, and the player tries to guess it!
            </p>
            <ul className="text-muted-foreground space-y-2 ml-4">
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Computer picks a random number</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Player makes guesses</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Program tells if guess is too high or too low</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Count how many guesses it took</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Complete Solution</h3>

            <CodeBlock
              code={`import random

print("Welcome to the Number Guessing Game!")
print("I'm thinking of a number between 1 and 100")

number = random.randint(1, 100)
guess = 0
tries = 0

while guess != number:
    try:
        guess = int(input("Take a guess: "))
        tries = tries + 1
        
        if guess &lt; number:
            print("Too low! Try again.")
        elif guess &gt; number:
            print("Too high! Try again.")
        else:
            print(f"You got it! It took {tries} tries!")
    except ValueError:
        print("Please enter a valid number!")

print("Thanks for playing!")`}
              id="guessing-game"
            />
          </div>
        </section>

        {/* SECTION 16: RECAP */}
        <section id="recap" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🎓 Quick Recap Summary</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-border rounded-xl p-6">
              <h4 className="font-bold text-[#FF9500] mb-3">Basics</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Variables store data</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Data types: int, float, str, bool</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> print() shows output</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> input() gets user input</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-border rounded-xl p-6">
              <h4 className="font-bold text-[#FF9500] mb-3">Control Flow</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> if/else for decisions</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> for/while for loops</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> break to exit early</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> continue to skip forward</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-border rounded-xl p-6">
              <h4 className="font-bold text-[#FF9500] mb-3">Data Structures</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Strings for text</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Lists for collections</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Tuples for immutable lists</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Dictionaries for key-value pairs</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-border rounded-xl p-6">
              <h4 className="font-bold text-[#FF9500] mb-3">Functions &amp; Errors</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> def to create functions</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> return to send back results</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> try-except for error handling</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Parameters to pass data</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PRACTICE QUESTIONS */}
        <section id="practice" className="mb-16">
          <h2 className="text-4xl font-black mb-6">💪 Practice Questions</h2>

          <div className="space-y-6">
            <details className="group cursor-pointer bg-white/5 border border-border rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                1. What's the difference between lists and tuples?
              </summary>
              <p className="text-muted-foreground text-sm">
                <strong>Lists:</strong> Can be changed (add, remove, modify) using methods like append() and remove().<br/>
                <strong>Tuples:</strong> Cannot be changed after creation. They're "immutable".<br/>
                Use lists when you need flexibility, tuples when you need fixed data.
              </p>
            </details>

            <details className="group cursor-pointer bg-white/5 border border-border rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                2. When should you use a dictionary instead of a list?
              </summary>
              <p className="text-muted-foreground text-sm">
                Use dictionaries when your data has labels (keys). For example, student information (name, age, gpa) is better as a dictionary than a list because you can access it by key, not position.
              </p>
            </details>

            <details className="group cursor-pointer bg-white/5 border border-border rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                3. What's the purpose of try-except?
              </summary>
              <p className="text-muted-foreground text-sm">
                Try-except prevents your program from crashing when an error occurs. It "catches" the error and lets you decide what to do (like print a friendly message).
              </p>
            </details>

            <details className="group cursor-pointer bg-white/5 border border-border rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                4. What is indentation and why is it important?
              </summary>
              <p className="text-muted-foreground text-sm">
                Indentation (spaces at the beginning of lines) tells Python which code belongs to a block (like inside a function or if statement). Without correct indentation, Python gives errors.
              </p>
            </details>

            <details className="group cursor-pointer bg-white/5 border border-border rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                5. How do you convert a string to a number?
              </summary>
              <p className="text-muted-foreground text-sm">
                Use <code className="bg-[#1e1e1e] px-2 py-1 rounded">int()</code> for whole numbers or <code className="bg-[#1e1e1e] px-2 py-1 rounded">float()</code> for decimals. Example: <code className="bg-[#1e1e1e] px-2 py-1 rounded">age = int("25")</code>
              </p>
            </details>
          </div>
        </section>

        {/* NEXT STEPS */}
        <section id="nextsteps" className="mb-16">
          <h2 className="text-4xl font-black mb-6">🚀 Next Learning Steps</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#FF9500] to-[#E88600] rounded-xl p-6 border border-[#FFB347]/40">
              <h4 className="font-bold mb-3 text-lg">📚 Intermediate Python</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> List comprehensions</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Lambda functions</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Decorators</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Generators</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl p-6 border border-cyan-400/30">
              <h4 className="font-bold mb-3 text-lg">📦 Object-Oriented Programming</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Classes and Objects</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Inheritance</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Polymorphism</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Encapsulation</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 border border-purple-400/30">
              <h4 className="font-bold mb-3 text-lg">🔧 Libraries &amp; Frameworks</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> NumPy (data science)</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Pandas (data analysis)</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Django (web development)</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Flask (web development)</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 border border-green-400/30">
              <h4 className="font-bold mb-3 text-lg">Career Paths</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Backend Web Developer</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Data Scientist</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Machine Learning Engineer</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Automation Engineer</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] rounded-2xl p-12 text-center border border-border">
            <h2 className="text-3xl font-black mb-4">Ready to Master Python?</h2>
            <p className="text-lg mb-8 text-white/90">Join thousands of students learning Python with our interactive courses and 1:1 mentorship.</p>
            <button className="bg-white text-[#4F46E5] px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all text-lg">
              Start Your Python Journey Today
            </button>
          </div>
        </section>
      </main>
      </div>

      <footer className="py-10 text-center text-muted-foreground text-sm border-t border-border mt-16">
        © 2026 MentorMuni. Learn Python for Beginners - Free Tutorial with Practical Examples.
      </footer>
    </div>
  );
};

export default PythonTutorial;
