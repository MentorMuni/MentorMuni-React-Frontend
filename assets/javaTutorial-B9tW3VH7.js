import{j as e}from"./index-CoYNtXpj.js";import{r as i}from"./vendor-1Xl1G8Az.js";import{l as b}from"./logo-BorjR2R0.js";import{X as u,c as p,k as r,y as j}from"./icons-UixAEz13.js";const S=()=>{const[o,m]=i.useState(!1),[x,d]=i.useState("intro"),l=[{id:"intro",title:"Introduction to Java"},{id:"installation",title:"Installation & Setup"},{id:"structure",title:"Program Structure"},{id:"variables",title:"Variables & Data Types"},{id:"operators",title:"Operators"},{id:"userinput",title:"User Input"},{id:"conditionals",title:"Conditionals"},{id:"loops",title:"Loops"},{id:"arrays",title:"Arrays"},{id:"strings",title:"Strings"},{id:"methods",title:"Methods"},{id:"oop",title:"OOP Basics"},{id:"exceptions",title:"Exception Handling"},{id:"project",title:"Mini Project"},{id:"recap",title:"Recap Summary"},{id:"practice",title:"Practice Questions"},{id:"nextsteps",title:"Next Steps"}];i.useEffect(()=>{const s=()=>{for(let a of l){const n=document.getElementById(a.id);if(n){const c=n.getBoundingClientRect();if(c.top<=150&&c.bottom>=150){d(a.id);break}}}};return window.addEventListener("scroll",s),()=>window.removeEventListener("scroll",s)},[l]);const h=s=>{const a=document.getElementById(s);a&&(a.scrollIntoView({behavior:"smooth",block:"start"}),d(s))},t=({code:s,id:a})=>{const n=()=>{navigator.clipboard.writeText(s),alert("Code copied to clipboard!")};return e.jsxs("div",{className:"bg-[#1e1e1e] rounded-lg border border-[#E0DCCF] my-4",children:[e.jsxs("div",{className:"flex justify-between items-center px-4 py-2 border-b border-[#E0DCCF]",children:[e.jsx("span",{className:"text-xs text-[#666666]",children:"Java"}),e.jsxs("button",{onClick:n,className:"flex items-center gap-2 px-3 py-1 bg-[#FF9500] hover:bg-[#FF9500]/80 rounded text-white text-xs transition-all",children:[e.jsx(j,{size:14})," Copy"]})]}),e.jsx("pre",{className:"p-4 overflow-x-auto text-sm text-[#e0e0e0]",children:e.jsx("code",{children:s})})]})};return e.jsxs("div",{className:"min-h-screen bg-[#FFFDF8] text-[#444444] font-sans antialiased",children:[e.jsxs("head",{children:[e.jsx("title",{children:"Java for Beginners - Learn Java Step by Step | Complete Tutorial"}),e.jsx("meta",{name:"description",content:"Master Java programming from scratch. Complete Java basics tutorial for beginners with zero coding experience. Learn Java step by step with practical examples."}),e.jsx("meta",{name:"keywords",content:"Java for beginners, learn Java step by step, Java basics tutorial, Java programming for beginners"})]}),e.jsx("header",{className:"sticky top-0 z-[100] bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#F0ECE0] px-5",children:e.jsxs("div",{className:"max-w-[1200px] mx-auto flex items-center justify-between py-4",children:[e.jsx("a",{href:"/",className:"transition-transform hover:scale-[1.02]",children:e.jsx("img",{src:b,alt:"MentorMuni",className:"h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full object-contain"})}),e.jsx("nav",{className:"hidden md:flex items-center gap-8",children:e.jsx("a",{href:"/free-tutorials",className:"text-sm font-semibold text-[#666666] hover:text-white transition-colors flex items-center gap-2",children:"← Back to Free Tutorials"})}),e.jsx("button",{onClick:()=>m(!o),className:"md:hidden text-white",children:o?e.jsx(u,{size:28}):e.jsx(p,{size:28})})]})}),e.jsxs("div",{className:"flex gap-8 max-w-[1400px] mx-auto px-6 py-16",children:[e.jsx("aside",{className:"hidden lg:block w-64 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto",children:e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-6",children:[e.jsx("h3",{className:"text-lg font-bold mb-6 text-[#FF9500]",children:"Topics"}),e.jsx("nav",{className:"space-y-2",children:l.map(s=>e.jsx("button",{onClick:()=>h(s.id),className:`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-semibold ${x===s.id?"bg-[#FF9500] text-white":"text-[#666666] hover:text-white hover:bg-white/5"}`,children:s.title},s.id))})]})}),e.jsxs("main",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"mb-16",children:[e.jsx("h1",{className:"text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent",children:"Java for Beginners"}),e.jsx("p",{className:"text-xl text-[#666666] leading-relaxed mb-4",children:"Learn Java step by step with this complete beginner-friendly tutorial. Perfect for someone with zero programming experience who wants to master Java basics and start their programming journey."}),e.jsxs("div",{className:"flex gap-4 flex-wrap",children:[e.jsx("span",{className:"bg-[#FF9500] text-white px-4 py-2 rounded-full text-sm font-semibold",children:"Beginner Friendly"}),e.jsx("span",{className:"bg-[#06B6D4] text-white px-4 py-2 rounded-full text-sm font-semibold",children:"Zero Experience OK"}),e.jsx("span",{className:"bg-[#8B5CF6] text-white px-4 py-2 rounded-full text-sm font-semibold",children:"Practical Examples"})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-2xl p-8 mb-16",children:[e.jsx("h2",{className:"text-2xl font-bold mb-6",children:"What You'll Learn"}),e.jsxs("ol",{className:"space-y-2 text-[#666666]",children:[e.jsx("li",{children:"1. Introduction to Java"}),e.jsx("li",{children:"2. Installing Java & Setting Up Environment"}),e.jsx("li",{children:"3. Structure of a Java Program"}),e.jsx("li",{children:"4. Variables and Data Types"}),e.jsx("li",{children:"5. Operators"}),e.jsx("li",{children:"6. User Input with Scanner"}),e.jsx("li",{children:"7. Conditional Statements"}),e.jsx("li",{children:"8. Loops"}),e.jsx("li",{children:"9. Arrays"}),e.jsx("li",{children:"10. Strings"}),e.jsx("li",{children:"11. Methods"}),e.jsx("li",{children:"12. Object-Oriented Programming Basics"}),e.jsx("li",{children:"13. Exception Handling"}),e.jsx("li",{children:"14. Mini Project: Student Grade System"})]})]}),e.jsxs("section",{id:"intro",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"1️⃣ Introduction to Java"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"What is Java?"}),e.jsx("p",{className:"text-[#666666] mb-4 leading-relaxed",children:"Java is a powerful programming language that lets you write instructions that computers can understand and execute. Created in 1995 by James Gosling at Sun Microsystems, Java has become one of the most widely-used programming languages in the world."}),e.jsxs("p",{className:"text-[#666666] mb-4 leading-relaxed",children:[e.jsx("strong",{children:"Think of Java like a toolbox:"})," Different tools for different jobs, but all follow the same principles. Once you learn how to use the tools, you can build almost anything!"]}),e.jsx("h4",{className:"text-xl font-bold mb-3 mt-6",children:'Key Characteristic: "Write Once, Run Anywhere"'}),e.jsxs("ul",{className:"text-[#666666] space-y-2 ml-4",children:[e.jsxs("li",{className:"flex items-center gap-2",children:[e.jsx(r,{size:16,className:"text-green-400 flex-shrink-0"})," You write code ONCE on your computer"]}),e.jsxs("li",{className:"flex items-center gap-2",children:[e.jsx(r,{size:16,className:"text-green-400 flex-shrink-0"})," It can run on ANY computer (Windows, Mac, Linux)"]}),e.jsxs("li",{className:"flex items-center gap-2",children:[e.jsx(r,{size:16,className:"text-green-400 flex-shrink-0"}),' This is because Java code runs inside a "Java Virtual Machine" (JVM)']})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Why Learn Java?"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"1. Highly Demanded Skill"}),e.jsx("p",{className:"text-[#666666]",children:"One of the most requested programming languages. Companies worldwide need Java developers. Great career opportunities and salaries."})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"2. Beginner-Friendly"}),e.jsx("p",{className:"text-[#666666]",children:"Simple syntax (reads almost like English). Clear error messages. Lots of learning resources available."})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"3. Powerful & Versatile"}),e.jsxs("ul",{className:"text-[#666666] ml-4 space-y-1",children:[e.jsx("li",{children:"• Build websites and web applications"}),e.jsx("li",{children:"• Create Android mobile apps (billions of devices!)"}),e.jsx("li",{children:"• Develop enterprise software for large companies"}),e.jsx("li",{children:"• Build games"}),e.jsx("li",{children:"• Create command-line tools"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-cyan-400 mb-2",children:"4. Strong Community"}),e.jsx("p",{className:"text-[#666666]",children:"Millions of developers worldwide. Lots of libraries and frameworks. Easy to find help and solutions. Free tools and resources."})]})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Where is Java Used?"}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-[#FF9500] mb-2",children:"Banking & Finance"}),e.jsx("p",{className:"text-[#666666] text-sm",children:"ATM systems, online banking, transaction processing"})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-[#FF9500] mb-2",children:"E-commerce"}),e.jsx("p",{className:"text-[#666666] text-sm",children:"Amazon, eBay use Java for their systems"})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-[#FF9500] mb-2",children:"Social Media & Streaming"}),e.jsx("p",{className:"text-[#666666] text-sm",children:"Twitter uses Java for infrastructure"})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-[#FF9500] mb-2",children:"Android Development"}),e.jsx("p",{className:"text-[#666666] text-sm",children:"Most Android apps built with Java"})]})]})]})]}),e.jsxs("section",{id:"installation",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"2️⃣ Installing Java & Setting Up Environment"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-6",children:"Step 1: Download & Install JDK"}),e.jsx("h4",{className:"text-xl font-bold mb-4 text-cyan-400",children:"For Windows:"}),e.jsxs("ol",{className:"text-[#666666] space-y-2 ml-4 mb-6",children:[e.jsx("li",{children:"1. Go to: https://www.oracle.com/java/technologies/downloads/"}),e.jsx("li",{children:'2. Click "Download" for Java 21 (latest)'}),e.jsx("li",{children:'3. Select "Windows x64 Installer"'}),e.jsx("li",{children:"4. Run the installer file"}),e.jsx("li",{children:'5. Click "Next" and "Install"'}),e.jsxs("li",{children:["6. Installation complete! ",e.jsx(r,{size:16,className:"inline text-green-400"})]})]}),e.jsx("h4",{className:"text-xl font-bold mb-4 text-cyan-400",children:"For Mac:"}),e.jsxs("ol",{className:"text-[#666666] space-y-2 ml-4 mb-6",children:[e.jsx("li",{children:"1. Go to: https://www.oracle.com/java/technologies/downloads/"}),e.jsx("li",{children:'2. Click "Download" for Mac version'}),e.jsx("li",{children:"3. Run the installer"}),e.jsx("li",{children:"4. Follow the prompts"})]}),e.jsx("h4",{className:"text-xl font-bold mb-4 text-cyan-400",children:"For Linux:"}),e.jsx(t,{code:`sudo apt-get update
sudo apt-get install openjdk-21-jdk`,id:"linux-install"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Step 2: Verify Installation"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Open Command Prompt (Windows) or Terminal (Mac/Linux) and type:"}),e.jsx(t,{code:"java -version",id:"verify-java"}),e.jsxs("p",{className:"text-[#666666] mt-4",children:["Should show something like: ",e.jsx("code",{className:"bg-[#1e1e1e] px-2 py-1 rounded",children:'openjdk version "21.0.1"'})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Step 3: Choose Your Editor"}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-[#FF9500] mb-3",children:"Option 1: Visual Studio Code (Recommended for Beginners)"}),e.jsxs("ol",{className:"text-[#666666] space-y-1 ml-4 text-sm",children:[e.jsx("li",{children:"1. Download VS Code: https://code.visualstudio.com/"}),e.jsx("li",{children:"2. Open VS Code"}),e.jsx("li",{children:'3. Install Extension: Search "Extension Pack for Java"'}),e.jsx("li",{children:"4. Click Install by Microsoft"}),e.jsx("li",{children:"5. Create new folder for Java projects"}),e.jsx("li",{children:"6. File → Open Folder"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-[#FF9500] mb-3",children:"Option 2: IntelliJ IDEA Community (Most Popular)"}),e.jsxs("ol",{className:"text-[#666666] space-y-1 ml-4 text-sm",children:[e.jsx("li",{children:"1. Download: https://www.jetbrains.com/idea/download/"}),e.jsx("li",{children:'2. Select "Community Edition" (free)'}),e.jsx("li",{children:"3. Install and open"}),e.jsx("li",{children:"4. Create new Java project"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-[#FF9500] mb-3",children:"Option 3: Eclipse (Completely Free)"}),e.jsxs("ol",{className:"text-[#666666] space-y-1 ml-4 text-sm",children:[e.jsx("li",{children:"1. Download: https://www.eclipse.org/downloads/"}),e.jsx("li",{children:'2. Select "Eclipse IDE for Java Developers"'}),e.jsx("li",{children:"3. Extract and run"})]})]})]})]})]}),e.jsxs("section",{id:"structure",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"3️⃣ Structure of a Java Program"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-6",children:'Your First "Hello World" Program'}),e.jsx(t,{code:`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,id:"hello-world"}),e.jsx("h4",{className:"text-xl font-bold mt-8 mb-4",children:"What Each Part Means:"}),e.jsxs("ul",{className:"space-y-3 text-[#666666]",children:[e.jsxs("li",{children:[e.jsx("strong",{className:"text-cyan-400",children:"public class HelloWorld"}),' - Creates a class named "HelloWorld" that anyone can access']}),e.jsxs("li",{children:[e.jsx("strong",{className:"text-cyan-400",children:"public static void main(String[] args)"})," - The entry point of the program. Java starts here!"]}),e.jsxs("li",{children:[e.jsx("strong",{className:"text-cyan-400",children:"System.out.println()"})," - Prints text to the screen"]}),e.jsxs("li",{children:[e.jsx("strong",{className:"text-cyan-400",children:'"Hello, World!"'})," - The text to print"]}),e.jsxs("li",{children:[e.jsx("strong",{className:"text-cyan-400",children:";"})," - Ends each statement (very important!)"]})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"How to Run the Program"}),e.jsxs("p",{className:"text-[#666666] mb-4",children:[e.jsx("strong",{children:"Step 1: Save the file as"})," ",e.jsx("code",{className:"bg-[#1e1e1e] px-2 py-1 rounded",children:"HelloWorld.java"})]}),e.jsx("p",{className:"text-[#666666] mb-4",children:e.jsx("strong",{children:"Step 2: Open Terminal/Command Prompt and navigate to the folder"})}),e.jsx("p",{className:"text-[#666666] mb-4",children:e.jsx("strong",{children:"Step 3: Compile the code"})}),e.jsx(t,{code:"javac HelloWorld.java",id:"compile-hello"}),e.jsxs("p",{className:"text-[#666666] my-4",children:["This creates a file called ",e.jsx("code",{className:"bg-[#1e1e1e] px-2 py-1 rounded",children:"HelloWorld.class"})]}),e.jsx("p",{className:"text-[#666666] mb-4",children:e.jsx("strong",{children:"Step 4: Run the program"})}),e.jsx(t,{code:"java HelloWorld",id:"run-hello"}),e.jsxs("p",{className:"text-[#666666] mt-6 p-4 bg-[#1E293B] rounded-lg border border-cyan-400/30",children:[e.jsx("strong",{children:"Output:"})," ",e.jsx("code",{children:"Hello, World!"})]})]})]}),e.jsxs("section",{id:"variables",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"4️⃣ Variables and Data Types"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"What is a Variable?"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"A variable is like a box that stores information. You can put different things in the box, and later retrieve them."}),e.jsx("h4",{className:"text-xl font-bold mb-4 mt-6",children:"Basic Data Types"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"bg-[#1e1e1e] p-4 rounded-lg border border-[#E0DCCF]",children:[e.jsx("strong",{className:"text-[#FF9500]",children:"int"})," - Whole numbers (no decimals)",e.jsx(t,{code:`int age = 25;
int year = 2026;`,id:"int-example"})]}),e.jsxs("div",{className:"bg-[#1e1e1e] p-4 rounded-lg border border-[#E0DCCF]",children:[e.jsx("strong",{className:"text-[#FF9500]",children:"double"})," - Decimal numbers (precise)",e.jsx(t,{code:`double price = 99.99;
double height = 5.8;`,id:"double-example"})]}),e.jsxs("div",{className:"bg-[#1e1e1e] p-4 rounded-lg border border-[#E0DCCF]",children:[e.jsx("strong",{className:"text-[#FF9500]",children:"String"})," - Text (always in quotes)",e.jsx(t,{code:`String name = "Alice";
String city = "New York";`,id:"string-example"})]}),e.jsxs("div",{className:"bg-[#1e1e1e] p-4 rounded-lg border border-[#E0DCCF]",children:[e.jsx("strong",{className:"text-[#FF9500]",children:"boolean"})," - True or False only",e.jsx(t,{code:`boolean isStudent = true;
boolean isGraduate = false;`,id:"boolean-example"})]}),e.jsxs("div",{className:"bg-[#1e1e1e] p-4 rounded-lg border border-[#E0DCCF]",children:[e.jsx("strong",{className:"text-[#FF9500]",children:"char"})," - Single character",e.jsx(t,{code:`char grade = 'A';
char firstLetter = 'J';`,id:"char-example"})]})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Complete Example Program"}),e.jsx(t,{code:`public class StudentInfo {
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
}`,id:"student-info"}),e.jsxs("p",{className:"text-[#666666] mt-4 p-4 bg-[#1E293B] rounded-lg border border-cyan-400/30",children:[e.jsx("strong",{children:"Output:"}),e.jsx("br",{}),"Student Name: John Doe",e.jsx("br",{}),"Age: 19",e.jsx("br",{}),"GPA: 3.75",e.jsx("br",{}),"Active: true"]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Practice Exercise"}),e.jsx("p",{className:"text-[#666666] mb-4",children:e.jsx("strong",{children:"Create a program that stores and prints your personal information (name, age, height, graduation year)"})}),e.jsxs("details",{className:"cursor-pointer",children:[e.jsx("summary",{className:"text-[#FF9500] font-bold mb-4 hover:text-[#CC7000]",children:"Click to see solution"}),e.jsx(t,{code:`public class MyInfo {
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
}`,id:"practice-solution"})]})]})]}),e.jsxs("section",{id:"operators",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"5️⃣ Operators"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Arithmetic Operators"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Used to do math calculations:"}),e.jsx(t,{code:`int a = 10;
int b = 3;

System.out.println("Addition: " + (a + b));      // Output: 13
System.out.println("Subtraction: " + (a - b));   // Output: 7
System.out.println("Multiplication: " + (a * b)); // Output: 30
System.out.println("Division: " + (a / b));       // Output: 3
System.out.println("Remainder: " + (a % b));      // Output: 1`,id:"arithmetic-operators"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Comparison Operators"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Used to compare values (returns true or false):"}),e.jsx(t,{code:`int x = 5;
int y = 8;

System.out.println(x == y);  // false (equal to)
System.out.println(x != y);  // true (not equal to)
System.out.println(x < y);   // true (less than)
System.out.println(x > y);   // false (greater than)
System.out.println(x <= y);  // true (less than or equal)
System.out.println(x >= y);  // false (greater than or equal)`,id:"comparison-operators"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Logical Operators"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Used to combine multiple conditions:"}),e.jsx(t,{code:`boolean isStudent = true;
boolean hasScholarship = false;

// && (AND) - both conditions must be true
System.out.println(isStudent && hasScholarship); // false

// || (OR) - at least one must be true
System.out.println(isStudent || hasScholarship); // true

// ! (NOT) - reverses the value
System.out.println(!isStudent); // false`,id:"logical-operators"})]})]}),e.jsxs("section",{id:"userinput",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"6️⃣ User Input with Scanner"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Taking Input from User"}),e.jsxs("p",{className:"text-[#666666] mb-6",children:["We use the ",e.jsx("strong",{children:"Scanner"})," class to read user input:"]}),e.jsx(t,{code:`import java.util.Scanner;

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
}`,id:"user-input"}),e.jsxs("div",{className:"mt-6 p-4 bg-[#1E293B] rounded-lg border border-yellow-400/30",children:[e.jsx("strong",{className:"text-yellow-400",children:"⚠️ Important:"})," Always import Scanner at the top!",e.jsx(t,{code:"import java.util.Scanner;",id:"scanner-import"})]})]})]}),e.jsxs("section",{id:"conditionals",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"7️⃣ Conditional Statements"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"if Statement"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Execute code only if a condition is true:"}),e.jsx(t,{code:`int age = 18;

if (age >= 18) {
    System.out.println("You are an adult");
}`,id:"if-statement"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"if-else Statement"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Do one thing if true, something else if false:"}),e.jsx(t,{code:`int marks = 75;

if (marks >= 60) {
    System.out.println("You passed!");
} else {
    System.out.println("You failed. Study more!");
}`,id:"if-else-statement"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"if-else-if Statement"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Multiple conditions:"}),e.jsx(t,{code:`int marks = 85;
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

System.out.println("Your grade: " + grade); // Output: B`,id:"if-else-if-statement"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"switch Statement"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"When you have many options:"}),e.jsx(t,{code:`int day = 3;
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

System.out.println("Day: " + dayName); // Output: Wednesday`,id:"switch-statement"})]})]}),e.jsxs("section",{id:"loops",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"8️⃣ Loops"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"for Loop"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Repeat code a specific number of times:"}),e.jsx(t,{code:`// Print numbers 1 to 5
for (int i = 1; i <= 5; i++) {
    System.out.println("Number: " + i);
}

/* Output:
Number: 1
Number: 2
Number: 3
Number: 4
Number: 5
*/`,id:"for-loop"}),e.jsxs("p",{className:"text-[#666666] mt-6 bg-[#1E293B] p-4 rounded-lg border border-[#E0DCCF]",children:[e.jsx("strong",{children:"How it works:"}),e.jsx("br",{}),e.jsx("code",{children:"i = 1"})," - Start at 1",e.jsx("br",{}),e.jsx("code",{children:"i <= 5"})," - Continue while i is 5 or less",e.jsx("br",{}),e.jsx("code",{children:"i++"})," - Add 1 to i each time"]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"while Loop"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Repeat while a condition is true:"}),e.jsx(t,{code:`int i = 1;
while (i <= 3) {
    System.out.println("Count: " + i);
    i++;  // Don't forget to increase i!
}

/* Output:
Count: 1
Count: 2
Count: 3
*/`,id:"while-loop"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"do-while Loop"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Runs at least once, then checks the condition:"}),e.jsx(t,{code:`int i = 1;
do {
    System.out.println("Value: " + i);
    i++;
} while (i <= 3);

/* Output:
Value: 1
Value: 2
Value: 3
*/`,id:"do-while-loop"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"break and continue"}),e.jsxs("p",{className:"text-[#666666] mb-4",children:[e.jsx("strong",{className:"text-cyan-400",children:"break"})," - Exit the loop immediately"]}),e.jsx(t,{code:`for (int i = 1; i <= 10; i++) {
    if (i == 5) {
        break; // Exit loop when i reaches 5
    }
    System.out.println(i);
}

/* Output: 1 2 3 4 */`,id:"break-example"}),e.jsxs("p",{className:"text-[#666666] mb-4 mt-6",children:[e.jsx("strong",{className:"text-cyan-400",children:"continue"})," - Skip to next iteration"]}),e.jsx(t,{code:`for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        continue; // Skip when i is 3
    }
    System.out.println(i);
}

/* Output: 1 2 4 5 */`,id:"continue-example"})]})]}),e.jsxs("section",{id:"arrays",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"9️⃣ Arrays"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"What is an Array?"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"An array is like a collection of boxes of the same type, arranged in a line. Each box has a number (index) starting from 0."}),e.jsx("h4",{className:"text-xl font-bold mb-4 mt-6",children:"Creating Arrays"}),e.jsx(t,{code:`// Array of 5 integers
int[] numbers = {10, 20, 30, 40, 50};

// Array of strings
String[] names = {"Alice", "Bob", "Charlie"};

// Empty array with size 3 (all values are 0)
int[] scores = new int[3];`,id:"array-creation"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Accessing Array Elements"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Remember: First element is at index 0!"}),e.jsx(t,{code:`String[] fruits = {"Apple", "Banana", "Orange"};

System.out.println(fruits[0]); // Apple (first)
System.out.println(fruits[1]); // Banana (second)
System.out.println(fruits[2]); // Orange (third)

// Change an element
fruits[1] = "Mango";  // Now index 1 is "Mango"`,id:"array-access"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Looping Through Arrays"}),e.jsx(t,{code:`int[] ages = {18, 19, 20, 21};

// Method 1: Using for loop
for (int i = 0; i < ages.length; i++) {
    System.out.println("Age: " + ages[i]);
}

// Method 2: Enhanced for loop (easier)
for (int age : ages) {
    System.out.println("Age: " + age);
}`,id:"array-loop"})]})]}),e.jsxs("section",{id:"strings",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Strings"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Common String Methods"}),e.jsx(t,{code:`String text = "Hello World";

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
System.out.println(text.replace("World", "Java")); // Hello Java`,id:"string-methods"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"String Comparison"}),e.jsx(t,{code:`String name1 = "Alice";
String name2 = "Alice";
String name3 = "Bob";

// Using equals() - recommended
System.out.println(name1.equals(name2));  // true
System.out.println(name1.equals(name3));  // false

// Using == (NOT for strings!)
System.out.println(name1 == name2);  // might be false!

// Using equalsIgnoreCase() - ignores upper/lower
System.out.println(name1.equalsIgnoreCase("ALICE")); // true`,id:"string-comparison"})]})]}),e.jsxs("section",{id:"methods",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"1️⃣1️⃣ Methods"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"What is a Method?"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"A method is a reusable block of code that performs a specific task. It's like a recipe that you can use again and again."}),e.jsx(t,{code:`// Simple method
public static void greet() {
    System.out.println("Hello!");
}

// Calling the method
greet();  // Output: Hello!`,id:"simple-method"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Methods with Parameters"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Pass information to the method:"}),e.jsx(t,{code:`// Method with parameter
public static void greet(String name) {
    System.out.println("Hello, " + name);
}

// Calling the method
greet("Alice");  // Output: Hello, Alice
greet("Bob");    // Output: Hello, Bob`,id:"method-params"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Methods with Return Values"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Get a result back from the method:"}),e.jsx(t,{code:`// Method that returns a value
public static int add(int a, int b) {
    int sum = a + b;
    return sum;  // Send back the result
}

// Calling and using the result
int result = add(5, 3);
System.out.println("Sum: " + result);  // Output: Sum: 8`,id:"method-return"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Complete Example"}),e.jsx(t,{code:`public class Calculator {
    
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
}`,id:"calculator-example"})]})]}),e.jsxs("section",{id:"oop",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"1️⃣2️⃣ OOP Basics - Classes and Objects"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"What is OOP?"}),e.jsx("p",{className:"text-[#666666] mb-4",children:'Object-Oriented Programming is a way to organize code by creating "objects" that represent real-world things.'}),e.jsx("h4",{className:"text-xl font-bold mb-4 mt-6",children:"Class and Object"}),e.jsxs("p",{className:"text-[#666666] mb-4",children:[e.jsx("strong",{children:"Class"})," = Blueprint (like a template for a house)"]}),e.jsxs("p",{className:"text-[#666666] mb-4",children:[e.jsx("strong",{children:"Object"})," = Real thing created from the blueprint (like an actual house)"]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Creating a Class"}),e.jsx(t,{code:`// Blueprint: Student class
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
student1.study();  // Output: Alice is studying`,id:"class-example"})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Constructor - Set Initial Values"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"A constructor runs automatically when you create an object:"}),e.jsx(t,{code:`public class Student {
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
student.display();  // Output: Name: Charlie, Age: 21`,id:"constructor-example"})]})]}),e.jsxs("section",{id:"exceptions",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"1️⃣3️⃣ Exception Handling"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"What is an Exception?"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"An error that happens while the program is running. Exception handling prevents the program from crashing."}),e.jsx("h4",{className:"text-xl font-bold mb-4 mt-6",children:"try-catch Block"}),e.jsx(t,{code:`try {
    // Code that might cause an error
    int[] numbers = {1, 2, 3};
    System.out.println(numbers[10]);  // Out of bounds!
} catch (Exception e) {
    // What to do if error happens
    System.out.println("Error: Array index out of bounds!");
    System.out.println("Error details: " + e.getMessage());
}`,id:"try-catch"}),e.jsx("h4",{className:"text-xl font-bold mb-4 mt-6",children:"Real Example: Dividing by Zero"}),e.jsx(t,{code:`import java.util.Scanner;

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
}`,id:"safe-division"})]})]}),e.jsxs("section",{id:"project",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"1️⃣4️⃣ Mini Project: Student Grade System"}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8 mb-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Project Description"}),e.jsx("p",{className:"text-[#666666] mb-4",children:"Create a program that:"}),e.jsxs("ul",{className:"text-[#666666] space-y-2 ml-4",children:[e.jsxs("li",{className:"flex items-center gap-2",children:[e.jsx(r,{size:16,className:"text-green-400 flex-shrink-0"})," Takes student information (name, 3 test scores)"]}),e.jsxs("li",{className:"flex items-center gap-2",children:[e.jsx(r,{size:16,className:"text-green-400 flex-shrink-0"})," Calculates the average"]}),e.jsxs("li",{className:"flex items-center gap-2",children:[e.jsx(r,{size:16,className:"text-green-400 flex-shrink-0"})," Assigns a letter grade (A, B, C, etc.)"]}),e.jsxs("li",{className:"flex items-center gap-2",children:[e.jsx(r,{size:16,className:"text-green-400 flex-shrink-0"})," Displays the result"]})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-8",children:[e.jsx("h3",{className:"text-2xl font-bold mb-4",children:"Complete Solution"}),e.jsx(t,{code:`import java.util.Scanner;

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
}`,id:"mini-project"})]})]}),e.jsxs("section",{id:"recap",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Quick Recap Summary"}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-6",children:[e.jsx("h4",{className:"font-bold text-[#FF9500] mb-3",children:"Fundamentals"}),e.jsxs("ul",{className:"text-[#666666] text-sm space-y-1",children:[e.jsx("li",{children:'✓ Java is "write once, run anywhere"'}),e.jsx("li",{children:"✓ Every program starts with main method"}),e.jsx("li",{children:"✓ Statements end with semicolon (;)"}),e.jsx("li",{children:"✓ Variables store different data types"})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-6",children:[e.jsx("h4",{className:"font-bold text-[#FF9500] mb-3",children:"Control Flow"}),e.jsxs("ul",{className:"text-[#666666] text-sm space-y-1",children:[e.jsx("li",{children:"✓ if/else for decisions"}),e.jsx("li",{children:"✓ for/while for repetition"}),e.jsx("li",{children:"✓ break to exit loops"}),e.jsx("li",{children:"✓ try-catch for errors"})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-6",children:[e.jsx("h4",{className:"font-bold text-[#FF9500] mb-3",children:"Data Structures"}),e.jsxs("ul",{className:"text-[#666666] text-sm space-y-1",children:[e.jsx("li",{children:"✓ Arrays store multiple values"}),e.jsx("li",{children:"✓ Strings are text data"}),e.jsx("li",{children:"✓ Objects combine data + methods"}),e.jsx("li",{children:"✓ Classes are blueprints for objects"})]})]}),e.jsxs("div",{className:"bg-white/5 border border-[#E0DCCF] rounded-xl p-6",children:[e.jsx("h4",{className:"font-bold text-[#FF9500] mb-3",children:"Organization"}),e.jsxs("ul",{className:"text-[#666666] text-sm space-y-1",children:[e.jsx("li",{children:"✓ Methods organize code into tasks"}),e.jsx("li",{children:"✓ Parameters pass data to methods"}),e.jsx("li",{children:"✓ Return values send results back"}),e.jsx("li",{children:"✓ OOP structures code logically"})]})]})]})]}),e.jsxs("section",{id:"practice",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Practice Questions"}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("details",{className:"group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6",children:[e.jsx("summary",{className:"font-bold text-[#FF9500] mb-4 group-open:mb-4",children:"1. What are the main differences between int and double?"}),e.jsxs("p",{className:"text-[#666666] text-sm",children:[e.jsx("strong",{children:"int"})," stores whole numbers without decimals (e.g., 5, -10, 100).",e.jsx("br",{}),e.jsx("strong",{children:"double"})," stores decimal numbers with more precision (e.g., 5.5, 3.14159).",e.jsx("br",{}),"Use int for counting, double for measurements or calculations that need decimals."]})]}),e.jsxs("details",{className:"group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6",children:[e.jsx("summary",{className:"font-bold text-[#FF9500] mb-4 group-open:mb-4",children:"2. What does System.out.println() do?"}),e.jsxs("p",{className:"text-[#666666] text-sm",children:[e.jsx("strong",{children:"System.out.println()"})," prints text to the console/screen and adds a new line after it.",e.jsx("br",{}),e.jsx("code",{className:"bg-[#1e1e1e] px-2 py-1 rounded",children:"System.out.print()"})," prints without adding a new line."]})]}),e.jsxs("details",{className:"group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6",children:[e.jsx("summary",{className:"font-bold text-[#FF9500] mb-4 group-open:mb-4",children:"3. Explain the difference between for and while loops"}),e.jsxs("p",{className:"text-[#666666] text-sm",children:[e.jsx("strong",{children:"for loop:"})," Use when you know exactly how many times to repeat (e.g., 1 to 10).",e.jsx("br",{}),e.jsx("strong",{children:"while loop:"}),' Use when you repeat until a condition becomes false (e.g., until user enters "quit").']})]}),e.jsxs("details",{className:"group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6",children:[e.jsx("summary",{className:"font-bold text-[#FF9500] mb-4 group-open:mb-4",children:"4. What is the purpose of a constructor?"}),e.jsxs("p",{className:"text-[#666666] text-sm",children:["A constructor initializes an object with starting values when it's created.",e.jsx("br",{}),"It has the same name as the class and runs automatically with `new` keyword.",e.jsx("br",{}),'Example: When you create `new Student("Alice")`, the constructor sets the name to "Alice".']})]}),e.jsxs("details",{className:"group cursor-pointer bg-white/5 border border-[#E0DCCF] rounded-xl p-6",children:[e.jsx("summary",{className:"font-bold text-[#FF9500] mb-4 group-open:mb-4",children:"5. Why do we need exception handling?"}),e.jsxs("p",{className:"text-[#666666] text-sm",children:["Exception handling allows your program to handle errors gracefully without crashing.",e.jsx("br",{}),"Using try-catch, you can catch errors and provide helpful messages or alternative actions.",e.jsx("br",{}),"This makes your program more robust and user-friendly."]})]})]})]}),e.jsxs("section",{id:"nextsteps",className:"mb-16",children:[e.jsx("h2",{className:"text-4xl font-black mb-6",children:"Next Learning Steps"}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"bg-gradient-to-br from-[#FF9500] to-[#E88600] rounded-xl p-6 border border-[#FFB347]/40",children:[e.jsx("h4",{className:"font-bold mb-3 text-lg",children:"Intermediate Java"}),e.jsxs("ul",{className:"text-sm space-y-2",children:[e.jsx("li",{children:"✓ Inheritance & Polymorphism"}),e.jsx("li",{children:"✓ Abstract Classes & Interfaces"}),e.jsx("li",{children:"✓ Encapsulation Best Practices"}),e.jsx("li",{children:"✓ Static vs Instance Methods"})]})]}),e.jsxs("div",{className:"bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl p-6 border border-cyan-400/30",children:[e.jsx("h4",{className:"font-bold mb-3 text-lg",children:"Collections & Data"}),e.jsxs("ul",{className:"text-sm space-y-2",children:[e.jsx("li",{children:"✓ ArrayList & HashMap"}),e.jsx("li",{children:"✓ Collections Framework"}),e.jsx("li",{children:"✓ Sorting & Searching"}),e.jsx("li",{children:"✓ Working with Generics"})]})]}),e.jsxs("div",{className:"bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 border border-purple-400/30",children:[e.jsx("h4",{className:"font-bold mb-3 text-lg",children:"Database & Backend"}),e.jsxs("ul",{className:"text-sm space-y-2",children:[e.jsx("li",{children:"✓ JDBC - Connect to Databases"}),e.jsx("li",{children:"✓ SQL Basics"}),e.jsx("li",{children:"✓ File I/O Operations"}),e.jsx("li",{children:"✓ JSON Parsing"})]})]}),e.jsxs("div",{className:"bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 border border-green-400/30",children:[e.jsx("h4",{className:"font-bold mb-3 text-lg",children:"Web Frameworks"}),e.jsxs("ul",{className:"text-sm space-y-2",children:[e.jsx("li",{children:"✓ Spring Boot Framework"}),e.jsx("li",{children:"✓ REST APIs"}),e.jsx("li",{children:"✓ Web Development"}),e.jsx("li",{children:"✓ Authentication & Security"})]})]})]})]}),e.jsx("section",{className:"mb-16",children:e.jsxs("div",{className:"bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] rounded-2xl p-12 text-center border border-[#E0DCCF]",children:[e.jsx("h2",{className:"text-3xl font-black mb-4",children:"Ready to Master Java?"}),e.jsx("p",{className:"text-lg mb-8 text-white/90",children:"Join thousands of students learning Java with our interactive courses and 1:1 mentorship."}),e.jsx("button",{className:"bg-white text-[#4F46E5] px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all text-lg",children:"Start Your Java Journey Today"})]})})]})]}),e.jsx("footer",{className:"py-10 text-center text-slate-500 text-sm border-t border-[#F0ECE0] mt-16",children:"© 2026 MentorMuni. Learn Java for Beginners - Free Tutorial with Practical Examples."})]})};export{S as default};
