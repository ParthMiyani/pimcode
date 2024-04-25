const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const authToken = require("./authToken");

// Create an instance of Express
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Secret key for JWT
const secretKey = "your-secret-key";

const USERS = [];

const QUESTIONS = [
  {
    id: 1,
    title: "Two Sum",
    description:
      "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    testcases: [
      {
        input: [2, 7, 11, 15],
        output: [0, 1],
      },
      {
        input: [3, 2, 4],
        output: [1, 2],
      },
    ],
  },
  {
    id: 2,
    title: "Add Two Numbers",
    description:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    testcases: [
      {
        input: {
          l1: [2, 4, 3],
          l2: [5, 6, 4],
        },
        output: [7, 0, 8],
      },
      {
        input: {
          l1: [0],
          l2: [0],
        },
        output: [0],
      },
    ],
  },
];

const SUBMISSIONS = [
  {
    id: 1,
    questionId: 1,
    code: "function twoSum(nums, target) {}",
    status: "Accepted",
    userId: 1,
  },
  {
    id: 2,
    questionId: 2,
    code: "function addTwoNumbers(l1, l2) {}",
    status: "Rejected",
    userId: 1,
  },
];

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password are required");
    return;
  }
  if (USERS.find((user) => user.email === email)) {
    res.status(400).send("Email already exists");
    return;
  }
  userId = USERS.length + 1;
  const user = { userId, email, password };
  USERS.push(user);
  return res.status(201).send("User created");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password are required");
    return;
  }
  const user = USERS.find((user) => user.email === email);
  if (!user || user.password !== password) {
    res.status(401).send("Invalid credentials");
    return;
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id, email: user.email }, secretKey);

  res.status(200).json("JWT " + token);
});

app.get("/questions", authToken.authenticateToken, (req, res) => {
  res.json(QUESTIONS);
});

app.post("/submissions", authToken.authenticateToken, (req, res) => {
  const { questionId, code } = req.body;
  if (!questionId || !code) {
    res.status(400).send("Question ID and code are required");
    return;
  }
  const question = QUESTIONS.find((question) => question.id === questionId);
  if (!question) {
    res.status(404).send("Question not found");
    return;
  }
  const status = Math.random() < 0.5 ? "Accepted" : "Rejected";
  const submissionId = SUBMISSIONS.length + 1;
  const submission = {
    submissionId,
    questionId,
    code,
    status: status,
    userId: 1,
  };
  SUBMISSIONS.push(submission);
  res.status(201).json(submission);
});

app.get("/submissions", authToken.authenticateToken, (req, res) => {
  // get submissions by user id from req body
  const { userId } = req.body;
  const submissions = SUBMISSIONS.filter(
    (submission) => submission.userId === userId
  );
  res.json(submissions);
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
