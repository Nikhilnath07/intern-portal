import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const db = new pg.Client({
  user: "postgres",           // your postgres username
  host: "localhost",
  database: "intern_portal",
  password: "12345",  // replace with your password
  port: 5432,
});

db.connect();


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// In-memory leaderboard array
let leaderboard = [
  { name: "Nikhil", donations: 5000 },
  { name: "Aarav", donations: 3500 },
  { name: "Isha", donations: 2700 },
];

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/dashboard", (req, res) => {
  const internName = req.query.internName;

  const internData = {
    name: internName,
    referralCode: `${internName}2025`,
    totalDonations: 3500,
    rewards: ["T-shirt", "Intern Badge", "Laptop Sticker"],
  };

  res.render("dashboard.ejs", { intern: internData });
});

app.post("/add-leaderboard", async (req, res) => {
  const { name, donation } = req.body;
  try {
    await db.query("INSERT INTO leaderboard (name, donation) VALUES ($1, $2)", [name, donation]);
    res.redirect("/leaderboard");
  } catch (err) {
    res.status(500).send("Error adding member");
  }
});


app.get("/leaderboard", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM leaderboard ORDER BY id ASC");
    res.render("leaderboard.ejs", { leaderboard: result.rows });
  } catch (err) {
    res.status(500).send("Error retrieving leaderboard");
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
