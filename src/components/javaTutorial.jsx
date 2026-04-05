import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Copy, Check } from 'lucide-react';
import logo from '../assets/logo.png';

const JavaTutorial = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  const topics = [
    { id: 'intro', title: 'Introduction to Java' },
    { id: 'installation', title: 'Installation & Setup' },
    { id: 'structure', title: 'Program Structure' },
    { id: 'variables', title: 'Variables & Data Types' },
    { id: 'operators', title: 'Operators' },
    { id: 'userinput', title: 'User Input' },
    { id: 'conditionals', title: 'Conditionals' },
    { id: 'loops', title: 'Loops' },
    { id: 'arrays', title: 'Arrays' },
    { id: 'strings', title: 'Strings' },
    { id: 'methods', title: 'Methods' },
    { id: 'oop', title: 'OOP Basics' },
    { id: 'exceptions', title: 'Exception Handling' },
    { id: 'project', title: 'Mini Project' },
    { id: 'recap', title: 'Recap Summary' },
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
      <div className="bg-[#1e1e1e] rounded-lg border border-[#E0DCCF] my-4">
        <div className="flex justify-between items-center px-4 py-2 border-b border-[#E0DCCF]">
          <span className="text-xs text-muted-foreground">Java</span>
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
    <div className="min-h-screen bg-[#FFFDF8] text-foreground-muted font-sans antialiased">
      {/* Meta Tags for SEO */}
      <head>
        <title>Java for Beginners - Learn Java Step by Step | Complete Tutorial</title>
        <meta name="description" content="Master Java programming from scratch. Complete Java basics tutorial for beginners with zero coding experience. Learn Java step by step with practical examples." />
        <meta name="keywords" content="Java for beginners, learn Java step by step, Java basics tutorial, Java programming for beginners" />
      </head>

      {/* HEADER */}
      <header className="sticky top-0 z-[100] bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#F0ECE0] px-5">
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
          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-6 text-[#FF9500]">Topics</h3>
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
            Java for Beginners
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-4">
            Learn Java step by step with this complete beginner-friendly tutorial. Perfect for someone with zero programming experience who wants to master Java basics and start their programming journey.
          </p>
          <div className="flex gap-4 flex-wrap">
            <span className="bg-[#FF9500] text-white px-4 py-2 rounded-full text-sm font-semibold">Beginner Friendly</span>
            <span className="bg-[#06B6D4] text-white px-4 py-2 rounded-full text-sm font-semibold">Zero Experience OK</span>
            <span className="bg-[#8B5CF6] text-white px-4 py-2 rounded-full text-sm font-semibold">Practical Examples</span>
          </div>
        </div>

        {/* TABLE OF CONTENTS */}
        <div className="bg-white/5 border border-[#E0DCCF] rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
          <ol className="space-y-2 text-muted-foreground">
            <li>1. Introduction to Java</li>
            <li>2. Installing Java & Setting Up Environment</li>
            <li>3. Structure of a Java Program</li>
            <li>4. Variables and Data Types</li>
            <li>5. Operators</li>
            <li>6. User Input with Scanner</li>
            <li>7. Conditional Statements</li>
            <li>8. Loops</li>
            <li>9. Arrays</li>
            <li>10. Strings</li>
            <li>11. Methods</li>
            <li>12. Object-Oriented Programming Basics</li>
            <li>13. Exception Handling</li>
            <li>14. Mini Project: Student Grade System</li>
          </ol>
        </div>

        {/* SECTION 1: INTRODUCTION */}
        <section id="intro" className="mb-16">
          <h2 className="text-4xl font-black mb-6">1️⃣ Introduction to Java</h2>
          
          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What is Java?</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Java is a powerful programming language that lets you write instructions that computers can understand and execute. Created in 1995 by James Gosling at Sun Microsystems, Java has become one of the most widely-used programming languages in the world.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              <strong>Think of Java like a toolbox:</strong> Different tools for different jobs, but all follow the same principles. Once you learn how to use the tools, you can build almost anything!
            </p>

            <h4 className="text-xl font-bold mb-3 mt-6">Key Characteristic: "Write Once, Run Anywhere"</h4>
            <ul className="text-muted-foreground space-y-2 ml-4">
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> You write code ONCE on your computer</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> It can run on ANY computer (Windows, Mac, Linux)</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> This is because Java code runs inside a "Java Virtual Machine" (JVM)</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Why Learn Java?</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-cyan-400 mb-2">1. Highly Demanded Skill</h4>
                <p className="text-muted-foreground">One of the most requested programming languages. Companies worldwide need Java developers. Great career opportunities and salaries.</p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 mb-2">2. Beginner-Friendly</h4>
                <p className="text-muted-foreground">Simple syntax (reads almost like English). Clear error messages. Lots of learning resources available.</p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 mb-2">3. Powerful & Versatile</h4>
                <ul className="text-muted-foreground ml-4 space-y-1">
                  <li>• Build websites and web applications</li>
                  <li>• Create Android mobile apps (billions of devices!)</li>
                  <li>• Develop enterprise software for large companies</li>
                  <li>• Build games</li>
                  <li>• Create command-line tools</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 mb-2">4. Strong Community</h4>
                <p className="text-muted-foreground">Millions of developers worldwide. Lots of libraries and frameworks. Easy to find help and solutions. Free tools and resources.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Where is Java Used?</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-[#FF9500] mb-2">Banking & Finance</h4>
                <p className="text-muted-foreground text-sm">ATM systems, online banking, transaction processing</p>
              </div>

              <div>
                <h4 className="font-bold text-[#FF9500] mb-2">E-commerce</h4>
                <p className="text-muted-foreground text-sm">Amazon, eBay use Java for their systems</p>
              </div>

              <div>
                <h4 className="font-bold text-[#FF9500] mb-2">Social Media & Streaming</h4>
                <p className="text-muted-foreground text-sm">Twitter uses Java for infrastructure</p>
              </div>

              <div>
                <h4 className="font-bold text-[#FF9500] mb-2">Android Development</h4>
                <p className="text-muted-foreground text-sm">Most Android apps built with Java</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: INSTALLATION */}
        <section id="installation" className="mb-16">
          <h2 className="text-4xl font-black mb-6">2️⃣ Installing Java & Setting Up Environment</h2>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">Step 1: Download & Install JDK</h3>

            <h4 className="text-xl font-bold mb-4 text-cyan-400">For Windows:</h4>
            <ol className="text-muted-foreground space-y-2 ml-4 mb-6">
              <li>1. Go to: https://www.oracle.com/java/technologies/downloads/</li>
              <li>2. Click "Download" for Java 21 (latest)</li>
              <li>3. Select "Windows x64 Installer"</li>
              <li>4. Run the installer file</li>
              <li>5. Click "Next" and "Install"</li>
              <li>6. Installation complete! <Check size={16} className="inline text-green-400" /></li>
            </ol>

            <h4 className="text-xl font-bold mb-4 text-cyan-400">For Mac:</h4>
            <ol className="text-muted-foreground space-y-2 ml-4 mb-6">
              <li>1. Go to: https://www.oracle.com/java/technologies/downloads/</li>
              <li>2. Click "Download" for Mac version</li>
              <li>3. Run the installer</li>
              <li>4. Follow the prompts</li>
            </ol>

            <h4 className="text-xl font-bold mb-4 text-cyan-400">For Linux:</h4>
            <CodeBlock
              code={`sudo apt-get update
sudo apt-get install openjdk-21-jdk`}
              id="linux-install"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Step 2: Verify Installation</h3>
            <p className="text-muted-foreground mb-4">Open Command Prompt (Windows) or Terminal (Mac/Linux) and type:</p>
            <CodeBlock
              code={`java -version`}
              id="verify-java"
            />
            <p className="text-muted-foreground mt-4">Should show something like: <code className="bg-[#1e1e1e] px-2 py-1 rounded">openjdk version "21.0.1"</code></p>
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Step 3: Choose Your Editor</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#FF9500] mb-3">Option 1: Visual Studio Code (Recommended for Beginners)</h4>
                <ol className="text-muted-foreground space-y-1 ml-4 text-sm">
                  <li>1. Download VS Code: https://code.visualstudio.com/</li>
                  <li>2. Open VS Code</li>
                  <li>3. Install Extension: Search "Extension Pack for Java"</li>
                  <li>4. Click Install by Microsoft</li>
                  <li>5. Create new folder for Java projects</li>
                  <li>6. File → Open Folder</li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-[#FF9500] mb-3">Option 2: IntelliJ IDEA Community (Most Popular)</h4>
                <ol className="text-muted-foreground space-y-1 ml-4 text-sm">
                  <li>1. Download: https://www.jetbrains.com/idea/download/</li>
                  <li>2. Select "Community Edition" (free)</li>
                  <li>3. Install and open</li>
                  <li>4. Create new Java project</li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-[#FF9500] mb-3">Option 3: Eclipse (Completely Free)</h4>
                <ol className="text-muted-foreground space-y-1 ml-4 text-sm">
                  <li>1. Download: https://www.eclipse.org/downloads/</li>
                  <li>2. Select "Eclipse IDE for Java Developers"</li>
                  <li>3. Extract and run</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: STRUCTURE */}
        <section id="structure" className="mb-16">
          <h2 className="text-4xl font-black mb-6">3️⃣ Structure of a Java Program</h2>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">Your First "Hello World" Program</h3>

            <CodeBlock
              code={`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`}
              id="hello-world"
            />

            <h4 className="text-xl font-bold mt-8 mb-4">What Each Part Means:</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><strong className="text-cyan-400">public class HelloWorld</strong> - Creates a class named "HelloWorld" that anyone can access</li>
              <li><strong className="text-cyan-400">public static void main(String[] args)</strong> - The entry point of the program. Java starts here!</li>
              <li><strong className="text-cyan-400">System.out.println()</strong> - Prints text to the screen</li>
              <li><strong className="text-cyan-400">"Hello, World!"</strong> - The text to print</li>
              <li><strong className="text-cyan-400">;</strong> - Ends each statement (very important!)</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">How to Run the Program</h3>
            
            <p className="text-muted-foreground mb-4"><strong>Step 1: Save the file as</strong> <code className="bg-[#1e1e1e] px-2 py-1 rounded">HelloWorld.java</code></p>
            
            <p className="text-muted-foreground mb-4"><strong>Step 2: Open Terminal/Command Prompt and navigate to the folder</strong></p>
            
            <p className="text-muted-foreground mb-4"><strong>Step 3: Compile the code</strong></p>
            <CodeBlock
              code={`javac HelloWorld.java`}
              id="compile-hello"
            />

            <p className="text-muted-foreground my-4">This creates a file called <code className="bg-[#1e1e1e] px-2 py-1 rounded">HelloWorld.class</code></p>

            <p className="text-muted-foreground mb-4"><strong>Step 4: Run the program</strong></p>
            <CodeBlock
              code={`java HelloWorld`}
              id="run-hello"
            />

            <p className="text-muted-foreground mt-6 p-4 bg-[#1E293B] rounded-lg border border-cyan-400/30">
              <strong>Output:</strong> <code>Hello, World!</code>
            </p>
          </div>
        </section>

        {/* SECTION 4: VARIABLES */}
        <section id="variables" className="mb-16">
          <h2 className="text-4xl font-black mb-6">4️⃣ Variables and Data Types</h2>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What is a Variable?</h3>
            <p className="text-muted-foreground mb-4">A variable is like a box that stores information. You can put different things in the box, and later retrieve them.</p>

            <h4 className="text-xl font-bold mb-4 mt-6">Basic Data Types</h4>
            <div className="space-y-4">
              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#E0DCCF]">
                <strong className="text-[#FF9500]">int</strong> - Whole numbers (no decimals)
                <CodeBlock
                  code={`int age = 25;
int year = 2026;`}
                  id="int-example"
                />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#E0DCCF]">
                <strong className="text-[#FF9500]">double</strong> - Decimal numbers (precise)
                <CodeBlock
                  code={`double price = 99.99;
double height = 5.8;`}
                  id="double-example"
                />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#E0DCCF]">
                <strong className="text-[#FF9500]">String</strong> - Text (always in quotes)
                <CodeBlock
                  code={`String name = "Alice";
String city = "New York";`}
                  id="string-example"
                />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#E0DCCF]">
                <strong className="text-[#FF9500]">boolean</strong> - True or False only
                <CodeBlock
                  code={`boolean isStudent = true;
boolean isGraduate = false;`}
                  id="boolean-example"
                />
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#E0DCCF]">
                <strong className="text-[#FF9500]">char</strong> - Single character
                <CodeBlock
                  code={`char grade = 'A';
char firstLetter = 'J';`}
                  id="char-example"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Complete Example Program</h3>
            <CodeBlock
              code={`public class StudentInfo {
    public static void main(String[] args) {
        String studentName = "John Doe";
        int age = 19;
        double gpa = 3.75;
        boolean isActive = true;
        
        System.out.println("Student Name: " + studentName);
        System.out.println("Age: " + age);
        System.out.println("GPA: " + gpa);
        System.out.println("Active: " + isActive);
    }
}`}
              id="student-info"
            />
            <p className="text-muted-foreground mt-4 p-4 bg-[#1E293B] rounded-lg border border-cyan-400/30">
              <strong>Output:</strong><br/>
              Student Name: John Doe<br/>
              Age: 19<br/>
              GPA: 3.75<br/>
              Active: true
            </p>
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Practice Exercise</h3>
            <p className="text-muted-foreground mb-4"><strong>Create a program that stores and prints your personal information (name, age, height, graduation year)</strong></p>
            
            <details className="cursor-pointer">
              <summary className="text-[#FF9500] font-bold mb-4 hover:text-[#CC7000]">Click to see solution</summary>
              <CodeBlock
                code={`public class MyInfo {
    public static void main(String[] args) {
        String myName = "Your Name";
        int myAge = 20;
        double myHeight = 5.9;
        int graduationYear = 2026;
        
        System.out.println("Name: " + myName);
        System.out.println("Age: " + myAge);
        System.out.println("Height: " + myHeight);
        System.out.println("Graduating in: " + graduationYear);
    }
}`}
                id="practice-solution"
              />
            </details>
          </div>
        </section>

        {/* SECTION 5: OPERATORS */}
        <section id="operators" className="mb-16">
          <h2 className="text-4xl font-black mb-6">5️⃣ Operators</h2>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Arithmetic Operators</h3>
            <p className="text-muted-foreground mb-4">Used to do math calculations:</p>
            
            <CodeBlock
              code={`int a = 10;
int b = 3;

System.out.println("Addition: " + (a + b));      // Output: 13
System.out.println("Subtraction: " + (a - b));   // Output: 7
System.out.println("Multiplication: " + (a * b)); // Output: 30
System.out.println("Division: " + (a / b));       // Output: 3
System.out.println("Remainder: " + (a % b));      // Output: 1`}
              id="arithmetic-operators"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Comparison Operators</h3>
            <p className="text-muted-foreground mb-4">Used to compare values (returns true or false):</p>
            
            <CodeBlock
              code={`int x = 5;
int y = 8;

System.out.println(x == y);  // false (equal to)
System.out.println(x != y);  // true (not equal to)
System.out.println(x < y);   // true (less than)
System.out.println(x > y);   // false (greater than)
System.out.println(x <= y);  // true (less than or equal)
System.out.println(x >= y);  // false (greater than or equal)`}
              id="comparison-operators"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Logical Operators</h3>
            <p className="text-muted-foreground mb-4">Used to combine multiple conditions:</p>
            
            <CodeBlock
              code={`boolean isStudent = true;
boolean hasScholarship = false;

// && (AND) - both conditions must be true
System.out.println(isStudent && hasScholarship); // false

// || (OR) - at least one must be true
System.out.println(isStudent || hasScholarship); // true

// ! (NOT) - reverses the value
System.out.println(!isStudent); // false`}
              id="logical-operators"
            />
          </div>
        </section>

        {/* SECTION 6: USER INPUT */}
        <section id="userinput" className="mb-16">
          <h2 className="text-4xl font-black mb-6">6️⃣ User Input with Scanner</h2>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Taking Input from User</h3>
            <p className="text-muted-foreground mb-6">We use the <strong>Scanner</strong> class to read user input:</p>

            <CodeBlock
              code={`import java.util.Scanner;

public class UserInput {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        
        // Read a whole number
        System.out.print("Enter your age: ");
        int age = input.nextInt();
        
        // Read text
        System.out.print("Enter your name: ");
        String name = input.nextLine();
        
        // Read decimal number
        System.out.print("Enter your height: ");
        double height = input.nextDouble();
        
        System.out.println("\\nYour Information:");
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Height: " + height);
        
        input.close(); // Close the scanner
    }
}`}
              id="user-input"
            />

            <div className="mt-6 p-4 bg-[#1E293B] rounded-lg border border-yellow-400/30">
              <strong className="text-yellow-400">⚠️ Important:</strong> Always import Scanner at the top!
              <CodeBlock
                code={`import java.util.Scanner;`}
                id="scanner-import"
              />
            </div>
          </div>
        </section>

        {/* SECTION 7: CONDITIONALS */}
        <section id="conditionals" className="mb-16">
          <h2 className="text-4xl font-black mb-6">7️⃣ Conditional Statements</h2>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">if Statement</h3>
            <p className="text-muted-foreground mb-4">Execute code only if a condition is true:</p>
            
            <CodeBlock
              code={`int age = 18;

if (age >= 18) {
    System.out.println("You are an adult");
}`}
              id="if-statement"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">if-else Statement</h3>
            <p className="text-muted-foreground mb-4">Do one thing if true, something else if false:</p>
            
            <CodeBlock
              code={`int marks = 75;

if (marks >= 60) {
    System.out.println("You passed!");
} else {
    System.out.println("You failed. Study more!");
}`}
              id="if-else-statement"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">if-else-if Statement</h3>
            <p className="text-muted-foreground mb-4">Multiple conditions:</p>
            
            <CodeBlock
              code={`int marks = 85;
String grade;

if (marks >= 90) {
    grade = "A";
} else if (marks >= 80) {
    grade = "B";
} else if (marks >= 70) {
    grade = "C";
} else {
    grade = "F";
}

System.out.println("Your grade: " + grade); // Output: B`}
              id="if-else-if-statement"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">switch Statement</h3>
            <p className="text-muted-foreground mb-4">When you have many options:</p>
            
            <CodeBlock
              code={`int day = 3;
String dayName;

switch(day) {
    case 1:
        dayName = "Monday";
        break;
    case 2:
        dayName = "Tuesday";
        break;
    case 3:
        dayName = "Wednesday";
        break;
    default:
        dayName = "Unknown";
}

System.out.println("Day: " + dayName); // Output: Wednesday`}
              id="switch-statement"
            />
          </div>
        </section>

        {/* SECTION 8: LOOPS */}
        <section id="loops" className="mb-16">
          <h2 className="text-4xl font-black mb-6">8️⃣ Loops</h2>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">for Loop</h3>
            <p className="text-muted-foreground mb-4">Repeat code a specific number of times:</p>
            
            <CodeBlock
              code={`// Print numbers 1 to 5
for (int i = 1; i <= 5; i++) {
    System.out.println("Number: " + i);
}

/* Output:
Number: 1
Number: 2
Number: 3
Number: 4
Number: 5
*/`}
              id="for-loop"
            />

            <p className="text-muted-foreground mt-6 bg-[#1E293B] p-4 rounded-lg border border-[#E0DCCF]">
              <strong>How it works:</strong><br/>
              <code>i = 1</code> - Start at 1<br/>
              <code>i &lt;= 5</code> - Continue while i is 5 or less<br/>
              <code>i++</code> - Add 1 to i each time
            </p>
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">while Loop</h3>
            <p className="text-muted-foreground mb-4">Repeat while a condition is true:</p>
            
            <CodeBlock
              code={`int i = 1;
while (i <= 3) {
    System.out.println("Count: " + i);
    i++;  // Don't forget to increase i!
}

/* Output:
Count: 1
Count: 2
Count: 3
*/`}
              id="while-loop"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">do-while Loop</h3>
            <p className="text-muted-foreground mb-4">Runs at least once, then checks the condition:</p>
            
            <CodeBlock
              code={`int i = 1;
do {
    System.out.println("Value: " + i);
    i++;
} while (i <= 3);

/* Output:
Value: 1
Value: 2
Value: 3
*/`}
              id="do-while-loop"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">break and continue</h3>
            
            <p className="text-muted-foreground mb-4"><strong className="text-cyan-400">break</strong> - Exit the loop immediately</p>
            <CodeBlock
              code={`for (int i = 1; i <= 10; i++) {
    if (i == 5) {
        break; // Exit loop when i reaches 5
    }
    System.out.println(i);
}

/* Output: 1 2 3 4 */`}
              id="break-example"
            />

            <p className="text-muted-foreground mb-4 mt-6"><strong className="text-cyan-400">continue</strong> - Skip to next iteration</p>
            <CodeBlock
              code={`for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        continue; // Skip when i is 3
    }
    System.out.println(i);
}

/* Output: 1 2 4 5 */`}
              id="continue-example"
            />
          </div>
        </section>

        {/* SECTION 9: ARRAYS */}
        <section id="arrays" className="mb-16">
          <h2 className="text-4xl font-black mb-6">9️⃣ Arrays</h2>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What is an Array?</h3>
            <p className="text-muted-foreground mb-4">An array is like a collection of boxes of the same type, arranged in a line. Each box has a number (index) starting from 0.</p>

            <h4 className="text-xl font-bold mb-4 mt-6">Creating Arrays</h4>
            <CodeBlock
              code={`// Array of 5 integers
int[] numbers = {10, 20, 30, 40, 50};

// Array of strings
String[] names = {"Alice", "Bob", "Charlie"};

// Empty array with size 3 (all values are 0)
int[] scores = new int[3];`}
              id="array-creation"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Accessing Array Elements</h3>
            <p className="text-muted-foreground mb-4">Remember: First element is at index 0!</p>
            
            <CodeBlock
              code={`String[] fruits = {"Apple", "Banana", "Orange"};

System.out.println(fruits[0]); // Apple (first)
System.out.println(fruits[1]); // Banana (second)
System.out.println(fruits[2]); // Orange (third)

// Change an element
fruits[1] = "Mango";  // Now index 1 is "Mango"`}
              id="array-access"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Looping Through Arrays</h3>
            
            <CodeBlock
              code={`int[] ages = {18, 19, 20, 21};

// Method 1: Using for loop
for (int i = 0; i < ages.length; i++) {
    System.out.println("Age: " + ages[i]);
}

// Method 2: Enhanced for loop (easier)
for (int age : ages) {
    System.out.println("Age: " + age);
}`}
              id="array-loop"
            />
          </div>
        </section>

        {/* SECTION 10: STRINGS */}
        <section id="strings" className="mb-16">
          <h2 className="text-4xl font-black mb-6">Strings</h2>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Common String Methods</h3>
            
            <CodeBlock
              code={`String text = "Hello World";

// Get length
System.out.println(text.length()); // 11

// Convert to uppercase
System.out.println(text.toUpperCase()); // HELLO WORLD

// Convert to lowercase
System.out.println(text.toLowerCase()); // hello world

// Check if contains substring
System.out.println(text.contains("World")); // true

// Get character at position
System.out.println(text.charAt(0)); // H

// Replace text
System.out.println(text.replace("World", "Java")); // Hello Java`}
              id="string-methods"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">String Comparison</h3>
            
            <CodeBlock
              code={`String name1 = "Alice";
String name2 = "Alice";
String name3 = "Bob";

// Using equals() - recommended
System.out.println(name1.equals(name2));  // true
System.out.println(name1.equals(name3));  // false

// Using == (NOT for strings!)
System.out.println(name1 == name2);  // might be false!

// Using equalsIgnoreCase() - ignores upper/lower
System.out.println(name1.equalsIgnoreCase("ALICE")); // true`}
              id="string-comparison"
            />
          </div>
        </section>

        {/* SECTION 11: METHODS */}
        <section id="methods" className="mb-16">
          <h2 className="text-4xl font-black mb-6">1️⃣1️⃣ Methods</h2>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What is a Method?</h3>
            <p className="text-muted-foreground mb-4">A method is a reusable block of code that performs a specific task. It's like a recipe that you can use again and again.</p>

            <CodeBlock
              code={`// Simple method
public static void greet() {
    System.out.println("Hello!");
}

// Calling the method
greet();  // Output: Hello!`}
              id="simple-method"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Methods with Parameters</h3>
            <p className="text-muted-foreground mb-4">Pass information to the method:</p>
            
            <CodeBlock
              code={`// Method with parameter
public static void greet(String name) {
    System.out.println("Hello, " + name);
}

// Calling the method
greet("Alice");  // Output: Hello, Alice
greet("Bob");    // Output: Hello, Bob`}
              id="method-params"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Methods with Return Values</h3>
            <p className="text-muted-foreground mb-4">Get a result back from the method:</p>
            
            <CodeBlock
              code={`// Method that returns a value
public static int add(int a, int b) {
    int sum = a + b;
    return sum;  // Send back the result
}

// Calling and using the result
int result = add(5, 3);
System.out.println("Sum: " + result);  // Output: Sum: 8`}
              id="method-return"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Complete Example</h3>
            
            <CodeBlock
              code={`public class Calculator {
    
    // Add two numbers
    public static int add(int a, int b) {
        return a + b;
    }
    
    // Multiply two numbers
    public static int multiply(int a, int b) {
        return a * b;
    }
    
    // Main method
    public static void main(String[] args) {
        System.out.println("5 + 3 = " + add(5, 3));        // 8
        System.out.println("5 * 3 = " + multiply(5, 3));   // 15
    }
}`}
              id="calculator-example"
            />
          </div>
        </section>

        {/* SECTION 12: OOP BASICS */}
        <section id="oop" className="mb-16">
          <h2 className="text-4xl font-black mb-6">1️⃣2️⃣ OOP Basics - Classes and Objects</h2>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">What is OOP?</h3>
            <p className="text-muted-foreground mb-4">Object-Oriented Programming is a way to organize code by creating "objects" that represent real-world things.</p>

            <h4 className="text-xl font-bold mb-4 mt-6">Class and Object</h4>
            <p className="text-muted-foreground mb-4"><strong>Class</strong> = Blueprint (like a template for a house)</p>
            <p className="text-muted-foreground mb-4"><strong>Object</strong> = Real thing created from the blueprint (like an actual house)</p>
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Creating a Class</h3>
            
            <CodeBlock
              code={`// Blueprint: Student class
public class Student {
    // Properties
    String name;
    int age;
    double gpa;
    
    // Method
    public void study() {
        System.out.println(name + " is studying");
    }
}

// Creating objects (instances)
Student student1 = new Student();
student1.name = "Alice";
student1.age = 19;
student1.gpa = 3.8;

Student student2 = new Student();
student2.name = "Bob";
student2.age = 20;
student2.gpa = 3.5;

// Using the method
student1.study();  // Output: Alice is studying`}
              id="class-example"
            />
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Constructor - Set Initial Values</h3>
            <p className="text-muted-foreground mb-4">A constructor runs automatically when you create an object:</p>
            
            <CodeBlock
              code={`public class Student {
    String name;
    int age;
    
    // Constructor
    public Student(String n, int a) {
        name = n;
        age = a;
    }
    
    public void display() {
        System.out.println("Name: " + name + ", Age: " + age);
    }
}

// Creating object with constructor
Student student = new Student("Charlie", 21);
student.display();  // Output: Name: Charlie, Age: 21`}
              id="constructor-example"
            />
          </div>
        </section>

        {/* SECTION 13: EXCEPTION HANDLING */}
        <section id="exceptions" className="mb-16">
          <h2 className="text-4xl font-black mb-6">1️⃣3️⃣ Exception Handling</h2>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">What is an Exception?</h3>
            <p className="text-muted-foreground mb-4">An error that happens while the program is running. Exception handling prevents the program from crashing.</p>

            <h4 className="text-xl font-bold mb-4 mt-6">try-catch Block</h4>
            <CodeBlock
              code={`try {
    // Code that might cause an error
    int[] numbers = {1, 2, 3};
    System.out.println(numbers[10]);  // Out of bounds!
} catch (Exception e) {
    // What to do if error happens
    System.out.println("Error: Array index out of bounds!");
    System.out.println("Error details: " + e.getMessage());
}`}
              id="try-catch"
            />

            <h4 className="text-xl font-bold mb-4 mt-6">Real Example: Dividing by Zero</h4>
            <CodeBlock
              code={`import java.util.Scanner;

public class SafeDivision {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        
        try {
            System.out.print("Enter first number: ");
            int a = input.nextInt();
            
            System.out.print("Enter second number: ");
            int b = input.nextInt();
            
            int result = a / b;
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Error: Cannot divide by zero!");
        } catch (Exception e) {
            System.out.println("Error: Invalid input!");
        }
    }
}`}
              id="safe-division"
            />
          </div>
        </section>

        {/* SECTION 14: MINI PROJECT */}
        <section id="project" className="mb-16">
          <h2 className="text-4xl font-black mb-6">1️⃣4️⃣ Mini Project: Student Grade System</h2>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Project Description</h3>
            <p className="text-muted-foreground mb-4">Create a program that:</p>
            <ul className="text-muted-foreground space-y-2 ml-4">
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Takes student information (name, 3 test scores)</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Calculates the average</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Assigns a letter grade (A, B, C, etc.)</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400 flex-shrink-0" /> Displays the result</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Complete Solution</h3>
            
            <CodeBlock
              code={`import java.util.Scanner;

public class StudentGradeSystem {
    
    // Method to calculate average
    public static double calculateAverage(double score1, double score2, double score3) {
        return (score1 + score2 + score3) / 3;
    }
    
    // Method to get letter grade
    public static String getGrade(double average) {
        if (average >= 90) {
            return "A";
        } else if (average >= 80) {
            return "B";
        } else if (average >= 70) {
            return "C";
        } else if (average >= 60) {
            return "D";
        } else {
            return "F";
        }
    }
    
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        
        try {
            // Input student name
            System.out.print("Enter student name: ");
            String name = input.nextLine();
            
            // Input three test scores
            System.out.print("Enter test 1 score: ");
            double score1 = input.nextDouble();
            
            System.out.print("Enter test 2 score: ");
            double score2 = input.nextDouble();
            
            System.out.print("Enter test 3 score: ");
            double score3 = input.nextDouble();
            
            // Calculate average
            double average = calculateAverage(score1, score2, score3);
            
            // Get grade
            String grade = getGrade(average);
            
            // Display results
            System.out.println("\\n--- RESULT ---");
            System.out.println("Student Name: " + name);
            System.out.println("Test 1: " + score1);
            System.out.println("Test 2: " + score2);
            System.out.println("Test 3: " + score3);
            System.out.println("Average: " + String.format("%.2f", average));
            System.out.println("Grade: " + grade);
            
        } catch (Exception e) {
            System.out.println("Error: Invalid input!");
        } finally {
            input.close();
        }
    }
}`}
              id="mini-project"
            />
          </div>
        </section>

        {/* RECAP SECTION */}
        <section id="recap" className="mb-16">
          <h2 className="text-4xl font-black mb-6">Quick Recap Summary</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
              <h4 className="font-bold text-[#FF9500] mb-3">Fundamentals</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>✓ Java is "write once, run anywhere"</li>
                <li>✓ Every program starts with main method</li>
                <li>✓ Statements end with semicolon (;)</li>
                <li>✓ Variables store different data types</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
              <h4 className="font-bold text-[#FF9500] mb-3">Control Flow</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>✓ if/else for decisions</li>
                <li>✓ for/while for repetition</li>
                <li>✓ break to exit loops</li>
                <li>✓ try-catch for errors</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
              <h4 className="font-bold text-[#FF9500] mb-3">Data Structures</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>✓ Arrays store multiple values</li>
                <li>✓ Strings are text data</li>
                <li>✓ Objects combine data + methods</li>
                <li>✓ Classes are blueprints for objects</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
              <h4 className="font-bold text-[#FF9500] mb-3">Organization</h4>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>✓ Methods organize code into tasks</li>
                <li>✓ Parameters pass data to methods</li>
                <li>✓ Return values send results back</li>
                <li>✓ OOP structures code logically</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PRACTICE QUESTIONS */}
        <section id="practice" className="mb-16">
          <h2 className="text-4xl font-black mb-6">Practice Questions</h2>

          <div className="space-y-6">
            <details className="group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                1. What are the main differences between int and double?
              </summary>
              <p className="text-muted-foreground text-sm">
                <strong>int</strong> stores whole numbers without decimals (e.g., 5, -10, 100).<br/>
                <strong>double</strong> stores decimal numbers with more precision (e.g., 5.5, 3.14159).<br/>
                Use int for counting, double for measurements or calculations that need decimals.
              </p>
            </details>

            <details className="group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                2. What does System.out.println() do?
              </summary>
              <p className="text-muted-foreground text-sm">
                <strong>System.out.println()</strong> prints text to the console/screen and adds a new line after it.<br/>
                <code className="bg-[#1e1e1e] px-2 py-1 rounded">System.out.print()</code> prints without adding a new line.
              </p>
            </details>

            <details className="group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                3. Explain the difference between for and while loops
              </summary>
              <p className="text-muted-foreground text-sm">
                <strong>for loop:</strong> Use when you know exactly how many times to repeat (e.g., 1 to 10).<br/>
                <strong>while loop:</strong> Use when you repeat until a condition becomes false (e.g., until user enters "quit").
              </p>
            </details>

            <details className="group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                4. What is the purpose of a constructor?
              </summary>
              <p className="text-muted-foreground text-sm">
                A constructor initializes an object with starting values when it's created.<br/>
                It has the same name as the class and runs automatically with `new` keyword.<br/>
                Example: When you create `new Student("Alice")`, the constructor sets the name to "Alice".
              </p>
            </details>

            <details className="group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6">
              <summary className="font-bold text-[#FF9500] mb-4 group-open:mb-4">
                5. Why do we need exception handling?
              </summary>
              <p className="text-muted-foreground text-sm">
                Exception handling allows your program to handle errors gracefully without crashing.<br/>
                Using try-catch, you can catch errors and provide helpful messages or alternative actions.<br/>
                This makes your program more robust and user-friendly.
              </p>
            </details>
          </div>
        </section>

        {/* NEXT STEPS */}
        <section id="nextsteps" className="mb-16">
          <h2 className="text-4xl font-black mb-6">Next Learning Steps</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#FF9500] to-[#E88600] rounded-xl p-6 border border-[#FFB347]/40">
              <h4 className="font-bold mb-3 text-lg">Intermediate Java</h4>
              <ul className="text-sm space-y-2">
                <li>✓ Inheritance & Polymorphism</li>
                <li>✓ Abstract Classes & Interfaces</li>
                <li>✓ Encapsulation Best Practices</li>
                <li>✓ Static vs Instance Methods</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl p-6 border border-cyan-400/30">
              <h4 className="font-bold mb-3 text-lg">Collections & Data</h4>
              <ul className="text-sm space-y-2">
                <li>✓ ArrayList & HashMap</li>
                <li>✓ Collections Framework</li>
                <li>✓ Sorting & Searching</li>
                <li>✓ Working with Generics</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 border border-purple-400/30">
              <h4 className="font-bold mb-3 text-lg">Database & Backend</h4>
              <ul className="text-sm space-y-2">
                <li>✓ JDBC - Connect to Databases</li>
                <li>✓ SQL Basics</li>
                <li>✓ File I/O Operations</li>
                <li>✓ JSON Parsing</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 border border-green-400/30">
              <h4 className="font-bold mb-3 text-lg">Web Frameworks</h4>
              <ul className="text-sm space-y-2">
                <li>✓ Spring Boot Framework</li>
                <li>✓ REST APIs</li>
                <li>✓ Web Development</li>
                <li>✓ Authentication & Security</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] rounded-2xl p-12 text-center border border-[#E0DCCF]">
            <h2 className="text-3xl font-black mb-4">Ready to Master Java?</h2>
            <p className="text-lg mb-8 text-white/90">Join thousands of students learning Java with our interactive courses and 1:1 mentorship.</p>
            <button className="bg-white text-[#4F46E5] px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all text-lg">
              Start Your Java Journey Today
            </button>
          </div>
        </section>
      </main>
      </div>

      <footer className="py-10 text-center text-muted-foreground text-sm border-t border-[#F0ECE0] mt-16">
        © 2026 MentorMuni. Learn Java for Beginners - Free Tutorial with Practical Examples.
      </footer>
    </div>
  );
};

export default JavaTutorial;
