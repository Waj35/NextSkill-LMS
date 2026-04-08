const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Clear existing data
db.exec('DELETE FROM notes; DELETE FROM activity_progress; DELETE FROM quiz_questions; DELETE FROM activities; DELETE FROM modules; DELETE FROM enrollments; DELETE FROM courses; DELETE FROM users;');

// Create users
const password = bcrypt.hashSync('password123', 10);

const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
insertUser.run('Admin User', 'admin@nextskill.com', password, 'admin');
insertUser.run('Dr. Sarah Johnson', 'sarah@nextskill.com', password, 'instructor');
insertUser.run('Prof. Mike Chen', 'mike@nextskill.com', password, 'instructor');
insertUser.run('Priya Kapoor', 'priya@nextskill.com', password, 'instructor');
insertUser.run('Alice Martin', 'alice@nextskill.com', password, 'student');
insertUser.run('Bob Learner', 'bob@nextskill.com', password, 'student');

// Create courses
const insertCourse = db.prepare('INSERT INTO courses (title, description, thumbnail, instructor_id, category, difficulty, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)');

// Programming courses
insertCourse.run(
  'JavaScript Fundamentals',
  'Master the building blocks of JavaScript — variables, functions, objects, and async programming. Hands-on exercises included.',
  'JS', 2, 'programming', 'beginner', 1
);
insertCourse.run(
  'React for Beginners',
  'Learn React from scratch — components, hooks, state management, and building real-world applications.',
  'Re', 2, 'programming', 'beginner', 1
);
insertCourse.run(
  'Data Science with Python',
  'Explore data analysis, visualization, and machine learning using Python, Pandas, and Scikit-learn.',
  'Py', 3, 'data-science', 'intermediate', 1
);
insertCourse.run(
  'Node.js Backend Development',
  'Build scalable server-side applications with Node.js, Express, and databases.',
  'No', 2, 'programming', 'intermediate', 1
);
insertCourse.run(
  'UI/UX Design Principles',
  'Learn user-centered design thinking, wireframing, prototyping, and usability testing.',
  'UX', 3, 'design', 'beginner', 1
);

// Finance courses
insertCourse.run(
  'Personal Finance Essentials',
  'Take control of your money. Learn budgeting, saving, debt management, and building an emergency fund from scratch.',
  'PF', 4, 'finance', 'beginner', 1
);
insertCourse.run(
  'Stock Market Investing 101',
  'Understand how the stock market works, how to read financial statements, and how to build a diversified portfolio.',
  'SM', 4, 'finance', 'beginner', 1
);
insertCourse.run(
  'Financial Modeling & Valuation',
  'Learn to build financial models in Excel, perform DCF analysis, and value companies like a Wall Street analyst.',
  'FM', 3, 'finance', 'advanced', 1
);
insertCourse.run(
  'Cryptocurrency & Blockchain Fundamentals',
  'Demystify blockchain technology, understand how cryptocurrencies work, and evaluate digital assets.',
  'BC', 4, 'finance', 'intermediate', 1
);
insertCourse.run(
  'Accounting for Non-Accountants',
  'Understand the language of business — income statements, balance sheets, cash flow, and key financial ratios.',
  'AC', 3, 'finance', 'beginner', 1
);

// === MODULES ===
const insertModule = db.prepare('INSERT INTO modules (course_id, title, description, order_index) VALUES (?, ?, ?, ?)');

// JS course modules (course 1)
insertModule.run(1, 'Getting Started', 'Introduction to JavaScript and setting up your environment', 1);
insertModule.run(1, 'Variables & Data Types', 'Understanding how data works in JavaScript', 2);
insertModule.run(1, 'Functions & Scope', 'Writing reusable code with functions', 3);
insertModule.run(1, 'Objects & Arrays', 'Working with complex data structures', 4);

// React course modules (course 2)
insertModule.run(2, 'React Basics', 'Understanding JSX, components, and the virtual DOM', 1);
insertModule.run(2, 'State & Props', 'Managing data flow in React applications', 2);
insertModule.run(2, 'Hooks & Effects', 'Using React hooks for state and side effects', 3);

// Data Science modules (course 3)
insertModule.run(3, 'Python for Data Science', 'Python basics and NumPy fundamentals', 1);
insertModule.run(3, 'Data Analysis with Pandas', 'Exploring, cleaning, and transforming data', 2);

// Node.js modules (course 4)
insertModule.run(4, 'Node.js Basics', 'Understanding the runtime and module system', 1);
insertModule.run(4, 'Express Framework', 'Building REST APIs with Express', 2);

// UI/UX modules (course 5)
insertModule.run(5, 'Design Thinking', 'Human-centered approach to problem solving', 1);
insertModule.run(5, 'Wireframing & Prototyping', 'From idea to interactive prototype', 2);

// Personal Finance modules (course 6)
insertModule.run(6, 'Money Mindset', 'Build a healthy relationship with money', 1);           // module 14
insertModule.run(6, 'Budgeting That Works', 'Create a realistic budget you can stick to', 2);  // module 15
insertModule.run(6, 'Saving & Emergency Fund', 'Build your financial safety net', 3);          // module 16
insertModule.run(6, 'Debt Management', 'Strategies to pay off debt faster', 4);                // module 17

// Stock Market modules (course 7)
insertModule.run(7, 'How the Stock Market Works', 'Exchanges, brokers, and order types', 1);    // module 18
insertModule.run(7, 'Reading Financial Statements', 'Income statements, balance sheets, cash flow', 2); // module 19
insertModule.run(7, 'Building a Portfolio', 'Diversification, risk, and asset allocation', 3);  // module 20

// Financial Modeling modules (course 8)
insertModule.run(8, 'Excel for Finance', 'Essential Excel skills for financial analysis', 1);   // module 21
insertModule.run(8, 'DCF Valuation', 'Discounted cash flow analysis step by step', 2);          // module 22

// Crypto modules (course 9)
insertModule.run(9, 'Blockchain Basics', 'How distributed ledger technology works', 1);          // module 23
insertModule.run(9, 'Understanding Crypto Assets', 'Bitcoin, Ethereum, and token types', 2);     // module 24

// Accounting modules (course 10)
insertModule.run(10, 'The Accounting Equation', 'Assets, liabilities, and equity', 1);           // module 25
insertModule.run(10, 'Reading Financial Reports', 'P&L, balance sheet, and cash flow statements', 2); // module 26

// === ACTIVITIES ===
const insertActivityStmt = db.prepare('INSERT INTO activities (module_id, title, type, content, duration_minutes, order_index, points) VALUES (?, ?, ?, ?, ?, ?, ?)');
const insertQuestion = db.prepare('INSERT INTO quiz_questions (activity_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?)');

// Helper to insert activity and return its ID
function addActivity(moduleId, title, type, content, duration, order, points) {
  const result = insertActivityStmt.run(moduleId, title, type, content, duration, order, points);
  return Number(result.lastInsertRowid);
}

// Wrapper that matches old calling convention for non-quiz activities
const insertActivity = { run: (...args) => addActivity(...args) };
let _qid;

// Helper to add a quiz with questions in one go
function addQuiz(moduleId, title, description, duration, order, points, questions) {
  const actId = addActivity(moduleId, title, 'quiz', JSON.stringify({ description }), duration, order, points);
  for (const q of questions) {
    insertQuestion.run(actId, q.question, JSON.stringify(q.options), q.correct, q.explanation);
  }
  return actId;
}

// ---- JS Course Activities ----
// Module 1 (Getting Started)
insertActivity.run(1, 'What is JavaScript?', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
  description: 'A brief introduction to JavaScript — the language of the web.'
}), 15, 1, 10);

insertActivity.run(1, 'History of JavaScript', 'reading', JSON.stringify({
  body: `# History of JavaScript\n\nJavaScript was created by **Brendan Eich** in 1995 while working at Netscape Communications. Originally named Mocha, then LiveScript, it was finally renamed to JavaScript.\n\n## Key Milestones\n\n- **1995** — Created at Netscape\n- **1997** — ECMAScript 1 standardized\n- **2009** — Node.js brings JS to the server\n- **2015** — ES6/ES2015 modernizes the language\n- **2020+** — JavaScript dominates web, mobile, and server development\n\n## Why Learn JavaScript?\n\n1. It runs everywhere — browsers, servers, mobile, desktop\n2. Huge ecosystem of libraries and frameworks\n3. High demand in the job market\n4. Versatile — frontend, backend, full-stack`
}), 10, 2, 10);

insertActivity.run(1, 'Setting Up Your Environment', 'interactive', JSON.stringify({
  instructions: 'Follow the steps below to set up your JavaScript development environment.',
  steps: [
    { title: 'Install Node.js', description: 'Download and install Node.js from nodejs.org', completed: false },
    { title: 'Install VS Code', description: 'Download Visual Studio Code as your code editor', completed: false },
    { title: 'Create your first file', description: 'Create a file called hello.js and write: console.log("Hello, World!")', completed: false },
    { title: 'Run your code', description: 'Open terminal and run: node hello.js', completed: false }
  ]
}), 20, 3, 15);

// activity id 4 = quiz
_qid = insertActivity.run(1, 'JavaScript Basics Quiz', 'quiz', JSON.stringify({
  description: 'Test your knowledge of JavaScript basics!'
}), 10, 4, 20);

insertQuestion.run(_qid, 'Who created JavaScript?', JSON.stringify(['Tim Berners-Lee', 'Brendan Eich', 'Guido van Rossum', 'James Gosling']), 1, 'Brendan Eich created JavaScript in 1995 at Netscape.');
insertQuestion.run(_qid, 'What was JavaScript originally called?', JSON.stringify(['Java', 'TypeScript', 'Mocha', 'CoffeeScript']), 2, 'JavaScript was originally named Mocha, then LiveScript.');
insertQuestion.run(_qid, 'Which company developed JavaScript?', JSON.stringify(['Microsoft', 'Google', 'Netscape', 'Apple']), 2, 'JavaScript was created at Netscape Communications.');
insertQuestion.run(_qid, 'What year was Node.js released?', JSON.stringify(['2005', '2009', '2012', '2015']), 1, 'Node.js was released in 2009 by Ryan Dahl.');

// Module 2 (Variables & Data Types)
insertActivity.run(2, 'Variables: let, const, var', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/9WIJQDvt4Us',
  description: 'Understanding variable declarations in modern JavaScript.'
}), 12, 1, 10);

insertActivity.run(2, 'Data Types in JavaScript', 'reading', JSON.stringify({
  body: `# JavaScript Data Types\n\nJavaScript has **8 data types**:\n\n## Primitive Types\n- **String** — Text: \`"hello"\`\n- **Number** — Integers and floats: \`42\`, \`3.14\`\n- **BigInt** — Large integers: \`9007199254740991n\`\n- **Boolean** — \`true\` or \`false\`\n- **undefined** — Variable declared but not assigned\n- **null** — Intentional empty value\n- **Symbol** — Unique identifier\n\n## Reference Type\n- **Object** — Collections of key-value pairs (includes arrays and functions)\n\n## Type Checking\nUse \`typeof\` to check a value's type:\n\`\`\`javascript\ntypeof "hello"  // "string"\ntypeof 42       // "number"\ntypeof true     // "boolean"\ntypeof {}       // "object"\n\`\`\``
}), 15, 2, 10);

insertActivity.run(2, 'Variables Assignment', 'assignment', JSON.stringify({
  instructions: 'Complete the following coding exercises about variables and data types.',
  tasks: [
    'Declare a constant called `PI` and assign it the value 3.14159',
    'Create a variable `greeting` using `let` and assign it "Hello, World!"',
    'Create an object `person` with properties: name, age, and isStudent',
    'Create an array `colors` with at least 5 color names'
  ],
  starterCode: '// Exercise 1: Declare PI\n\n// Exercise 2: Create greeting\n\n// Exercise 3: Create person object\n\n// Exercise 4: Create colors array\n'
}), 25, 3, 20);

// ---- React Course Activities ----
// Module 5 (React Basics)
insertActivity.run(5, 'Introduction to React', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM',
  description: 'What is React and why should you learn it?'
}), 20, 1, 10);

insertActivity.run(5, 'Understanding JSX', 'reading', JSON.stringify({
  body: `# JSX — JavaScript XML\n\nJSX lets you write HTML-like syntax inside JavaScript:\n\n\`\`\`jsx\nconst element = <h1>Hello, world!</h1>;\n\nfunction Welcome({ name }) {\n  return <p>Welcome, {name}!</p>;\n}\n\`\`\`\n\n## Key Rules\n1. Return a single root element\n2. Close all tags\n3. Use camelCase for attributes (\`className\`, not \`class\`)\n4. Use curly braces for JavaScript expressions`
}), 15, 2, 10);

insertActivity.run(5, 'Your First Component', 'interactive', JSON.stringify({
  instructions: 'Build your first React component step by step.',
  steps: [
    { title: 'Create component file', description: 'Create Greeting.jsx in the components folder', completed: false },
    { title: 'Write the component', description: 'Export a function that returns JSX with a greeting message', completed: false },
    { title: 'Import and use it', description: 'Import your component in App.jsx and render it', completed: false },
    { title: 'Add a prop', description: 'Accept a "name" prop and display it in your greeting', completed: false }
  ]
}), 30, 3, 20);

// ---- Personal Finance Activities (course 6) ----
// Module 14 (Money Mindset) — activity IDs start at 11
insertActivity.run(14, 'Why Financial Literacy Matters', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/4j2emMn7UaI',
  description: 'Understanding why managing money is one of the most important life skills.'
}), 12, 1, 10);

insertActivity.run(14, 'The Psychology of Money', 'reading', JSON.stringify({
  body: `# The Psychology of Money\n\nMost financial decisions aren't made on a spreadsheet — they're made at the dinner table, under stress, or on impulse.\n\n## Key Concepts\n\n### 1. Compound Interest\nAlbert Einstein reportedly called it the eighth wonder of the world. If you invest $200/month starting at age 25 with an 8% annual return, you'll have roughly **$700,000** by age 65.\n\n### 2. Lifestyle Inflation\nAs income rises, spending tends to rise with it. The gap between what you earn and what you spend is your **savings rate** — the single most important number in personal finance.\n\n### 3. Loss Aversion\nStudies show losing $100 feels roughly **twice as painful** as gaining $100 feels good. This bias causes people to hold losing investments too long and sell winners too early.\n\n### 4. The Latte Factor\nSmall daily expenses add up. A $5 coffee every workday = **$1,300/year**. That doesn't mean skip the coffee — it means be intentional.\n\n## Action Step\nWrite down your three biggest monthly expenses. Are they aligned with what you value most?`
}), 15, 2, 10);

_qid = insertActivity.run(14, 'Money Mindset Quiz', 'quiz', JSON.stringify({
  description: 'Check your understanding of core financial concepts.'
}), 8, 3, 20);

// Quiz questions for Money Mindset quiz (activity 13)
insertQuestion.run(_qid, 'What is compound interest?', JSON.stringify([
  'Interest charged on late payments',
  'Interest earned on both principal and accumulated interest',
  'A fixed interest rate set by the government',
  'Interest that decreases over time'
]), 1, 'Compound interest means you earn interest on your interest, creating exponential growth over time.');

insertQuestion.run(_qid, 'What is the "savings rate"?', JSON.stringify([
  'The interest rate on a savings account',
  'The percentage of income you save',
  'The rate at which prices increase',
  'The federal reserve rate'
]), 1, 'Your savings rate is the gap between what you earn and what you spend — the most important metric in personal finance.');

insertQuestion.run(_qid, 'If you invest $200/month at 8% return starting at 25, approximately how much will you have at 65?', JSON.stringify([
  '$96,000',
  '$250,000',
  '$700,000',
  '$1,500,000'
]), 2, 'Thanks to compound interest, $200/month over 40 years at 8% grows to roughly $700,000.');

insertQuestion.run(_qid, 'What is lifestyle inflation?', JSON.stringify([
  'Rising prices due to the economy',
  'Spending more as income increases',
  'Inflating your resume',
  'Buying luxury items on credit'
]), 1, 'Lifestyle inflation (lifestyle creep) is the tendency to spend more whenever income rises, keeping savings flat.');

// Module 15 (Budgeting)
insertActivity.run(15, 'The 50/30/20 Budget Rule', 'reading', JSON.stringify({
  body: `# The 50/30/20 Budget Rule\n\nA simple framework popularized by Senator Elizabeth Warren:\n\n| Category | % of Take-Home Pay | Examples |\n|----------|-------------------|----------|\n| **Needs** | 50% | Rent, groceries, insurance, minimum debt payments |\n| **Wants** | 30% | Dining out, entertainment, subscriptions, travel |\n| **Savings** | 20% | Emergency fund, retirement, investments, extra debt payments |\n\n## How to Apply It\n\n1. **Calculate your take-home pay** (after taxes)\n2. **List all expenses** from last 3 months\n3. **Categorize each** as need, want, or savings\n4. **Adjust** until you hit the 50/30/20 split\n\n## Example: $4,000/month take-home\n- Needs: $2,000 (rent $1,200 + groceries $400 + insurance $200 + utilities $200)\n- Wants: $1,200 (dining $300 + entertainment $200 + subscriptions $100 + shopping $600)\n- Savings: $800 (retirement $500 + emergency fund $300)\n\n## Tips\n- If you live in a high-cost area, needs might be 60%. That's okay — adjust wants down.\n- Automate your savings. Transfer 20% the day you get paid.\n- Review and adjust monthly.`
}), 15, 1, 10);

insertActivity.run(15, 'Build Your Budget', 'interactive', JSON.stringify({
  instructions: 'Follow these steps to create your personal budget using the 50/30/20 framework.',
  steps: [
    { title: 'Calculate take-home pay', description: 'Determine your monthly income after taxes and deductions', completed: false },
    { title: 'Track recent spending', description: 'Review bank/credit card statements from the last 3 months', completed: false },
    { title: 'Categorize expenses', description: 'Sort every expense into Needs, Wants, or Savings', completed: false },
    { title: 'Calculate percentages', description: 'Calculate what % of income goes to each category', completed: false },
    { title: 'Set target amounts', description: 'Set monthly targets for each category based on 50/30/20', completed: false },
    { title: 'Automate savings', description: 'Set up an automatic transfer for your savings goal on payday', completed: false }
  ]
}), 30, 2, 20);

// Module 16 (Saving & Emergency Fund)
insertActivity.run(16, 'Building an Emergency Fund', 'reading', JSON.stringify({
  body: `# Building an Emergency Fund\n\nAn emergency fund is cash set aside for unexpected expenses — job loss, medical bills, car repairs.\n\n## How Much Do You Need?\n\n| Situation | Recommended |\n|-----------|-------------|\n| Single, stable job | 3 months of expenses |\n| Family or variable income | 6 months of expenses |\n| Self-employed / freelancer | 9-12 months of expenses |\n\n## Where to Keep It\n- **High-yield savings account** (HYSA) — earns 4-5% APY\n- Keep it separate from your checking account to avoid temptation\n- Should be accessible within 1-2 business days\n\n## How to Build It\n1. Set a target (e.g., $10,000)\n2. Break it into milestones ($1,000 → $2,500 → $5,000 → $10,000)\n3. Automate a fixed amount each paycheck\n4. Use windfalls (tax refunds, bonuses) to accelerate\n\n## What Counts as an Emergency?\n- Job loss or income reduction\n- Medical or dental emergencies\n- Essential home or car repairs\n- NOT: vacations, sales, or upgrades`
}), 12, 1, 10);

insertActivity.run(16, 'Emergency Fund Assignment', 'assignment', JSON.stringify({
  instructions: 'Calculate your personal emergency fund target and create a savings plan.',
  tasks: [
    'List your essential monthly expenses (rent, food, insurance, transport, utilities, minimum debt payments)',
    'Calculate total monthly essential expenses',
    'Multiply by your target months (3, 6, or 9-12 depending on situation)',
    'Determine how much you can save per month toward this goal',
    'Calculate how many months it will take to reach your target',
    'Identify one expense you can cut or reduce to speed up the timeline'
  ],
  starterCode: 'Monthly Essential Expenses:\n- Rent/Mortgage: $\n- Groceries: $\n- Insurance: $\n- Transportation: $\n- Utilities: $\n- Minimum Debt Payments: $\n\nTotal Monthly Essentials: $\nTarget Months: \nEmergency Fund Goal: $\n\nMonthly Savings Amount: $\nMonths to Goal: \n\nExpense to Cut/Reduce:\nNew Monthly Savings: $\nNew Months to Goal: '
}), 25, 2, 20);

// ---- Stock Market Activities (course 7) ----
// Module 18 (How the Stock Market Works)
insertActivity.run(18, 'Stock Market Explained', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/p7HKvqRI_Bo',
  description: 'A clear explanation of how the stock market works, from exchanges to your portfolio.'
}), 18, 1, 10);

insertActivity.run(18, 'Key Market Concepts', 'reading', JSON.stringify({
  body: `# How the Stock Market Works\n\n## What is a Stock?\nA stock represents **partial ownership** in a company. When you buy 10 shares of a company that has 1,000,000 shares, you own 0.001% of that business.\n\n## Stock Exchanges\n- **NYSE** (New York Stock Exchange) — largest in the world by market cap\n- **NASDAQ** — tech-heavy, fully electronic\n- **LSE**, **TSE**, **BSE** — other major global exchanges\n\n## Key Terms\n| Term | Meaning |\n|------|--------|\n| **Market Cap** | Share price x total shares outstanding |\n| **Dividend** | Cash payment to shareholders from company profits |\n| **P/E Ratio** | Price per share / earnings per share — measures if stock is "expensive" |\n| **Bull Market** | Prices rising (optimism) |\n| **Bear Market** | Prices falling 20%+ from peak (pessimism) |\n| **Index** | A basket of stocks representing a market segment (S&P 500, Dow Jones) |\n\n## Order Types\n1. **Market Order** — Buy/sell immediately at current price\n2. **Limit Order** — Buy/sell only at your specified price or better\n3. **Stop-Loss** — Automatically sell if price drops to a certain level\n\n## Important Principle\n**Time in the market beats timing the market.** The S&P 500 has returned about 10% annually over the long term, despite crashes and corrections.`
}), 20, 2, 10);

// activity id 20
_qid = insertActivity.run(18, 'Stock Market Basics Quiz', 'quiz', JSON.stringify({
  description: 'Test your understanding of stock market fundamentals.'
}), 10, 3, 20);

insertQuestion.run(_qid, 'What does owning a stock represent?', JSON.stringify([
  'A loan to the company',
  'Partial ownership of the company',
  'A guaranteed return on investment',
  'A government bond'
]), 1, 'Stocks represent partial ownership (equity) in a company.');

insertQuestion.run(_qid, 'What is a P/E ratio?', JSON.stringify([
  'Profit / Expenses',
  'Price / Equity',
  'Price per share / Earnings per share',
  'Performance / Efficiency'
]), 2, 'The P/E ratio divides the stock price by earnings per share. A high P/E might mean the stock is overvalued or that investors expect high growth.');

insertQuestion.run(_qid, 'What is a bear market?', JSON.stringify([
  'A market with high trading volume',
  'A market with prices rising 20%+',
  'A market with prices falling 20%+ from peak',
  'A market that only trades commodities'
]), 2, 'A bear market is a decline of 20% or more from recent highs, usually accompanied by negative sentiment.');

insertQuestion.run(_qid, 'Which order type executes immediately at the current market price?', JSON.stringify([
  'Limit order',
  'Stop-loss order',
  'Market order',
  'Trailing stop'
]), 2, 'A market order buys or sells immediately at the best available price.');

// Module 19 (Reading Financial Statements)
insertActivity.run(19, 'Understanding the Income Statement', 'reading', JSON.stringify({
  body: `# The Income Statement (P&L)\n\nThe income statement shows how much money a company made or lost over a period (quarter or year).\n\n## Structure\n\n\`\`\`\nRevenue (Sales)                    $10,000,000\n- Cost of Goods Sold (COGS)         -$4,000,000\n= Gross Profit                       $6,000,000\n- Operating Expenses                 -$3,000,000\n  (Salaries, rent, marketing, R&D)\n= Operating Income (EBIT)            $3,000,000\n- Interest Expense                     -$200,000\n- Taxes                                -$700,000\n= Net Income                         $2,100,000\n\`\`\`\n\n## Key Metrics\n- **Gross Margin** = Gross Profit / Revenue (60% above — healthy)\n- **Operating Margin** = Operating Income / Revenue (30% above — strong)\n- **Net Margin** = Net Income / Revenue (21% above — solid)\n\n## What to Look For\n1. **Revenue growth** — Is the company growing year-over-year?\n2. **Margin trends** — Are margins improving or declining?\n3. **One-time items** — Exclude non-recurring charges for a clearer picture\n4. **Comparison** — Compare margins to industry peers`
}), 20, 1, 15);

insertActivity.run(19, 'Balance Sheet Basics', 'reading', JSON.stringify({
  body: `# The Balance Sheet\n\nA snapshot of what a company **owns** and **owes** at a specific point in time.\n\n## The Fundamental Equation\n\n**Assets = Liabilities + Shareholders' Equity**\n\n## Structure\n\n### Assets (What the company owns)\n- **Current Assets**: Cash, accounts receivable, inventory (convertible to cash within 1 year)\n- **Non-Current Assets**: Property, equipment, patents, goodwill\n\n### Liabilities (What the company owes)\n- **Current Liabilities**: Accounts payable, short-term debt, accrued expenses\n- **Non-Current Liabilities**: Long-term debt, lease obligations, pension liabilities\n\n### Shareholders' Equity\n- Common stock + Retained earnings (accumulated profits not paid as dividends)\n\n## Key Ratios\n| Ratio | Formula | Meaning |\n|-------|---------|--------|\n| Current Ratio | Current Assets / Current Liabilities | Can the company pay short-term debts? (>1.5 is healthy) |\n| Debt-to-Equity | Total Debt / Shareholders' Equity | How leveraged is the company? (<1 is conservative) |\n| Book Value | Total Assets - Total Liabilities | Net worth of the company |`
}), 20, 2, 15);

// ---- Financial Modeling Activities (course 8) ----
// Module 21 (Excel for Finance)
insertActivity.run(21, 'Essential Excel Functions for Finance', 'reading', JSON.stringify({
  body: `# Excel Functions Every Finance Professional Needs\n\n## Core Functions\n\n### Time Value of Money\n- **=PV(rate, nper, pmt)** — Present Value\n- **=FV(rate, nper, pmt)** — Future Value\n- **=NPV(rate, value1, value2, ...)** — Net Present Value\n- **=IRR(values)** — Internal Rate of Return\n- **=PMT(rate, nper, pv)** — Loan payment amount\n\n### Lookup & Reference\n- **=VLOOKUP / =XLOOKUP** — Find data in tables\n- **=INDEX(MATCH())** — Flexible alternative to VLOOKUP\n\n### Logical\n- **=IF(condition, true, false)** — Conditional logic\n- **=SUMIFS(range, criteria_range, criteria)** — Conditional summing\n\n### Financial Modeling Specific\n- **=XNPV(rate, values, dates)** — NPV with specific dates\n- **=XIRR(values, dates)** — IRR with specific dates\n- **=EOMONTH(start, months)** — End of month dates\n\n## Keyboard Shortcuts\n| Shortcut | Action |\n|----------|--------|\n| Ctrl+Shift+4 | Format as currency |\n| Ctrl+Shift+5 | Format as percentage |\n| F4 | Toggle absolute references ($A$1) |\n| Alt+= | AutoSum |\n| Ctrl+~ | Show formulas |`
}), 20, 1, 15);

insertActivity.run(21, 'Build a Loan Calculator', 'assignment', JSON.stringify({
  instructions: 'Create a loan amortization calculator using the formulas you learned.',
  tasks: [
    'Set up input cells for: Loan Amount, Annual Interest Rate, Loan Term (years)',
    'Calculate monthly payment using the PMT formula',
    'Build an amortization table with columns: Month, Payment, Principal, Interest, Balance',
    'Add a summary showing Total Interest Paid and Total Amount Paid',
    'Create a chart showing how principal vs interest changes over time'
  ],
  starterCode: 'Loan Calculator Setup:\n\nInputs:\n  Loan Amount: $250,000\n  Annual Rate: 6.5%\n  Term: 30 years\n\nCalculations:\n  Monthly Rate = Annual Rate / 12 = \n  Total Payments = Term * 12 = \n  Monthly Payment = PMT(rate, nper, pv) = \n\nAmortization Table:\n  Month | Payment | Principal | Interest | Remaining Balance\n  1     |         |           |          |\n  2     |         |           |          |\n  ...   |         |           |          |'
}), 40, 2, 25);

// ---- Crypto Activities (course 9) ----
// Module 23 (Blockchain Basics)
insertActivity.run(23, 'What is Blockchain?', 'reading', JSON.stringify({
  body: `# Blockchain Technology Explained\n\nA blockchain is a **decentralized, distributed ledger** that records transactions across a network of computers.\n\n## How It Works\n\n1. **Transaction** — Alice sends 1 BTC to Bob\n2. **Broadcasting** — The transaction is broadcast to the network\n3. **Validation** — Network nodes verify the transaction\n4. **Block Creation** — Valid transactions are grouped into a block\n5. **Consensus** — The network agrees on the block (Proof of Work or Proof of Stake)\n6. **Chain Addition** — The block is added to the chain, permanently\n\n## Key Properties\n\n| Property | Description |\n|----------|-------------|\n| **Decentralized** | No single authority controls the network |\n| **Immutable** | Once recorded, data cannot be altered |\n| **Transparent** | All transactions are publicly visible |\n| **Trustless** | No need to trust a central intermediary |\n\n## Consensus Mechanisms\n- **Proof of Work (PoW)** — Miners solve complex puzzles (Bitcoin). High energy cost.\n- **Proof of Stake (PoS)** — Validators stake tokens to verify (Ethereum 2.0). Energy efficient.\n\n## Beyond Cryptocurrency\n- Supply chain tracking\n- Digital identity verification\n- Smart contracts and DeFi\n- NFTs and digital ownership`
}), 18, 1, 10);

_qid = insertActivity.run(23, 'Blockchain Concepts Quiz', 'quiz', JSON.stringify({
  description: 'Test your understanding of blockchain fundamentals.'
}), 10, 2, 20);

// activity 26
insertQuestion.run(_qid, 'What is a blockchain?', JSON.stringify([
  'A centralized database managed by banks',
  'A decentralized distributed ledger',
  'A programming language',
  'An encryption algorithm'
]), 1, 'A blockchain is a decentralized, distributed ledger that records transactions across many computers.');

insertQuestion.run(_qid, 'What makes blockchain "immutable"?', JSON.stringify([
  'It runs very fast',
  'It is encrypted',
  'Once data is recorded, it cannot be altered',
  'It is stored in the cloud'
]), 2, 'Immutability means that once a transaction is confirmed and added to a block, it cannot be changed or deleted.');

insertQuestion.run(_qid, 'Which consensus mechanism does Bitcoin use?', JSON.stringify([
  'Proof of Stake',
  'Proof of Work',
  'Delegated Proof of Stake',
  'Proof of Authority'
]), 1, 'Bitcoin uses Proof of Work (PoW), where miners compete to solve complex mathematical puzzles.');

// ---- Accounting Activities (course 10) ----
// Module 25 (Accounting Equation)
insertActivity.run(25, 'The Foundation of Accounting', 'reading', JSON.stringify({
  body: `# The Accounting Equation\n\n## The Golden Rule\n\n**Assets = Liabilities + Equity**\n\nEvery transaction in business must keep this equation balanced.\n\n## Definitions\n\n- **Assets** — Resources owned by the business (cash, equipment, inventory, receivables)\n- **Liabilities** — Obligations owed to others (loans, payables, bonds)\n- **Equity** — The owner's residual interest (what's left after paying all debts)\n\n## Examples\n\n### Starting a Business\nYou invest $50,000 of your own money:\n- Assets (Cash): +$50,000\n- Equity: +$50,000\n- Equation: $50,000 = $0 + $50,000 ✓\n\n### Taking a Loan\nYou borrow $20,000 from a bank:\n- Assets (Cash): +$20,000 → now $70,000\n- Liabilities: +$20,000\n- Equation: $70,000 = $20,000 + $50,000 ✓\n\n### Buying Equipment\nYou buy equipment for $15,000 cash:\n- Assets (Cash): -$15,000, Assets (Equipment): +$15,000\n- Net change to assets: $0\n- Equation: $70,000 = $20,000 + $50,000 ✓\n\nThe equation always balances. This is the fundamental principle behind double-entry bookkeeping.`
}), 15, 1, 10);

insertActivity.run(25, 'Accounting Equation Practice', 'interactive', JSON.stringify({
  instructions: 'Work through these transactions and verify the accounting equation balances after each one.',
  steps: [
    { title: 'Owner invests $100,000 cash', description: 'Record: Assets (Cash +$100K), Equity +$100K. Does it balance?', completed: false },
    { title: 'Business borrows $30,000', description: 'Record: Assets (Cash +$30K), Liabilities +$30K. New totals?', completed: false },
    { title: 'Purchase inventory for $20,000 cash', description: 'Record: Assets (Cash -$20K, Inventory +$20K). Net asset change?', completed: false },
    { title: 'Sell inventory (cost $5,000) for $8,000 cash', description: 'Record: Assets (Cash +$8K, Inventory -$5K), Equity +$3K (profit). Balance?', completed: false },
    { title: 'Pay $2,000 toward the loan', description: 'Record: Assets (Cash -$2K), Liabilities -$2K. Final balances?', completed: false }
  ]
}), 25, 2, 20);

// Module 26 (Reading Financial Reports)
insertActivity.run(26, 'Cash Flow Statement', 'reading', JSON.stringify({
  body: `# The Cash Flow Statement\n\nThe cash flow statement shows how cash moves in and out of a business. It answers: **Where did the money come from, and where did it go?**\n\n## Three Sections\n\n### 1. Operating Activities\nCash from day-to-day business:\n- Cash received from customers\n- Cash paid to suppliers and employees\n- Interest and taxes paid\n\n### 2. Investing Activities\nCash used for long-term assets:\n- Buying/selling equipment or property\n- Buying/selling investments\n- Acquisitions\n\n### 3. Financing Activities\nCash from investors and lenders:\n- Issuing stock\n- Borrowing or repaying loans\n- Paying dividends\n\n## Why It Matters\n\nA company can report **positive net income but negative cash flow**. This happens when:\n- Customers haven't paid yet (accounts receivable rising)\n- Company is stockpiling inventory\n- Aggressive revenue recognition\n\n**Cash is fact. Profit is opinion.** Always check the cash flow statement alongside the income statement.\n\n## Free Cash Flow\n**FCF = Operating Cash Flow − Capital Expenditures**\n\nThis is the cash left over after maintaining operations — what's truly available for shareholders.`
}), 18, 1, 15);

// ===========================================================================
// NEW ACTIVITIES FOR MODULES THAT WERE EMPTY
// Existing activity IDs: 1-29. New activities start at ID 30.
// ===========================================================================

// New activities for Module 3 (JS: Functions & Scope) — activity IDs start at 30
insertActivity.run(3, 'Understanding Functions', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/FOD408a0EzU',
  description: 'Learn how to declare and invoke functions, including function expressions, arrow functions, and default parameters.'
}), 18, 1, 10); // activity 30

insertActivity.run(3, 'Scope and Closures', 'reading', JSON.stringify({
  body: `# Scope and Closures in JavaScript\n\n## What is Scope?\nScope determines where variables are accessible in your code.\n\n### Global Scope\nVariables declared outside any function or block are globally accessible.\n\`\`\`javascript\nconst appName = "MyApp"; // accessible everywhere\n\`\`\`\n\n### Function Scope\nVariables declared with \`var\` inside a function are only accessible within that function.\n\`\`\`javascript\nfunction greet() {\n  var message = "Hello";\n  console.log(message); // works\n}\nconsole.log(message); // ReferenceError\n\`\`\`\n\n### Block Scope\n\`let\` and \`const\` are scoped to the nearest curly braces.\n\`\`\`javascript\nif (true) {\n  let x = 10;\n  const y = 20;\n}\nconsole.log(x); // ReferenceError\n\`\`\`\n\n## Closures\nA closure is a function that remembers the variables from the scope in which it was created, even after that scope has closed.\n\`\`\`javascript\nfunction counter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\nconst increment = counter();\nincrement(); // 1\nincrement(); // 2\n\`\`\`\n\n## The Scope Chain\nWhen JavaScript looks up a variable, it searches:\n1. Local scope\n2. Outer function scope(s)\n3. Global scope\n\nIf not found anywhere, it throws a \`ReferenceError\`.`
}), 15, 2, 10); // activity 31

// activity 32 = quiz
_qid = insertActivity.run(3, 'Functions & Scope Quiz', 'quiz', JSON.stringify({
  description: 'Test your understanding of JavaScript functions, scope, and closures.'
}), 10, 3, 20); // activity 32

insertQuestion.run(_qid, 'What is the difference between a function declaration and a function expression?', JSON.stringify([
  'There is no difference',
  'Declarations are hoisted; expressions are not',
  'Expressions are faster',
  'Declarations cannot accept parameters'
]), 1, 'Function declarations are hoisted to the top of their scope, so they can be called before they appear in the code. Function expressions are not hoisted.');

insertQuestion.run(_qid, 'What will `let` variables declared inside a for loop be accessible from?', JSON.stringify([
  'Anywhere in the file',
  'The entire function',
  'Only within the for loop block',
  'The global scope'
]), 2, '`let` is block-scoped, so a variable declared inside a for loop is only accessible within that loop\'s curly braces.');

insertQuestion.run(_qid, 'What is a closure?', JSON.stringify([
  'A way to close a browser window with JavaScript',
  'A function that retains access to its outer scope variables after the outer function returns',
  'A method to prevent memory leaks',
  'A special type of loop'
]), 1, 'A closure is a function bundled together with references to its surrounding (lexical) scope, allowing it to access those variables even after the outer function has finished executing.');

insertQuestion.run(_qid, 'What does an arrow function NOT have that a regular function does?', JSON.stringify([
  'Parameters',
  'A return value',
  'Its own `this` binding',
  'The ability to be called'
]), 2, 'Arrow functions do not have their own `this` context. They inherit `this` from the enclosing lexical scope.');

insertActivity.run(3, 'Functions Practice Assignment', 'assignment', JSON.stringify({
  instructions: 'Complete these exercises to practice writing functions and understanding scope.',
  tasks: [
    'Write a function `multiply(a, b)` that returns the product. Provide a default value of 1 for `b`.',
    'Convert the following function declaration to an arrow function: function add(x, y) { return x + y; }',
    'Write a function `createGreeter(greeting)` that returns a new function accepting a `name` and logging the full greeting. This demonstrates closures.',
    'Write a function `calculateTax(income, rate)` where rate defaults to 0.2. Use block-scoped variables only.',
    'Explain in a comment why the following code logs `undefined`: var x = 1; function test() { console.log(x); var x = 2; }'
  ],
  starterCode: '// Exercise 1: multiply with default parameter\n\n// Exercise 2: arrow function conversion\n\n// Exercise 3: createGreeter closure\n\n// Exercise 4: calculateTax with block scope\n\n// Exercise 5: hoisting explanation\n'
}), 25, 4, 20); // activity 33

// New activities for Module 4 (JS: Objects & Arrays) — activity IDs start at 34
insertActivity.run(4, 'Working with Objects', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/napDjGFjHR0',
  description: 'Deep dive into JavaScript objects — creation, property access, methods, destructuring, and the spread operator.'
}), 20, 1, 10); // activity 34

insertActivity.run(4, 'Arrays and Iteration Methods', 'reading', JSON.stringify({
  body: `# Arrays and Iteration Methods\n\n## Creating Arrays\n\`\`\`javascript\nconst fruits = ["apple", "banana", "cherry"];\nconst numbers = Array.from({ length: 5 }, (_, i) => i + 1); // [1,2,3,4,5]\n\`\`\`\n\n## Essential Array Methods\n\n### Transforming\n- **map()** — Create a new array by transforming each element\n\`\`\`javascript\nconst doubled = [1, 2, 3].map(n => n * 2); // [2, 4, 6]\n\`\`\`\n\n### Filtering\n- **filter()** — Keep elements that pass a test\n\`\`\`javascript\nconst adults = people.filter(p => p.age >= 18);\n\`\`\`\n\n### Reducing\n- **reduce()** — Accumulate a single value from an array\n\`\`\`javascript\nconst sum = [1, 2, 3, 4].reduce((acc, n) => acc + n, 0); // 10\n\`\`\`\n\n### Searching\n- **find()** — First element matching a condition\n- **findIndex()** — Index of first match\n- **includes()** — Does the array contain a value?\n- **some()** / **every()** — Do some/all elements pass a test?\n\n### Modifying\n- **push() / pop()** — Add/remove from end\n- **unshift() / shift()** — Add/remove from beginning\n- **splice()** — Remove or insert at any index\n- **slice()** — Extract a portion (non-destructive)\n\n## Destructuring\n\`\`\`javascript\nconst [first, second, ...rest] = [10, 20, 30, 40];\n// first = 10, second = 20, rest = [30, 40]\n\`\`\`\n\n## Spread Operator\n\`\`\`javascript\nconst merged = [...arr1, ...arr2];\nconst copy = [...original];\n\`\`\``
}), 18, 2, 10); // activity 35

insertActivity.run(4, 'Object & Array Challenges', 'interactive', JSON.stringify({
  instructions: 'Work through these hands-on challenges in your browser console or Node.js REPL.',
  steps: [
    { title: 'Create a student object', description: 'Create an object with name, grades (array), and a method getAverage() that calculates the average grade', completed: false },
    { title: 'Array transformation', description: 'Given an array of prices [29.99, 9.99, 4.99, 19.99], use map() to add 10% tax to each and filter() to keep only items over $10', completed: false },
    { title: 'Destructuring practice', description: 'Given {name: "Alice", age: 25, city: "NYC", job: "dev"}, use destructuring to extract name and job into variables, and the rest into a "details" object', completed: false },
    { title: 'Reduce challenge', description: 'Use reduce() on an array of objects [{item: "book", price: 15}, {item: "pen", price: 3}] to calculate total price', completed: false },
    { title: 'Nested data', description: 'Create an array of 3 course objects, each with a title and an array of students. Write a function to find all students across all courses using flatMap()', completed: false }
  ]
}), 30, 3, 15); // activity 36

// activity 37 = quiz
_qid = insertActivity.run(4, 'Objects & Arrays Quiz', 'quiz', JSON.stringify({
  description: 'Test your knowledge of JavaScript objects and array methods.'
}), 10, 4, 20); // activity 37

insertQuestion.run(_qid, 'What does Array.prototype.map() return?', JSON.stringify([
  'The original array, modified',
  'A single accumulated value',
  'A new array with transformed elements',
  'undefined'
]), 2, 'map() always returns a new array of the same length, with each element transformed by the callback function. It does not mutate the original array.');

insertQuestion.run(_qid, 'How do you access a property called "first name" (with a space) on an object?', JSON.stringify([
  'obj.first name',
  'obj["first name"]',
  'obj.firstName',
  'obj->first name'
]), 1, 'When a property name contains spaces or special characters, you must use bracket notation: obj["first name"].');

insertQuestion.run(_qid, 'What is the difference between slice() and splice()?', JSON.stringify([
  'They are identical',
  'slice() mutates the original array; splice() does not',
  'slice() returns a copy of a portion without mutating; splice() modifies the original array',
  'splice() only works on strings'
]), 2, 'slice() is non-destructive and returns a shallow copy of a portion. splice() mutates the original array by removing or inserting elements.');

// New activities for Module 6 (React: State & Props) — activity IDs start at 38
insertActivity.run(6, 'State and Props Explained', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/IYvD9oBCuJI',
  description: 'Understand the difference between state and props, one-way data flow, and how to lift state up in React applications.'
}), 20, 1, 10); // activity 38

insertActivity.run(6, 'Managing Data in React', 'reading', JSON.stringify({
  body: `# State and Props in React\n\n## Props (Properties)\nProps are **read-only data passed from parent to child** components.\n\`\`\`jsx\n// Parent\n<UserCard name="Alice" role="admin" />\n\n// Child\nfunction UserCard({ name, role }) {\n  return <div>{name} — {role}</div>;\n}\n\`\`\`\n\n### Props Rules\n- Props flow **one direction**: parent to child\n- Props are **immutable** — a child cannot modify its own props\n- Use props for configuration, data passing, and callbacks\n\n## State\nState is **mutable data managed within a component**.\n\`\`\`jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\`\`\`\n\n### State Rules\n- Always use the setter function (never mutate directly)\n- State updates may be **asynchronous** and are **batched**\n- State updates trigger a **re-render** of the component\n\n## Lifting State Up\nWhen two sibling components need to share data, move the state to their common parent and pass it down as props.\n\`\`\`jsx\nfunction App() {\n  const [user, setUser] = useState(null);\n  return (\n    <>\n      <LoginForm onLogin={setUser} />\n      <Dashboard user={user} />\n    </>\n  );\n}\n\`\`\`\n\n## Props vs State\n| | Props | State |\n|---|---|---|\n| Owned by | Parent | Component itself |\n| Mutable? | No | Yes (via setter) |\n| Triggers re-render? | When parent re-renders | When updated |`
}), 18, 2, 10); // activity 39

insertActivity.run(6, 'State & Props Assignment', 'assignment', JSON.stringify({
  instructions: 'Build a small React app that demonstrates state and props working together.',
  tasks: [
    'Create a `TodoApp` component that holds an array of todos in state',
    'Create a `TodoForm` child component that accepts an `onAddTodo` callback prop and has local state for the input field',
    'Create a `TodoList` child component that accepts `todos` as a prop and renders each one',
    'Create a `TodoItem` child component that accepts a `todo` object and an `onToggle` callback prop',
    'Implement a "completed" toggle: clicking a todo should update the state in the parent (lift state up)',
    'Add a counter at the top showing "X of Y completed" using derived data from state'
  ],
  starterCode: '// TodoApp.jsx\nimport { useState } from "react";\n\nfunction TodoApp() {\n  const [todos, setTodos] = useState([]);\n\n  const addTodo = (text) => {\n    // Add new todo to state\n  };\n\n  const toggleTodo = (id) => {\n    // Toggle completed status\n  };\n\n  return (\n    <div>\n      {/* Counter */}\n      {/* TodoForm */}\n      {/* TodoList */}\n    </div>\n  );\n}\n'
}), 35, 3, 25); // activity 40

// New activities for Module 7 (React: Hooks & Effects) — activity IDs start at 41
insertActivity.run(7, 'React Hooks Deep Dive', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q',
  description: 'Master useState, useEffect, useRef, useMemo, and useCallback — the essential React hooks for building modern applications.'
}), 22, 1, 10); // activity 41

insertActivity.run(7, 'useEffect and Side Effects', 'reading', JSON.stringify({
  body: `# React Hooks: useEffect and Beyond\n\n## useEffect\nThe \`useEffect\` hook lets you perform side effects in function components — data fetching, subscriptions, DOM manipulation, and timers.\n\n### Basic Syntax\n\`\`\`jsx\nuseEffect(() => {\n  // Side effect code\n  return () => {\n    // Cleanup (optional)\n  };\n}, [dependencies]);\n\`\`\`\n\n### Dependency Array Patterns\n| Pattern | Runs When |\n|---------|----------|\n| \`useEffect(() => {}, [])\` | Once, after first render (mount) |\n| \`useEffect(() => {}, [count])\` | When \`count\` changes |\n| \`useEffect(() => {})\` | After every render (rarely wanted) |\n\n### Example: Fetching Data\n\`\`\`jsx\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    setLoading(true);\n    fetch(\`/api/users/\${userId}\`)\n      .then(res => res.json())\n      .then(data => {\n        setUser(data);\n        setLoading(false);\n      });\n  }, [userId]); // Re-fetch when userId changes\n\n  if (loading) return <p>Loading...</p>;\n  return <h1>{user.name}</h1>;\n}\n\`\`\`\n\n## Cleanup\nReturn a function from useEffect to clean up subscriptions, timers, or event listeners:\n\`\`\`jsx\nuseEffect(() => {\n  const timer = setInterval(() => tick(), 1000);\n  return () => clearInterval(timer); // cleanup\n}, []);\n\`\`\`\n\n## Other Essential Hooks\n- **useRef** — Persist a value across renders without triggering re-render\n- **useMemo** — Memoize expensive computations\n- **useCallback** — Memoize functions to prevent unnecessary child re-renders\n- **useContext** — Access context values without prop drilling`
}), 20, 2, 10); // activity 42

// activity 43 = quiz
_qid = insertActivity.run(7, 'Hooks & Effects Quiz', 'quiz', JSON.stringify({
  description: 'Test your understanding of React hooks and the useEffect lifecycle.'
}), 10, 3, 20); // activity 43

insertQuestion.run(_qid, 'What does passing an empty dependency array [] to useEffect do?', JSON.stringify([
  'The effect runs after every render',
  'The effect never runs',
  'The effect runs only once after the first render',
  'The effect runs before the component mounts'
]), 2, 'An empty dependency array tells React to run the effect only once, after the initial render (similar to componentDidMount).');

insertQuestion.run(_qid, 'What is the cleanup function in useEffect used for?', JSON.stringify([
  'Deleting the component from the DOM',
  'Clearing state variables',
  'Removing subscriptions, timers, or event listeners to prevent memory leaks',
  'Resetting the virtual DOM'
]), 2, 'The cleanup function runs before the component unmounts and before the effect re-runs. It is used to clean up subscriptions, timers, and other resources.');

insertQuestion.run(_qid, 'When should you use useMemo?', JSON.stringify([
  'For every variable in your component',
  'When you need to memoize an expensive computation that should not re-run on every render',
  'To replace useState',
  'Only inside class components'
]), 1, 'useMemo is used to memoize expensive calculations so they only recompute when their dependencies change, not on every render.');

insertQuestion.run(_qid, 'What is the key rule of React hooks?', JSON.stringify([
  'Hooks can be called inside loops and conditions',
  'Hooks must be called at the top level of a component or custom hook',
  'Hooks can only be used in class components',
  'Hooks must return JSX'
]), 1, 'Hooks must always be called at the top level — never inside loops, conditions, or nested functions. This ensures consistent hook call order across renders.');

// New activities for Module 8 (Data Science: Python for DS) — activity IDs start at 44
insertActivity.run(8, 'Python for Data Science Overview', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/LHBE6Q9XlzI',
  description: 'Introduction to Python as a data science language — why Python, key libraries, and setting up Jupyter Notebooks.'
}), 20, 1, 10); // activity 44

insertActivity.run(8, 'NumPy Fundamentals', 'reading', JSON.stringify({
  body: `# NumPy Fundamentals\n\nNumPy is the foundation of scientific computing in Python. It provides fast, memory-efficient multidimensional arrays and mathematical operations.\n\n## Why NumPy?\n- **Speed** — NumPy arrays are up to 50x faster than Python lists for numerical operations\n- **Memory** — Stores data in contiguous memory blocks\n- **Broadcasting** — Perform operations on arrays of different shapes\n\n## Creating Arrays\n\`\`\`python\nimport numpy as np\n\na = np.array([1, 2, 3, 4, 5])          # 1D array\nb = np.zeros((3, 4))                    # 3x4 matrix of zeros\nc = np.ones((2, 3))                     # 2x3 matrix of ones\nd = np.arange(0, 10, 2)                 # [0, 2, 4, 6, 8]\ne = np.linspace(0, 1, 5)                # 5 evenly spaced values from 0 to 1\nf = np.random.randn(3, 3)               # 3x3 matrix of random normal values\n\`\`\`\n\n## Key Operations\n\`\`\`python\narr = np.array([10, 20, 30, 40, 50])\narr.mean()         # 30.0\narr.std()          # 14.14\narr.sum()          # 150\narr.max()          # 50\narr.reshape(5, 1)  # Column vector\n\`\`\`\n\n## Indexing and Slicing\n\`\`\`python\nmatrix = np.array([[1,2,3],[4,5,6],[7,8,9]])\nmatrix[0, :]       # First row: [1, 2, 3]\nmatrix[:, 1]       # Second column: [2, 5, 8]\nmatrix[1:, :2]     # Rows 1-2, Cols 0-1: [[4,5],[7,8]]\n\`\`\`\n\n## Broadcasting\nNumPy automatically expands smaller arrays to match larger ones:\n\`\`\`python\narr = np.array([1, 2, 3])\narr * 10           # [10, 20, 30] — scalar broadcast\narr + np.array([10, 20, 30])  # [11, 22, 33] — element-wise\n\`\`\``
}), 18, 2, 10); // activity 45

insertActivity.run(8, 'NumPy Hands-On Exercises', 'interactive', JSON.stringify({
  instructions: 'Open a Jupyter Notebook and work through these NumPy exercises.',
  steps: [
    { title: 'Create and inspect arrays', description: 'Create a 1D array of 20 random integers between 1 and 100. Print the shape, dtype, mean, and standard deviation.', completed: false },
    { title: 'Reshaping', description: 'Reshape the 1D array into a 4x5 matrix. Access the element in the 3rd row, 2nd column.', completed: false },
    { title: 'Boolean masking', description: 'From the matrix, create a boolean mask for values > 50 and use it to extract those values into a new array.', completed: false },
    { title: 'Mathematical operations', description: 'Create two 3x3 matrices and perform element-wise addition, multiplication, and matrix multiplication (using @).', completed: false },
    { title: 'Statistical analysis', description: 'Generate 1000 random samples from a normal distribution (mean=100, std=15). Calculate mean, median, and verify ~68% of values fall within one standard deviation.', completed: false }
  ]
}), 30, 3, 15); // activity 46

// New activities for Module 9 (Data Science: Pandas) — activity IDs start at 47
insertActivity.run(9, 'Introduction to Pandas', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg',
  description: 'Learn the core Pandas data structures — Series and DataFrame — and essential operations for data exploration and analysis.'
}), 20, 1, 10); // activity 47

insertActivity.run(9, 'Data Wrangling with Pandas', 'reading', JSON.stringify({
  body: `# Data Wrangling with Pandas\n\nPandas provides high-performance, easy-to-use data structures for data analysis in Python.\n\n## Core Data Structures\n\n### Series (1D)\n\`\`\`python\nimport pandas as pd\ns = pd.Series([10, 20, 30], index=['a', 'b', 'c'])\n\`\`\`\n\n### DataFrame (2D)\n\`\`\`python\ndf = pd.DataFrame({\n    'name': ['Alice', 'Bob', 'Charlie'],\n    'age': [25, 30, 35],\n    'salary': [50000, 60000, 70000]\n})\n\`\`\`\n\n## Reading Data\n\`\`\`python\ndf = pd.read_csv('data.csv')\ndf = pd.read_excel('data.xlsx')\ndf = pd.read_json('data.json')\n\`\`\`\n\n## Exploring Data\n\`\`\`python\ndf.head()          # First 5 rows\ndf.info()          # Column types and non-null counts\ndf.describe()      # Statistical summary\ndf.shape           # (rows, columns)\ndf.columns         # Column names\ndf.dtypes          # Data types\n\`\`\`\n\n## Selecting Data\n\`\`\`python\ndf['name']                    # Single column\ndf[['name', 'age']]           # Multiple columns\ndf.loc[0:2, 'name':'age']     # By label\ndf.iloc[0:3, 0:2]             # By position\n\`\`\`\n\n## Filtering\n\`\`\`python\ndf[df['age'] > 28]                              # Simple filter\ndf[(df['age'] > 25) & (df['salary'] > 55000)]   # Multiple conditions\n\`\`\`\n\n## Handling Missing Data\n\`\`\`python\ndf.isnull().sum()          # Count missing per column\ndf.dropna()                # Drop rows with missing values\ndf.fillna(0)               # Replace missing with 0\ndf['age'].fillna(df['age'].median())  # Fill with median\n\`\`\`\n\n## Grouping and Aggregation\n\`\`\`python\ndf.groupby('department')['salary'].mean()\ndf.groupby('city').agg({'salary': 'mean', 'age': 'max'})\n\`\`\``
}), 20, 2, 10); // activity 48

insertActivity.run(9, 'Pandas Data Analysis Assignment', 'assignment', JSON.stringify({
  instructions: 'Using a dataset of your choice (or create a sample one), complete these data analysis tasks with Pandas.',
  tasks: [
    'Load a CSV file into a DataFrame and display the first 10 rows, shape, and data types',
    'Handle missing data: identify columns with null values, decide on a strategy (drop, fill with mean/median), and apply it',
    'Create at least 3 filtered views of the data using boolean conditions',
    'Use groupby() to calculate aggregated statistics (mean, sum, count) by a categorical column',
    'Add a new calculated column derived from existing columns (e.g., profit margin = profit / revenue)',
    'Sort the DataFrame by two columns and export the cleaned result to a new CSV file'
  ],
  starterCode: 'import pandas as pd\nimport numpy as np\n\n# Step 1: Load data\ndf = pd.read_csv("your_data.csv")\nprint(df.head(10))\nprint(f"Shape: {df.shape}")\nprint(df.dtypes)\n\n# Step 2: Handle missing data\n\n# Step 3: Filtered views\n\n# Step 4: Groupby aggregation\n\n# Step 5: New calculated column\n\n# Step 6: Sort and export\n'
}), 35, 3, 25); // activity 49

// New activities for Module 10 (Node: Node.js Basics) — activity IDs start at 50
insertActivity.run(10, 'What is Node.js?', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4',
  description: 'Understand the Node.js runtime — the event loop, non-blocking I/O, and how JavaScript runs outside the browser.'
}), 18, 1, 10); // activity 50

insertActivity.run(10, 'The Node.js Module System', 'reading', JSON.stringify({
  body: `# The Node.js Module System\n\nNode.js uses a modular architecture where each file is treated as a separate module.\n\n## CommonJS (require/module.exports)\nThe original Node.js module system:\n\`\`\`javascript\n// math.js\nfunction add(a, b) { return a + b; }\nfunction subtract(a, b) { return a - b; }\nmodule.exports = { add, subtract };\n\n// app.js\nconst { add, subtract } = require('./math');\nconsole.log(add(5, 3)); // 8\n\`\`\`\n\n## ES Modules (import/export)\nModern syntax (use \`"type": "module"\` in package.json):\n\`\`\`javascript\n// math.mjs\nexport function add(a, b) { return a + b; }\nexport default function multiply(a, b) { return a * b; }\n\n// app.mjs\nimport multiply, { add } from './math.mjs';\n\`\`\`\n\n## Built-in Modules\n| Module | Purpose |\n|--------|--------|\n| **fs** | File system operations (read, write, delete) |\n| **path** | File path manipulation |\n| **http** | Create HTTP servers |\n| **os** | Operating system information |\n| **events** | Event emitter pattern |\n| **crypto** | Hashing and encryption |\n\n## The Event Loop\nNode.js is **single-threaded** but handles concurrency through the **event loop**:\n1. Execute synchronous code\n2. Check for pending I/O callbacks\n3. Execute timers (setTimeout, setInterval)\n4. Process I/O events\n5. Repeat\n\nThis non-blocking model lets Node handle thousands of concurrent connections efficiently.\n\n## npm (Node Package Manager)\n\`\`\`bash\nnpm init -y                  # Create package.json\nnpm install express          # Install a package\nnpm install -D nodemon       # Install as dev dependency\nnpm run start                # Run a script\n\`\`\``
}), 18, 2, 10); // activity 51

// activity 52 = quiz
_qid = insertActivity.run(10, 'Node.js Basics Quiz', 'quiz', JSON.stringify({
  description: 'Test your understanding of Node.js fundamentals and the module system.'
}), 10, 3, 20); // activity 52

insertQuestion.run(_qid, 'What is the Node.js event loop?', JSON.stringify([
  'A for loop that iterates over events',
  'A mechanism that handles asynchronous operations on a single thread',
  'A multi-threaded task scheduler',
  'A browser API for DOM events'
]), 1, 'The event loop is the core mechanism that allows Node.js to perform non-blocking I/O operations on a single thread by offloading operations to the system kernel when possible.');

insertQuestion.run(_qid, 'Which built-in module is used for file operations in Node.js?', JSON.stringify([
  'http',
  'path',
  'fs',
  'os'
]), 2, 'The `fs` (file system) module provides functions for reading, writing, deleting, and manipulating files and directories.');

insertQuestion.run(_qid, 'What is the difference between require() and import?', JSON.stringify([
  'There is no difference',
  'require() is CommonJS (synchronous); import is ES Modules (can be async)',
  'import only works in browsers',
  'require() is newer and preferred'
]), 1, 'require() is the CommonJS module system (synchronous, default in Node.js), while import/export is the ES Modules standard that supports static analysis and tree-shaking.');

// New activities for Module 11 (Node: Express Framework) — activity IDs start at 53
insertActivity.run(11, 'Getting Started with Express', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/SccSCuHhOw0',
  description: 'Learn to build REST APIs with Express.js — routing, middleware, request/response handling, and project structure.'
}), 22, 1, 10); // activity 53

insertActivity.run(11, 'Express Routing and Middleware', 'reading', JSON.stringify({
  body: `# Express.js: Routing and Middleware\n\n## Setting Up Express\n\`\`\`javascript\nconst express = require('express');\nconst app = express();\n\napp.use(express.json()); // Parse JSON bodies\n\napp.listen(3000, () => console.log('Server on port 3000'));\n\`\`\`\n\n## Routing\nExpress routes match HTTP methods and URL paths:\n\`\`\`javascript\n// GET all users\napp.get('/api/users', (req, res) => {\n  res.json(users);\n});\n\n// GET one user by ID\napp.get('/api/users/:id', (req, res) => {\n  const user = users.find(u => u.id === parseInt(req.params.id));\n  if (!user) return res.status(404).json({ error: 'User not found' });\n  res.json(user);\n});\n\n// POST create a user\napp.post('/api/users', (req, res) => {\n  const { name, email } = req.body;\n  const newUser = { id: Date.now(), name, email };\n  users.push(newUser);\n  res.status(201).json(newUser);\n});\n\n// PUT update a user\napp.put('/api/users/:id', (req, res) => { /* ... */ });\n\n// DELETE a user\napp.delete('/api/users/:id', (req, res) => { /* ... */ });\n\`\`\`\n\n## Middleware\nMiddleware functions run between the request and the response:\n\`\`\`javascript\n// Logger middleware\nfunction logger(req, res, next) {\n  console.log(\`\${req.method} \${req.url} at \${new Date().toISOString()}\`);\n  next(); // Pass control to the next middleware\n}\napp.use(logger);\n\n// Error-handling middleware (4 parameters)\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: 'Something went wrong' });\n});\n\`\`\`\n\n## Router Modules\nOrganize routes into separate files:\n\`\`\`javascript\n// routes/users.js\nconst router = express.Router();\nrouter.get('/', getAllUsers);\nrouter.post('/', createUser);\nmodule.exports = router;\n\n// app.js\napp.use('/api/users', require('./routes/users'));\n\`\`\``
}), 20, 2, 10); // activity 54

insertActivity.run(11, 'Build a REST API Assignment', 'assignment', JSON.stringify({
  instructions: 'Build a complete REST API for a bookstore using Express.js.',
  tasks: [
    'Initialize a new Node.js project and install Express',
    'Create a server that listens on port 3000 with JSON body parsing middleware',
    'Implement CRUD routes for books: GET /api/books, GET /api/books/:id, POST /api/books, PUT /api/books/:id, DELETE /api/books/:id',
    'Each book should have: id, title, author, year, genre, and isbn',
    'Add input validation middleware that checks required fields on POST and PUT requests',
    'Add a custom error-handling middleware that returns proper error responses',
    'Add a GET /api/books?genre=fiction query parameter filter',
    'Test all endpoints using Postman, curl, or a REST client extension'
  ],
  starterCode: 'const express = require("express");\nconst app = express();\napp.use(express.json());\n\nlet books = [\n  { id: 1, title: "The Pragmatic Programmer", author: "David Thomas", year: 1999, genre: "programming", isbn: "978-0135957059" }\n];\n\n// TODO: Implement routes\n\napp.listen(3000, () => console.log("Bookstore API running on port 3000"));\n'
}), 40, 3, 25); // activity 55

// New activities for Module 12 (UI/UX: Design Thinking) — activity IDs start at 56
insertActivity.run(12, 'Introduction to Design Thinking', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/gHGN6hs2gZY',
  description: 'Explore the five stages of design thinking — empathize, define, ideate, prototype, and test — with real-world examples.'
}), 20, 1, 10); // activity 56

insertActivity.run(12, 'The Five Stages of Design Thinking', 'reading', JSON.stringify({
  body: `# The Five Stages of Design Thinking\n\nDesign thinking is a human-centered approach to innovation that draws from the designer's toolkit to integrate the needs of people, the possibilities of technology, and the requirements for business success.\n\n## Stage 1: Empathize\nUnderstand users through observation and engagement.\n- Conduct user interviews\n- Create empathy maps\n- Observe users in their natural context\n- Ask "why" five times to uncover root needs\n\n## Stage 2: Define\nSynthesize your research into a clear problem statement.\n- Create a **Point of View (POV)** statement:\n  "[User] needs to [need] because [insight]"\n- Example: "Busy parents need a way to find healthy meal ideas quickly because they have limited time after work and want to feed their family well."\n\n## Stage 3: Ideate\nGenerate a broad range of possible solutions.\n- **Brainstorming** — Quantity over quality, no judgment\n- **Mind mapping** — Visual exploration of ideas\n- **SCAMPER** — Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse\n- **How Might We...** questions to reframe challenges\n\n## Stage 4: Prototype\nBuild quick, inexpensive representations of ideas.\n- Paper sketches and wireframes\n- Clickable mockups (Figma, Sketch)\n- Physical models or role-playing\n- Rule: build to think, not to impress\n\n## Stage 5: Test\nGather feedback from real users.\n- Observe, don't explain\n- Ask open-ended questions\n- Look for patterns across users\n- Iterate based on findings\n\n## Key Principle\nDesign thinking is **not linear**. You will loop back to earlier stages as you learn more. That is the point.`
}), 18, 2, 10); // activity 57

insertActivity.run(12, 'Design Thinking Workshop', 'interactive', JSON.stringify({
  instructions: 'Apply design thinking to solve a real problem. Pick a frustration you experience daily (e.g., morning routine, commuting, meal planning).',
  steps: [
    { title: 'Empathize', description: 'Interview 2-3 people who share your frustration. Ask about their experience, emotions, and workarounds. Take notes.', completed: false },
    { title: 'Define', description: 'Write a POV statement: "[User] needs to [need] because [insight]." Make it specific and actionable.', completed: false },
    { title: 'Ideate', description: 'Set a 10-minute timer and write down at least 15 ideas. No filtering — even wild ideas are welcome.', completed: false },
    { title: 'Select', description: 'Vote on your top 3 ideas using feasibility (can we build it?), desirability (do users want it?), and viability (is it sustainable?).', completed: false },
    { title: 'Prototype', description: 'Sketch a low-fidelity paper prototype of your best idea. Include 3-5 screens or steps.', completed: false },
    { title: 'Test', description: 'Show your prototype to 2 people. Observe their reactions and note what confused them or delighted them.', completed: false }
  ]
}), 45, 3, 20); // activity 58

// New activities for Module 13 (UI/UX: Wireframing) — activity IDs start at 59
insertActivity.run(13, 'Wireframing Essentials', 'video', JSON.stringify({
  videoUrl: 'https://www.youtube.com/embed/qpH7-KFWZRI',
  description: 'Learn the fundamentals of wireframing — low-fidelity vs high-fidelity, tools, and best practices for creating effective wireframes.'
}), 18, 1, 10); // activity 59

insertActivity.run(13, 'From Wireframe to Prototype', 'reading', JSON.stringify({
  body: `# Wireframing & Prototyping\n\n## What is a Wireframe?\nA wireframe is a **low-fidelity blueprint** of a page or screen. It focuses on:\n- **Layout** — Where elements are positioned\n- **Hierarchy** — What gets attention first\n- **Functionality** — What happens when users interact\n\nWireframes intentionally omit colors, fonts, and images to keep focus on structure.\n\n## Fidelity Levels\n\n| Level | Tools | Purpose |\n|-------|-------|--------|\n| **Low-fi** | Paper, whiteboard | Quick exploration of ideas |\n| **Mid-fi** | Balsamiq, Whimsical | Stakeholder alignment, basic layout |\n| **High-fi** | Figma, Sketch, Adobe XD | Developer handoff, usability testing |\n\n## Wireframe Best Practices\n1. **Start with content** — What information does the user need?\n2. **Use real content** — Avoid "Lorem ipsum" when possible\n3. **Annotate** — Explain interactions and logic\n4. **Design for mobile first** — Then scale up to tablet and desktop\n5. **Use a grid system** — 8pt or 12-column grid for consistency\n\n## From Wireframe to Prototype\nA prototype adds **interactivity** to wireframes:\n- Clickable navigation between screens\n- Hover states and transitions\n- Form interactions\n- Scroll behavior\n\n## Prototyping in Figma\n1. Create frames for each screen\n2. Switch to Prototype mode\n3. Drag connections between elements and frames\n4. Set transition animations (dissolve, slide, smart animate)\n5. Preview and share with stakeholders\n\n## User Testing with Prototypes\n- Give users a task, not instructions\n- Watch where they tap/click first\n- Note hesitations and confusion\n- Ask "What did you expect to happen?" when something surprises them`
}), 18, 2, 10); // activity 60

insertActivity.run(13, 'Wireframing Assignment', 'assignment', JSON.stringify({
  instructions: 'Design wireframes for a mobile food ordering app. Create screens for the key user flow.',
  tasks: [
    'Sketch (paper or digital) a home screen showing restaurant categories, a search bar, and featured restaurants',
    'Design a restaurant detail page with menu items, ratings, delivery time, and an "Add to Cart" button',
    'Create a cart/checkout screen showing selected items, quantities, subtotal, delivery fee, and a "Place Order" button',
    'Design an order confirmation screen with order number, estimated delivery time, and a tracking link',
    'Add annotations explaining interactive elements (what happens on tap, swipe, or scroll)',
    'Create a simple user flow diagram showing how screens connect to each other'
  ],
  starterCode: 'Wireframe Screens to Create:\n\n1. Home Screen\n   - Header: Location selector, Search bar\n   - Body: Category filters, Featured restaurants grid\n   - Footer: Navigation tabs (Home, Search, Orders, Profile)\n\n2. Restaurant Detail\n   - Hero: Restaurant image, name, rating, delivery time\n   - Menu: Categorized items with price and Add button\n\n3. Cart / Checkout\n   - Item list with quantity controls\n   - Price breakdown\n   - Delivery address\n   - Payment method\n   - Place Order CTA\n\n4. Order Confirmation\n   - Order number\n   - ETA\n   - Live tracking link\n   - "Back to Home" option\n\nTool suggestion: Figma (free), Balsamiq, or paper & pen'
}), 40, 3, 25); // activity 61

// New activities for Module 17 (Finance: Debt Management) — activity IDs start at 62
insertActivity.run(17, 'Understanding Debt Types', 'reading', JSON.stringify({
  body: `# Debt Management Strategies\n\n## Good Debt vs Bad Debt\nNot all debt is created equal.\n\n### Good Debt (appreciating assets / income generation)\n- **Mortgage** — Real estate typically appreciates; builds equity\n- **Student loans** — Education increases earning potential (consider ROI)\n- **Business loans** — Used to generate income exceeding the interest cost\n\n### Bad Debt (depreciating assets / consumption)\n- **Credit card debt** — 18-25% APR on purchases that lose value\n- **Car loans on luxury vehicles** — Cars depreciate ~20% in year one\n- **Payday loans** — APR can exceed 400%\n\n## Key Metrics\n- **Debt-to-Income Ratio (DTI)** = Total Monthly Debt Payments / Gross Monthly Income\n  - Under 20% — Healthy\n  - 20-36% — Manageable but watch it\n  - Over 36% — Danger zone; prioritize payoff\n\n## The Two Main Payoff Strategies\n\n### 1. Debt Avalanche (mathematically optimal)\nPay minimums on all debts. Put extra money toward the **highest interest rate** first.\n- Saves the most money in total interest\n- May take longer to feel progress\n\n### 2. Debt Snowball (psychologically powerful)\nPay minimums on all debts. Put extra money toward the **smallest balance** first.\n- Quick wins build momentum\n- May cost slightly more in interest\n\n## Example\n| Debt | Balance | APR | Minimum |\n|------|---------|-----|--------|\n| Credit Card A | $3,000 | 22% | $90 |\n| Credit Card B | $8,000 | 18% | $200 |\n| Car Loan | $12,000 | 5% | $350 |\n| Student Loan | $25,000 | 6% | $280 |\n\n- **Avalanche order**: Credit Card A (22%) → B (18%) → Student Loan (6%) → Car (5%)\n- **Snowball order**: Credit Card A ($3K) → Credit Card B ($8K) → Car ($12K) → Student Loan ($25K)\n\n## Additional Strategies\n- **Balance transfer** — Move high-interest credit card debt to a 0% intro APR card\n- **Debt consolidation** — Combine multiple debts into one lower-interest loan\n- **Refinancing** — Get a lower rate on existing loans (mortgage, student loans)\n- **Negotiate** — Call lenders and ask for a lower rate (works more often than you think)`
}), 20, 1, 15); // activity 62

// activity 63 = quiz
_qid = insertActivity.run(17, 'Debt Management Quiz', 'quiz', JSON.stringify({
  description: 'Test your knowledge of debt management strategies and concepts.'
}), 10, 2, 20); // activity 63

insertQuestion.run(_qid, 'What is the debt avalanche method?', JSON.stringify([
  'Paying off debts by smallest balance first',
  'Paying off debts by highest interest rate first',
  'Consolidating all debts into one loan',
  'Declaring bankruptcy'
]), 1, 'The debt avalanche method targets the highest interest rate first, which minimizes total interest paid over time.');

insertQuestion.run(_qid, 'What is generally considered a healthy debt-to-income ratio?', JSON.stringify([
  'Under 20%',
  '30-40%',
  '50-60%',
  'Over 70%'
]), 0, 'A DTI under 20% is considered healthy. Lenders generally prefer DTI below 36%, and above 36% is a warning sign.');

insertQuestion.run(_qid, 'Which of the following is typically considered "good" debt?', JSON.stringify([
  'Credit card balances from shopping',
  'Payday loans',
  'A mortgage on a home',
  'An auto loan on a luxury car'
]), 2, 'A mortgage is generally considered good debt because real estate tends to appreciate over time and builds equity, unlike depreciating consumer purchases.');

insertQuestion.run(_qid, 'What is a balance transfer?', JSON.stringify([
  'Moving money between checking accounts',
  'Transferring high-interest credit card debt to a card with a lower or 0% intro APR',
  'Paying off a loan early',
  'Splitting a payment between two cards'
]), 1, 'A balance transfer moves existing credit card debt to a new card offering a lower or 0% introductory APR, reducing interest charges during the promo period.');

insertActivity.run(17, 'Debt Payoff Planner', 'interactive', JSON.stringify({
  instructions: 'Create your personal debt payoff plan by working through these steps.',
  steps: [
    { title: 'List all debts', description: 'Write down every debt: name, current balance, APR, and minimum monthly payment.', completed: false },
    { title: 'Calculate your DTI', description: 'Add up all minimum payments and divide by your gross monthly income. Is it under 20%, 20-36%, or over 36%?', completed: false },
    { title: 'Choose a strategy', description: 'Decide between Avalanche (highest interest first) or Snowball (smallest balance first). Rank your debts accordingly.', completed: false },
    { title: 'Find extra money', description: 'Review your budget and identify $50-$200/month extra to put toward debt. Consider: unused subscriptions, dining out, or a side gig.', completed: false },
    { title: 'Calculate payoff timeline', description: 'Using your extra payment and chosen strategy, estimate the month and year each debt will be paid off.', completed: false },
    { title: 'Explore optimization', description: 'Research whether a balance transfer (0% APR promo) or consolidation loan could reduce your interest further.', completed: false }
  ]
}), 30, 3, 20); // activity 65

// New activities for Module 20 (Stock Market: Building a Portfolio) — activity IDs start at 66
insertActivity.run(20, 'Asset Allocation and Diversification', 'reading', JSON.stringify({
  body: `# Building a Portfolio\n\n## What is Asset Allocation?\nAsset allocation is how you divide your investments across different asset classes.\n\n### Major Asset Classes\n- **Stocks (Equities)** — Ownership in companies. Higher risk, higher potential return.\n- **Bonds (Fixed Income)** — Loans to governments or companies. Lower risk, steady income.\n- **Real Estate** — Property or REITs. Provides income and inflation hedge.\n- **Cash & Equivalents** — Savings, money markets, CDs. Lowest risk, lowest return.\n- **Alternatives** — Commodities, crypto, private equity. High risk, low correlation.\n\n## The Risk-Return Spectrum\n\`\`\`\nCash → Bonds → Balanced Funds → Stocks → Crypto\n Low Risk / Low Return ←→ High Risk / High Return\n\`\`\`\n\n## Diversification\n"Don't put all your eggs in one basket."\n\n### Diversify Across:\n1. **Asset classes** — Stocks, bonds, real estate\n2. **Geographies** — US, international, emerging markets\n3. **Sectors** — Tech, healthcare, finance, energy, consumer\n4. **Company size** — Large-cap, mid-cap, small-cap\n\n## Age-Based Rules of Thumb\n- **Rule of 110**: Stocks % = 110 minus your age\n  - Age 25: 85% stocks, 15% bonds\n  - Age 40: 70% stocks, 30% bonds\n  - Age 60: 50% stocks, 50% bonds\n\n## Index Funds vs. Individual Stocks\n| | Index Funds | Individual Stocks |\n|---|---|---|\n| Diversification | Built-in (500+ stocks) | Must build yourself |\n| Fees | Very low (0.03-0.10%) | Trading commissions |\n| Time required | Minimal | Significant research |\n| Historical performance | Beats most active managers | Varies widely |\n\nWarren Buffett's advice: "A low-cost S&P 500 index fund will beat most professional investors over time."\n\n## Rebalancing\nOver time, your allocation drifts as asset classes perform differently. Rebalance annually:\n1. Compare current allocation to target\n2. Sell over-weighted assets\n3. Buy under-weighted assets`
}), 22, 1, 15); // activity 66

insertActivity.run(20, 'Portfolio Builder Exercise', 'interactive', JSON.stringify({
  instructions: 'Build a model investment portfolio based on your risk tolerance and goals.',
  steps: [
    { title: 'Determine your risk profile', description: 'Based on your age, income stability, and comfort with volatility, rate yourself: Conservative, Moderate, or Aggressive.', completed: false },
    { title: 'Set your target allocation', description: 'Using the Rule of 110 as a starting point, define your target % for stocks, bonds, and cash/alternatives.', completed: false },
    { title: 'Select specific investments', description: 'Choose 3-5 index funds or ETFs for each asset class. Example: VTI (US stocks), VXUS (international), BND (bonds), VNQ (real estate).', completed: false },
    { title: 'Calculate monthly contributions', description: 'Decide how much to invest monthly and allocate it according to your target percentages.', completed: false },
    { title: 'Simulate growth', description: 'Using an online compound interest calculator, project your portfolio value in 10, 20, and 30 years at your expected return rate.', completed: false }
  ]
}), 30, 2, 20); // activity 67

// activity 68 = quiz
_qid = insertActivity.run(20, 'Portfolio Building Quiz', 'quiz', JSON.stringify({
  description: 'Test your knowledge of portfolio construction and diversification.'
}), 10, 3, 20); // activity 68

insertQuestion.run(_qid, 'What is the Rule of 110?', JSON.stringify([
  'Invest $110 per month minimum',
  'Subtract your age from 110 to determine your stock allocation percentage',
  'Diversify across 110 different stocks',
  'Rebalance every 110 days'
]), 1, 'The Rule of 110 is a guideline that suggests subtracting your age from 110 to determine what percentage of your portfolio should be in stocks. A 30-year-old would have 80% stocks, 20% bonds.');

insertQuestion.run(_qid, 'What is the primary benefit of diversification?', JSON.stringify([
  'It guarantees higher returns',
  'It eliminates all risk',
  'It reduces the impact of any single investment performing poorly',
  'It makes tax filing simpler'
]), 2, 'Diversification reduces unsystematic risk — the risk associated with any single company or sector. If one investment drops, others may hold steady or rise, cushioning the blow.');

insertQuestion.run(_qid, 'Why do index funds tend to outperform most actively managed funds over time?', JSON.stringify([
  'They invest in better companies',
  'They have insider information',
  'They have much lower fees and capture the full market return',
  'They time the market better'
]), 2, 'Index funds charge very low fees (0.03-0.10% vs 1%+ for active funds). Over decades, this fee difference compounds significantly. Most active managers fail to beat the index after fees.');

// New activities for Module 22 (Financial Modeling: DCF Valuation) — activity IDs start at 69
insertActivity.run(22, 'DCF Valuation Step by Step', 'reading', JSON.stringify({
  body: `# Discounted Cash Flow (DCF) Valuation\n\nA DCF analysis estimates the **intrinsic value** of a company based on the present value of its expected future cash flows.\n\n## The Core Formula\n\n**Value = Sum of [ FCFt / (1 + r)^t ] + Terminal Value / (1 + r)^n**\n\nWhere:\n- **FCFt** = Free Cash Flow in year t\n- **r** = Discount rate (typically WACC)\n- **n** = Projection period (usually 5-10 years)\n\n## Step-by-Step Process\n\n### Step 1: Project Free Cash Flows\nEstimate future cash flows based on:\n- Historical revenue growth rates\n- Expected margin trends\n- Capital expenditure plans\n- Working capital changes\n\n\`\`\`\nFCF = Operating Cash Flow - Capital Expenditures\n    = EBIT(1 - tax rate) + Depreciation - CapEx - Change in Working Capital\n\`\`\`\n\n### Step 2: Calculate WACC (Discount Rate)\n**WACC = (E/V x Re) + (D/V x Rd x (1-T))**\n- E/V = Equity weight\n- Re = Cost of equity (use CAPM: Rf + Beta x Market Risk Premium)\n- D/V = Debt weight\n- Rd = Cost of debt\n- T = Tax rate\n\nTypical WACC range: 8-12% for most companies.\n\n### Step 3: Calculate Terminal Value\nSince we cannot project cash flows forever, we estimate a terminal value:\n\n**Gordon Growth Model:**\nTV = FCFn x (1 + g) / (WACC - g)\n- g = Long-term growth rate (typically 2-3%, near GDP growth)\n\n### Step 4: Discount to Present Value\nDiscount each projected FCF and the terminal value back to today.\n\n### Step 5: Calculate Per-Share Value\nEnterprise Value = Sum of discounted FCFs + Discounted Terminal Value\nEquity Value = Enterprise Value - Net Debt\nPer-Share Value = Equity Value / Shares Outstanding\n\n## Sensitivity Analysis\nAlways test different assumptions:\n- What if growth is 1% lower?\n- What if WACC is 1% higher?\n- Create a matrix showing value under different scenarios\n\n## Limitations\n- Highly sensitive to assumptions (garbage in, garbage out)\n- Difficult for early-stage or unprofitable companies\n- Terminal value often represents 60-80% of total value`
}), 25, 1, 15); // activity 69

// activity 70 = quiz
_qid = insertActivity.run(22, 'DCF Valuation Quiz', 'quiz', JSON.stringify({
  description: 'Test your understanding of discounted cash flow analysis.'
}), 10, 2, 20); // activity 70

insertQuestion.run(_qid, 'What does WACC stand for?', JSON.stringify([
  'Weighted Average Cost of Capital',
  'Working Asset Cash Calculation',
  'Weighted Annual Compound Cost',
  'Wholesale Average Capital Cost'
]), 0, 'WACC stands for Weighted Average Cost of Capital. It represents the average rate of return a company must earn to satisfy all its investors (both equity and debt holders).');

insertQuestion.run(_qid, 'Why is terminal value important in a DCF analysis?', JSON.stringify([
  'It accounts for the first year of cash flows',
  'It captures the value of all cash flows beyond the projection period',
  'It represents the company\'s current market price',
  'It is the same as book value'
]), 1, 'Terminal value captures the value of all future cash flows beyond the explicit forecast period. It often accounts for 60-80% of total enterprise value, making its assumptions critical.');

insertQuestion.run(_qid, 'If WACC increases, what happens to the DCF valuation?', JSON.stringify([
  'The valuation increases',
  'The valuation decreases',
  'The valuation stays the same',
  'It depends on the terminal growth rate only'
]), 1, 'A higher WACC means future cash flows are discounted at a higher rate, making them worth less in present value terms. This reduces the overall DCF valuation.');

insertQuestion.run(_qid, 'What is Free Cash Flow (FCF)?', JSON.stringify([
  'Total revenue minus total expenses',
  'Net income minus dividends',
  'Operating cash flow minus capital expenditures',
  'Gross profit minus operating expenses'
]), 2, 'Free Cash Flow equals operating cash flow minus capital expenditures. It represents the cash available to all investors after the company has reinvested in its operations.');

// New activities for Module 24 (Crypto: Understanding Crypto Assets) — activity IDs start at 71
insertActivity.run(24, 'Bitcoin, Ethereum, and Token Types', 'reading', JSON.stringify({
  body: `# Understanding Crypto Assets\n\n## Bitcoin (BTC)\nThe first and largest cryptocurrency, created by the pseudonymous **Satoshi Nakamoto** in 2009.\n\n### Key Properties\n- **Fixed supply**: Only 21 million BTC will ever exist (currently ~19.5M mined)\n- **Halving**: Mining rewards cut in half roughly every 4 years, reducing new supply\n- **Consensus**: Proof of Work (PoW)\n- **Use case**: Digital store of value ("digital gold"), peer-to-peer payments\n\n## Ethereum (ETH)\nCreated by **Vitalik Buterin** in 2015 as a "world computer."\n\n### Key Properties\n- **Smart contracts**: Self-executing code that runs on the blockchain\n- **Consensus**: Proof of Stake (PoS) since "The Merge" in September 2022\n- **Gas fees**: Users pay ETH to execute transactions and smart contracts\n- **Use cases**: DeFi, NFTs, DAOs, tokenization of real-world assets\n\n## Token Types\n\n| Type | Purpose | Examples |\n|------|---------|--------|\n| **Layer 1** | Native blockchain tokens | BTC, ETH, SOL, ADA |\n| **Stablecoins** | Pegged to fiat currency (usually $1) | USDC, USDT, DAI |\n| **Utility tokens** | Access features within a platform | UNI, LINK, FIL |\n| **Governance tokens** | Voting rights in a protocol | AAVE, MKR, COMP |\n| **NFTs** | Unique digital ownership certificates | Art, collectibles, gaming items |\n\n## Evaluating Crypto Projects\nBefore investing, assess:\n1. **Problem**: What real problem does it solve?\n2. **Team**: Who is building it? Are they credible?\n3. **Tokenomics**: Total supply, inflation rate, distribution\n4. **Adoption**: Active users, transaction volume, developer activity\n5. **Community**: Engaged community or hype-driven?\n\n## Risks\n- **Volatility**: 50-80% drawdowns are common\n- **Regulatory**: Laws are evolving rapidly worldwide\n- **Security**: Exchange hacks, smart contract bugs, scams\n- **Liquidity**: Smaller tokens may be hard to sell at fair value\n\n## Golden Rule\nNever invest more in crypto than you can afford to lose entirely.`
}), 20, 1, 15); // activity 71

// activity 72 = quiz
_qid = insertActivity.run(24, 'Crypto Assets Quiz', 'quiz', JSON.stringify({
  description: 'Test your understanding of cryptocurrency types and fundamentals.'
}), 10, 2, 20); // activity 72

insertQuestion.run(_qid, 'What is the maximum supply of Bitcoin?', JSON.stringify([
  '1 million',
  '10 million',
  '21 million',
  'Unlimited'
]), 2, 'Bitcoin has a hard cap of 21 million coins. This fixed supply is one of its key properties and contributes to its "digital gold" narrative.');

insertQuestion.run(_qid, 'What are smart contracts?', JSON.stringify([
  'Legal documents stored on a computer',
  'Self-executing code that runs on a blockchain when conditions are met',
  'Agreements between cryptocurrency exchanges',
  'Contracts that require a lawyer to execute'
]), 1, 'Smart contracts are programs stored on a blockchain that automatically execute when predetermined conditions are met. They enable DeFi, NFTs, and many other applications.');

insertQuestion.run(_qid, 'What is a stablecoin?', JSON.stringify([
  'A cryptocurrency with low volatility that is pegged to a fiat currency',
  'Any cryptocurrency that has been around for more than 5 years',
  'A coin that can only increase in value',
  'A government-issued digital currency'
]), 0, 'Stablecoins are cryptocurrencies designed to maintain a stable value, typically pegged 1:1 to a fiat currency like the US dollar. Examples include USDC and USDT.');

insertActivity.run(24, 'Crypto Research Assignment', 'assignment', JSON.stringify({
  instructions: 'Conduct a research analysis on a cryptocurrency project using the evaluation framework from the reading.',
  tasks: [
    'Choose a cryptocurrency project (not Bitcoin or Ethereum) and state why you selected it',
    'Describe the problem it solves and the technology behind it (consensus mechanism, transaction speed, scalability)',
    'Analyze the team: founders, key developers, advisors, and their track record',
    'Evaluate the tokenomics: total supply, circulating supply, inflation/deflation mechanics, token distribution',
    'Research adoption metrics: number of active wallets, daily transaction volume, TVL (if DeFi), developer activity on GitHub',
    'Identify the top 3 risks specific to this project and how they might be mitigated',
    'Conclude with your overall assessment: strong, moderate, or weak investment case — and why'
  ],
  starterCode: 'Crypto Project Analysis\n\nProject Name: \nTicker Symbol: \nCurrent Price: $\nMarket Cap: $\nRank by Market Cap: #\n\n1. Problem & Technology:\n\n2. Team Analysis:\n\n3. Tokenomics:\n   - Total Supply: \n   - Circulating Supply: \n   - Inflation Rate: \n   - Distribution: \n\n4. Adoption Metrics:\n   - Active Wallets: \n   - Daily Transactions: \n   - Developer Activity: \n\n5. Key Risks:\n   a. \n   b. \n   c. \n\n6. Conclusion & Rating:\n'
}), 35, 3, 25); // activity 73

// ===========================================================================
// ENROLLMENTS
// ===========================================================================
const insertEnrollment = db.prepare('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)');
insertEnrollment.run(5, 1);  // Alice -> JS
insertEnrollment.run(5, 2);  // Alice -> React
insertEnrollment.run(5, 6);  // Alice -> Personal Finance
insertEnrollment.run(5, 7);  // Alice -> Stock Market
insertEnrollment.run(6, 1);  // Bob -> JS
insertEnrollment.run(6, 3);  // Bob -> Data Science
insertEnrollment.run(6, 6);  // Bob -> Personal Finance
// Additional enrollments
insertEnrollment.run(5, 4);  // Alice -> Node.js
insertEnrollment.run(5, 9);  // Alice -> Crypto
insertEnrollment.run(6, 5);  // Bob -> UI/UX
insertEnrollment.run(6, 7);  // Bob -> Stock Market
insertEnrollment.run(6, 10); // Bob -> Accounting

// ===========================================================================
// PROGRESS
// ===========================================================================
const insertProgress = db.prepare('INSERT INTO activity_progress (user_id, activity_id, status, score, time_spent_seconds, completed_at) VALUES (?, ?, ?, ?, ?, ?)');
// Alice (user 5) in JS course
insertProgress.run(5, 1, 'completed', null, 900, '2026-04-01 10:00:00');
insertProgress.run(5, 2, 'completed', null, 600, '2026-04-02 14:00:00');
insertProgress.run(5, 3, 'completed', null, 1200, '2026-04-03 09:00:00');
insertProgress.run(5, 4, 'completed', 75, 480, '2026-04-04 11:00:00');
// Alice progress in Personal Finance
insertProgress.run(5, 11, 'completed', null, 720, '2026-04-05 10:00:00');
insertProgress.run(5, 12, 'completed', null, 900, '2026-04-05 11:00:00');
// Alice progress in Stock Market
insertProgress.run(5, 18, 'completed', null, 1080, '2026-04-06 09:00:00');
insertProgress.run(5, 19, 'completed', null, 1200, '2026-04-06 10:30:00');
// Bob (user 6) in JS course
insertProgress.run(6, 1, 'completed', null, 850, '2026-04-03 08:00:00');
insertProgress.run(6, 2, 'completed', null, 700, '2026-04-03 09:30:00');
// Bob in Personal Finance
insertProgress.run(6, 11, 'completed', null, 680, '2026-04-04 14:00:00');

// ===========================================================================
// SUMMARY
// ===========================================================================
const moduleCount = db.prepare('SELECT COUNT(*) as count FROM modules').get();
const activityCount = db.prepare('SELECT COUNT(*) as count FROM activities').get();
const questionCount = db.prepare('SELECT COUNT(*) as count FROM quiz_questions').get();
const enrollmentCount = db.prepare('SELECT COUNT(*) as count FROM enrollments').get();

console.log('Database seeded successfully!');
console.log('');
console.log('  Users:');
console.log('    admin@nextskill.com    (admin)');
console.log('    sarah@nextskill.com    (instructor)');
console.log('    mike@nextskill.com     (instructor)');
console.log('    priya@nextskill.com    (instructor)');
console.log('    alice@nextskill.com    (student)');
console.log('    bob@nextskill.com      (student)');
console.log('  Password for all: password123');
console.log('');
console.log('  Courses: 5 tech + 5 finance = 10 total');
console.log(`  Modules: ${moduleCount.count}`);
console.log(`  Activities: ${activityCount.count}`);
console.log(`  Quiz Questions: ${questionCount.count}`);
console.log(`  Enrollments: ${enrollmentCount.count}`);
process.exit(0);
