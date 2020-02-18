const express = require("express");
const fs = require("fs");
const path = require("path");
let db = require("./db/db.json");
let app = express();
let PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  fs.readFile("./db/db.json", "utf8", (err, result) => {
    res.json(JSON.parse(result));
  });
});

// Basic route that sends the user first to the AJAX Page
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/api/notes", function(req, res) {
  let newNote = req.body;
  newNote.routeName = newNote.text.replace(/\s+/g, "").toLowerCase();
  db.push(req.body);

  fs.writeFile("./db/db.json", JSON.stringify(db), (err, result) => {});
  res.json(db);
});

app.delete("/api/notes/:id", function(req, res) {
  let id = req.params.id;

  var noteObj = { id: id };
  db.splice(db.indexOf(noteObj), 1);
  fs.writeFile("./db/db.json", JSON.stringify(db), (err, result) => {});
  res.json(db);
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
