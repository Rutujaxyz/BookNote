import express, { query } from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;
const db=new pg.Client({
    user: "postgres",
    host:"localhost",
    database: "booknote",
    password: process.env.POSTGRESQLPASSWORD,
    port: "5432"
  });
  db.connect();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let books=[{
    id:1,
    title: "twisted love",
    content: "twisted story of ava and alex",
    author: "ana hong",
    date: "8-6-2024",
    isbn:"4567897654"

}]
app.get("/", async (req,res)=>{

    const result = await db.query("SELECT * FROM Books ORDER BY id ASC")
    console.log(result)
    res.render("index.ejs",{
        books: result.rows
    })
    const api = await axios.get("https://covers.openlibrary.org/b/isbn/0385472579-S.jpg")
    console.log(api);
})
app.get("/new",async (req,res)=>{
    res.render("modify.ejs",{ heading: "New Book", submit: "Add book" })
})
app.post("/posts",async (req, res)=>{
    console.log(req)
    const title = req.body.title;
    const content = req.body.content;
    const author = req.body.author;
    const date = req.body.date;
    const isbn = req.body.isbn;

      await db.query("INSERT INTO Books (title, content,date,isbn, author) VALUES ($1, $2, $3, $4, $5)", [title,content,date,isbn,author]);
      res.redirect("/");
 
})

app.get("/edit/:id",async (req,res)=>{
  const id=req.params.id
  console.log(id)
  const result = await db.query("SELECT * FROM Books WHERE id=($1)",[id])
  console.log(result)
  res.render("modify.ejs",{
    
      book: result.rows[0],
      heading: "edit Book", 
      submit: "edit book"
    
  })


})
app.post("/posts/:id",async (req,res)=>{
    const id= req.params.id;
    const title=req.body.title;
    const content=req.body.content;
    const date=req.body.date;
    const isbn=req.body.isbn;
    const author=req.body.author;

    await  db.query("UPDATE Books SET title=($1),content=($2),date=($3),isbn=($4),author=($5) WHERE id=($6)",[title, content,date,isbn,author,id])
    res.redirect("/")
})
app.get("/delete/:id", async (req, res) => {
    const id=req.params.id;
    
      await db.query("DELETE FROM Books WHERE id=$1",[id]);
      res.redirect("/");
  
  });
app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });