import React, { useState, useEffect } from 'react';
import { Copy, Check, Lightbulb, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import RoutePageShell from './layout/RoutePageShell';
import TutorialBackLink from './layout/TutorialBackLink';

const topics = [
  { id: 'intro', title: 'OOP in Daily Life' },
  { id: 'setup', title: 'Setup & Run Code' },
  { id: 'first-program', title: 'First C++ Program' },
  { id: 'classes-objects', title: 'Class & Object' },
  { id: 'encapsulation', title: 'Encapsulation' },
  { id: 'constructors', title: 'Constructor & Destructor' },
  { id: 'inheritance', title: 'Inheritance' },
  { id: 'polymorphism', title: 'Polymorphism' },
  { id: 'abstraction', title: 'Abstraction' },
  { id: 'stl-basics', title: 'STL (Lists in C++)' },
  { id: 'project', title: 'Live Mini Project' },
  { id: 'recap', title: 'Remember Cheat Sheet' },
  { id: 'practice', title: 'Practice Questions' },
  { id: 'nextsteps', title: 'Next Steps' },
];

const OOP_PILLARS = [
  {
    name: 'Encapsulation',
    life: 'Your phone PIN — you use the keypad (public), but the PIN is stored safely inside (private).',
    code: 'Hide data with private, expose safe methods with public.',
  },
  {
    name: 'Inheritance',
    life: 'You inherit your parents\' surname and habits — child class gets parent features.',
    code: 'class Dog : public Animal { ... }',
  },
  {
    name: 'Polymorphism',
    life: 'One "Pay" button in an app — works for UPI, card, or wallet differently.',
    code: 'Same function name, different behaviour per object.',
  },
  {
    name: 'Abstraction',
    life: 'You drive a car using steering & pedals — you don\'t build the engine yourself.',
    code: 'Show only what the user needs; hide complex details.',
  },
];

function CodeBlock({ code, label = 'C++' }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied! Paste into main.cpp and run with g++.');
  };

  return (
    <div className="my-4 rounded-lg border border-border bg-[#1e1e1e]">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs text-slate-400">{label}</span>
        <button
          type="button"
          onClick={copyToClipboard}
          className="flex items-center gap-2 rounded bg-[#FF9500] px-3 py-1 text-xs text-white transition-all hover:bg-[#FF9500]/80"
        >
          <Copy size={14} /> Copy &amp; try
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm text-[#e0e0e0]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SectionCard({ children, className = '' }) {
  return <div className={`mb-6 rounded-xl border border-border bg-card p-6 md:p-8 ${className}`}>{children}</div>;
}

function LifeExample({ title, children }) {
  return (
    <div className="mb-6 rounded-xl border border-sky-200/60 bg-sky-50/80 p-5 dark:border-sky-500/30 dark:bg-sky-950/40">
      <div className="mb-2 flex items-center gap-2 font-bold text-[#15799F] dark:text-sky-300">
        <Home size={18} aria-hidden />
        Real-life example: {title}
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground md:text-base">{children}</div>
    </div>
  );
}

function RememberBox({ children }) {
  return (
    <div className="mt-4 flex gap-3 rounded-lg border border-amber-200/80 bg-amber-50/90 p-4 dark:border-amber-500/30 dark:bg-amber-950/30">
      <Lightbulb size={20} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
      <p className="text-sm font-medium leading-relaxed text-amber-950 dark:text-amber-100">
        <span className="font-bold">Remember: </span>
        {children}
      </p>
    </div>
  );
}

function ExpectedOutput({ lines }) {
  return (
    <div className="mt-3 rounded-lg border border-border bg-[#0f172a] p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">When you run it, you see:</p>
      <pre className="font-mono text-sm text-green-400">{lines.join('\n')}</pre>
    </div>
  );
}

const CppOopTutorial = () => {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const handleScroll = () => {
      for (const topic of topics) {
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
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };

  return (
    <RoutePageShell scope="inner">
      <head>
        <title>OOP with C++ for Beginners — Free Tutorial | MentorMuni</title>
        <meta
          name="description"
          content="Learn C++ OOP with simple real-life examples — classes, inheritance, polymorphism explained like daily life. Free tutorial for placements."
        />
      </head>

      <TutorialBackLink />

      <div className="mm-tutorial-layout mm-container mm-container--wide py-[clamp(2rem,5vw,4rem)]">
        <aside className="mm-tutorial-layout__sidebar">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-6 text-lg font-bold text-cta">Topics</h3>
            <nav className="space-y-2">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => scrollToSection(topic.id)}
                  className={`w-full rounded-lg px-4 py-2 text-left text-sm font-semibold transition-all ${
                    activeSection === topic.id
                      ? 'bg-cta text-white'
                      : 'text-muted-foreground hover:bg-accent-faint hover:text-foreground'
                  }`}
                >
                  {topic.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="mm-tutorial-layout__main">
          <div className="mb-16">
            <h1 className="mb-6 bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
              OOP with C++
            </h1>
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
              Learn Object-Oriented Programming the easy way — every concept is tied to something you already do every
              day. Copy the examples, run them on your laptop, and remember OOP for interviews.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Real-life analogies', 'Copy & run code', 'Placement friendly'].map((tag) => (
                <span key={tag} className="rounded-full bg-cta/15 px-4 py-1.5 text-sm font-semibold text-cta">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* INTRO */}
          <section id="intro" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">OOP in Daily Life</h2>
            <SectionCard>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                <strong>OOP (Object-Oriented Programming)</strong> is just a way to organise code like the real world:
                things have <strong>properties</strong> (name, colour, balance) and <strong>actions</strong> (ring,
                withdraw, study). In C++, a <strong>class</strong> is the template; an <strong>object</strong> is one
                real thing made from that template.
              </p>
              <LifeExample title="Biscuit cutter">
                The <strong>cutter shape</strong> = class (same design for every biscuit). Each <strong>biscuit you
                cut</strong> = object (same shape, but separate pieces you can eat one by one).
              </LifeExample>
              <h3 className="mb-4 text-2xl font-bold">Four pillars — with examples you already know</h3>
              <div className="space-y-4">
                {OOP_PILLARS.map((p) => (
                  <div key={p.name} className="rounded-lg border border-border bg-background/50 p-4">
                    <h4 className="mb-2 font-bold text-primary">{p.name}</h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      <strong>Life:</strong> {p.life}
                    </p>
                    <p className="font-mono text-xs text-slate-500">{p.code}</p>
                  </div>
                ))}
              </div>
              <RememberBox>
                Interview one-liner: &quot;OOP models real entities as objects that bundle data and behaviour, so code is
                easier to reuse and maintain.&quot;
              </RememberBox>
            </SectionCard>
          </section>

          {/* SETUP */}
          <section id="setup" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">Setup &amp; Run Code</h2>
            <SectionCard>
              <LifeExample title="Like installing WhatsApp before chatting">
                You need a <strong>compiler</strong> once (g++). After that, every example is: write code → compile →
                run — same as saving a note and pressing Send.
              </LifeExample>
              <ol className="mb-6 list-decimal space-y-2 pl-5 text-muted-foreground">
                <li>Install g++ (Windows: MinGW, Mac: Xcode tools, Linux: <code className="rounded bg-shell-1 px-1">sudo apt install g++</code>)</li>
                <li>Create a file <code className="rounded bg-shell-1 px-1">main.cpp</code></li>
                <li>Paste any example below</li>
                <li>Run in terminal:</li>
              </ol>
              <CodeBlock
                code={`g++ -std=c++17 -o myapp main.cpp
./myapp`}
                label="Terminal (Mac/Linux)"
              />
              <p className="text-sm text-muted-foreground">On Windows: use <code className="rounded bg-shell-1 px-1">myapp.exe</code> instead of <code className="rounded bg-shell-1 px-1">./myapp</code></p>
            </SectionCard>
          </section>

          {/* FIRST PROGRAM */}
          <section id="first-program" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">Your First C++ Program</h2>
            <SectionCard>
              <LifeExample title="Sending a text message">
                <code className="rounded bg-shell-1 px-1">cout</code> is like typing a message to the screen.{' '}
                <code className="rounded bg-shell-1 px-1">main()</code> is where the phone &quot;starts&quot; your app.
              </LifeExample>
              <CodeBlock
                code={`#include <iostream>
using namespace std;

int main() {
    cout << "Hello! I am learning OOP in C++." << endl;
    cout << "Today I will understand classes." << endl;
    return 0;
}`}
              />
              <ExpectedOutput lines={['Hello! I am learning OOP in C++.', 'Today I will understand classes.']} />
            </SectionCard>
          </section>

          {/* CLASS & OBJECT */}
          <section id="classes-objects" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">Class &amp; Object</h2>
            <SectionCard>
              <LifeExample title="Contact saved on your phone">
                The phone&apos;s <strong>Contact template</strong> has fields: name, number.{' '}
                <strong>&quot;Mom&quot;</strong> and <strong>&quot;Best friend&quot;</strong> are two different objects —
                same structure, different data.
              </LifeExample>
              <CodeBlock
                code={`#include <iostream>
#include <string>
using namespace std;

// Class = blueprint for a student
class Student {
public:
    string name;
    int rollNo;

    void introduce() {
        cout << "I am " << name << ", roll number " << rollNo << endl;
    }
};

int main() {
    // Two objects from the same class
    Student priya;
    priya.name = "Priya";
    priya.rollNo = 101;
    priya.introduce();

    Student rahul;
    rahul.name = "Rahul";
    rahul.rollNo = 102;
    rahul.introduce();

    return 0;
}`}
              />
              <ExpectedOutput lines={['I am Priya, roll number 101', 'I am Rahul, roll number 102']} />
              <RememberBox>Class = design. Object = one real item built from that design.</RememberBox>
            </SectionCard>
          </section>

          {/* ENCAPSULATION */}
          <section id="encapsulation" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">Encapsulation</h2>
            <SectionCard>
              <LifeExample title="ATM machine">
                You cannot open the machine and change cash inside. You only use the <strong>buttons</strong> (deposit,
                withdraw). The balance is <strong>private</strong>; the buttons are <strong>public</strong>.
              </LifeExample>
              <CodeBlock
                code={`#include <iostream>
using namespace std;

class BankAccount {
private:
    double balance;  // nobody should change this directly

public:
    BankAccount(double openingAmount) {
        balance = openingAmount;
    }

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            cout << "Deposited Rs " << amount << endl;
        }
    }

    bool withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            cout << "Withdrew Rs " << amount << endl;
            return true;
        }
        cout << "Not enough balance!" << endl;
        return false;
    }

    double getBalance() {
        return balance;
    }
};

int main() {
    BankAccount myAccount(1000);  // start with Rs 1000

    myAccount.deposit(500);
    myAccount.withdraw(200);
    myAccount.withdraw(5000);  // fails

    cout << "Final balance: Rs " << myAccount.getBalance() << endl;
    return 0;
}`}
              />
              <ExpectedOutput
                lines={[
                  'Deposited Rs 500',
                  'Withdrew Rs 200',
                  'Not enough balance!',
                  'Final balance: Rs 1300',
                ]}
              />
              <RememberBox>
                Encapsulation = hide internal data (private), allow safe actions (public methods). Like UPI — you don&apos;t
                touch bank servers directly.
              </RememberBox>
            </SectionCard>
          </section>

          {/* CONSTRUCTORS */}
          <section id="constructors" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">Constructor &amp; Destructor</h2>
            <SectionCard>
              <LifeExample title="Opening a new bank account">
                When the account is <strong>created</strong>, the bank sets your name and opening balance automatically —
                that&apos;s the <strong>constructor</strong>. When the account is <strong>closed</strong>, cleanup
                happens — that&apos;s the <strong>destructor</strong>.
              </LifeExample>
              <CodeBlock
                code={`#include <iostream>
#include <string>
using namespace std;

class Alarm {
    string label;
    bool isOn;

public:
    // Constructor — runs when object is born
    Alarm(string name) {
        label = name;
        isOn = false;
        cout << "Alarm created: " << label << endl;
    }

    // Destructor — runs when object dies
    ~Alarm() {
        cout << "Alarm removed: " << label << endl;
    }

    void ring() {
        isOn = true;
        cout << label << " is RINGING!" << endl;
    }
};

int main() {
    Alarm morning("7 AM Wake up");
    morning.ring();
    // destructor runs automatically at end of main
    return 0;
}`}
              />
              <ExpectedOutput
                lines={['Alarm created: 7 AM Wake up', '7 AM Wake up is RINGING!', 'Alarm removed: 7 AM Wake up']}
              />
              <RememberBox>Constructor = automatic setup when object is created. Name matches the class.</RememberBox>
            </SectionCard>
          </section>

          {/* INHERITANCE */}
          <section id="inheritance" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">Inheritance</h2>
            <SectionCard>
              <LifeExample title="Vehicles on the road">
                Every vehicle has wheels and can move. A <strong>Car</strong> adds honk; a <strong>Bike</strong> adds
                bell. Child classes <strong>inherit</strong> common parts from <strong>Vehicle</strong> and add their own.
              </LifeExample>
              <CodeBlock
                code={`#include <iostream>
#include <string>
using namespace std;

class Vehicle {
protected:
    string brand;
public:
    Vehicle(string b) : brand(b) {}
    void start() {
        cout << brand << " engine started." << endl;
    }
};

class Car : public Vehicle {
public:
    Car(string b) : Vehicle(b) {}
    void honk() {
        cout << brand << " says: Beep beep!" << endl;
    }
};

class Bike : public Vehicle {
public:
    Bike(string b) : Vehicle(b) {}
    void ringBell() {
        cout << brand << " says: Ring ring!" << endl;
    }
};

int main() {
    Car c("Maruti");
    c.start();
    c.honk();

    Bike b("Hero");
    b.start();
    b.ringBell();
    return 0;
}`}
              />
              <ExpectedOutput
                lines={[
                  'Maruti engine started.',
                  'Maruti says: Beep beep!',
                  'Hero engine started.',
                  'Hero says: Ring ring!',
                ]}
              />
              <RememberBox>
                Inheritance = &quot;is-a&quot; relationship. Car <em>is a</em> Vehicle. Reuse parent code, add child-only
                features.
              </RememberBox>
            </SectionCard>
          </section>

          {/* POLYMORPHISM */}
          <section id="polymorphism" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">Polymorphism</h2>
            <SectionCard>
              <LifeExample title="One 'Play' button, many apps">
                You press <strong>Play</strong> on Spotify → music plays. Same button on YouTube → video plays. Same
                action name, <strong>different behaviour</strong> depending on the app — that is polymorphism.
              </LifeExample>
              <CodeBlock
                code={`#include <iostream>
#include <string>
using namespace std;

class Payment {
public:
    virtual void pay(double amount) {
        cout << "Paying Rs " << amount << " (generic)" << endl;
    }
};

class UPI : public Payment {
public:
    void pay(double amount) override {
        cout << "UPI: Paid Rs " << amount << " instantly" << endl;
    }
};

class Cash : public Payment {
public:
    void pay(double amount) override {
        cout << "Cash: Handed Rs " << amount << " notes" << endl;
    }
};

int main() {
    Payment* p1 = new UPI();
    Payment* p2 = new Cash();

    p1->pay(250);  // calls UPI version
    p2->pay(250);  // calls Cash version

    delete p1;
    delete p2;
    return 0;
}`}
              />
              <ExpectedOutput lines={['UPI: Paid Rs 250 instantly', 'Cash: Handed Rs 250 notes']} />
              <RememberBox>
                Use <code className="rounded bg-shell-1 px-1">virtual</code> + <code className="rounded bg-shell-1 px-1">override</code> so the
                correct child method runs. One interface, many implementations.
              </RememberBox>
            </SectionCard>
          </section>

          {/* ABSTRACTION */}
          <section id="abstraction" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">Abstraction</h2>
            <SectionCard>
              <LifeExample title="Swiggy / Zomato order">
                You tap <strong>Place order</strong> — you don&apos;t manage delivery routing, restaurant APIs, or payment
                gateways. You see a <strong>simple interface</strong>; complex work is hidden inside.
              </LifeExample>
              <CodeBlock
                code={`#include <iostream>
using namespace std;

// Abstract class — cannot create OrderApp directly
class OrderApp {
public:
    virtual void placeOrder(string item) = 0;  // must be implemented by child
    virtual ~OrderApp() {}
};

class Swiggy : public OrderApp {
public:
    void placeOrder(string item) override {
        cout << "Swiggy: Ordered " << item << ". Tracking in app..." << endl;
    }
};

class Zomato : public OrderApp {
public:
    void placeOrder(string item) override {
        cout << "Zomato: Ordered " << item << ". ETA 25 mins." << endl;
    }
};

void orderFood(OrderApp& app, string item) {
    app.placeOrder(item);  // works for Swiggy or Zomato
}

int main() {
    Swiggy swiggy;
    Zomato zomato;

    orderFood(swiggy, "Masala Dosa");
    orderFood(zomato, "Paneer Bowl");
    return 0;
}`}
              />
              <ExpectedOutput
                lines={['Swiggy: Ordered Masala Dosa. Tracking in app...', 'Zomato: Ordered Paneer Bowl. ETA 25 mins.']}
              />
              <RememberBox>
                Abstraction = show <strong>what</strong> (place order), hide <strong>how</strong> (internal logic). Pure virtual
                (= 0) forces children to implement.
              </RememberBox>
            </SectionCard>
          </section>

          {/* STL */}
          <section id="stl-basics" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">STL — Lists in C++</h2>
            <SectionCard>
              <LifeExample title="Shopping list in Notes app">
                You add items one by one, sort them A–Z before shopping — <code className="rounded bg-shell-1 px-1">vector</code> is
                that dynamic list in C++.
              </LifeExample>
              <CodeBlock
                code={`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<string> grocery = {"Milk", "Bread", "Eggs", "Apples"};

    cout << "Before sort:" << endl;
    for (const string& item : grocery) {
        cout << " - " << item << endl;
    }

    sort(grocery.begin(), grocery.end());

    cout << "\\nAfter sort:" << endl;
    for (const string& item : grocery) {
        cout << " - " << item << endl;
    }
    return 0;
}`}
              />
              <ExpectedOutput
                lines={[
                  'Before sort:',
                  ' - Milk',
                  ' - Bread',
                  ' - Eggs',
                  ' - Apples',
                  '',
                  'After sort:',
                  ' - Apples',
                  ' - Bread',
                  ' - Eggs',
                  ' - Milk',
                ]}
              />
              <RememberBox>vector = resizable array. Use in DSA for lists of numbers or strings.</RememberBox>
            </SectionCard>
          </section>

          {/* PROJECT */}
          <section id="project" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">Live Mini Project: College Canteen</h2>
            <SectionCard>
              <LifeExample title="Canteen counter at lunch">
                Students order food. Canteen tracks items and price. Uses <strong>class FoodItem</strong>,{' '}
                <strong>class Canteen</strong>, and a <strong>vector</strong> menu — all OOP ideas together.
              </LifeExample>
              <p className="mb-4 text-muted-foreground">
                Copy this full program, compile, and run. Try adding your own food items in <code className="rounded bg-shell-1 px-1">main</code>.
              </p>
              <CodeBlock
                code={`#include <iostream>
#include <vector>
#include <string>
using namespace std;

class FoodItem {
    string name;
    int price;
public:
    FoodItem(string n, int p) : name(n), price(p) {}

    string getName() const { return name; }
    int getPrice() const { return price; }
};

class Canteen {
    vector<FoodItem> menu;
    int totalSales;

public:
    Canteen() : totalSales(0) {}

    void addToMenu(const FoodItem& item) {
        menu.push_back(item);
        cout << "Added to menu: " << item.getName() << " (Rs " << item.getPrice() << ")" << endl;
    }

    void order(const string& foodName) {
        for (const FoodItem& item : menu) {
            if (item.getName() == foodName) {
                totalSales += item.getPrice();
                cout << "Served: " << foodName << " — please pay Rs " << item.getPrice() << endl;
                return;
            }
        }
        cout << foodName << " not on menu today." << endl;
    }

    void showMenu() {
        cout << "\\n--- Today's Menu ---" << endl;
        for (const FoodItem& item : menu) {
            cout << "  " << item.getName() << " : Rs " << item.getPrice() << endl;
        }
    }

    void closingReport() {
        cout << "\\nTotal sales today: Rs " << totalSales << endl;
    }
};

int main() {
    Canteen canteen;

    canteen.addToMenu(FoodItem("Veg Thali", 60));
    canteen.addToMenu(FoodItem("Masala Dosa", 45));
    canteen.addToMenu(FoodItem("Cold Coffee", 35));

    canteen.showMenu();
    canteen.order("Masala Dosa");
    canteen.order("Veg Thali");
    canteen.order("Pizza");  // not available
    canteen.closingReport();

    return 0;
}`}
              />
              <ExpectedOutput
                lines={[
                  'Added to menu: Veg Thali (Rs 60)',
                  'Added to menu: Masala Dosa (Rs 45)',
                  'Added to menu: Cold Coffee (Rs 35)',
                  '',
                  "--- Today's Menu ---",
                  '  Veg Thali : Rs 60',
                  '  Masala Dosa : Rs 45',
                  '  Cold Coffee : Rs 35',
                  'Served: Masala Dosa — please pay Rs 45',
                  'Served: Veg Thali — please pay Rs 60',
                  'Pizza not on menu today.',
                  '',
                  'Total sales today: Rs 105',
                ]}
              />
            </SectionCard>
          </section>

          {/* RECAP */}
          <section id="recap" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">Remember Cheat Sheet</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-card">
                    <th className="p-4 font-bold">Concept</th>
                    <th className="p-4 font-bold">Remember with life</th>
                    <th className="p-4 font-bold">C++ keyword</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ['Class / Object', 'Contact template / saved contacts', 'class, object'],
                    ['Encapsulation', 'ATM — private balance, public buttons', 'private, public'],
                    ['Constructor', 'Account opening sets starting balance', 'ClassName()'],
                    ['Inheritance', 'Car is a Vehicle', ': public Parent'],
                    ['Polymorphism', 'One Pay button, UPI vs cash', 'virtual, override'],
                    ['Abstraction', 'Food app — tap order, hide logistics', '= 0 pure virtual'],
                    ['STL vector', 'Shopping list you can sort', 'vector, sort'],
                  ].map(([concept, life, kw]) => (
                    <tr key={concept} className="border-b border-border">
                      <td className="p-4 font-semibold text-foreground">{concept}</td>
                      <td className="p-4">{life}</td>
                      <td className="p-4 font-mono text-xs text-primary">{kw}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* PRACTICE */}
          <section id="practice" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">Practice Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Give a real-life example of a class and two objects.',
                  a: 'Class: Instagram Profile template (username, bio, posts). Objects: your profile and your friend\'s profile — same fields, different values.',
                },
                {
                  q: 'Why should balance in a BankAccount be private?',
                  a: 'So nobody can set balance = 999999 from outside. Only deposit() and withdraw() change it safely — like you cannot open an ATM vault.',
                },
                {
                  q: 'What is the difference between inheritance and polymorphism?',
                  a: 'Inheritance = child gets parent features (Bike is a Vehicle). Polymorphism = same function name, different behaviour (pay() via UPI vs cash).',
                },
                {
                  q: 'When do you use a vector in C++?',
                  a: 'When you need a list that can grow — menu items, student names, test scores. Real life: grocery list before you go to the store.',
                },
              ].map((item, i) => (
                <details key={item.q} className="cursor-pointer rounded-xl border border-border bg-card p-6">
                  <summary className="font-bold text-cta">
                    {i + 1}. {item.q}
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* NEXT STEPS */}
          <section id="nextsteps" className="mb-16">
            <h2 className="mb-6 text-4xl font-black">Next Steps</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-cta/30 bg-gradient-to-br from-cta/20 to-cta-mid/10 p-6">
                <h4 className="mb-3 text-lg font-bold">More free tutorials</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/java-for-beginners" className="text-primary hover:underline">
                      Java for Beginners
                    </Link>
                  </li>
                  <li>
                    <Link to="/python-for-beginners" className="text-primary hover:underline">
                      Python for Beginners
                    </Link>
                  </li>
                  <li>
                    <Link to="/free-tutorials" className="text-primary hover:underline">
                      All Free Tutorials
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 p-6">
                <h4 className="mb-3 text-lg font-bold">After OOP — for placements</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <Check size={16} className="shrink-0 text-green-500" />
                    Solve 20 easy array problems in C++
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="shrink-0 text-green-500" />
                    Revise pointers &amp; references (1 weekend)
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="shrink-0 text-green-500" />
                    <Link to="/interview-readiness-tools" className="text-primary hover:underline">
                      Take the free readiness check
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <div className="rounded-2xl border border-border bg-gradient-to-r from-sky-600 to-indigo-600 p-12 text-center text-white">
              <h2 className="mb-4 text-3xl font-black">You learned OOP with real-life examples</h2>
              <p className="mb-8 text-lg text-white/90">
                Run each program on your laptop. Explaining these analogies in an interview shows real understanding — not
                just memorised definitions.
              </p>
              <Link
                to="/interview-readiness-tools"
                className="inline-block rounded-xl bg-white px-8 py-4 text-lg font-bold text-indigo-600 transition-all hover:bg-white/90"
              >
                Check your interview readiness
              </Link>
            </div>
          </section>
        </div>
      </div>

      <footer className="mt-16 border-t border-border py-10 text-center text-sm text-muted-foreground">
        © 2026 MentorMuni. OOP with C++ — learn with everyday examples.
      </footer>
    </RoutePageShell>
  );
};

export default CppOopTutorial;
