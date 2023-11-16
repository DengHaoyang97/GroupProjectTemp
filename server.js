//no use,backup 
//const dbUser = "381Project"; //lohin/create mongodb method
//const { MongoClient } = require("mongodb");//mongodb method
//let db=client.db(dbUser);//mongodb method(define db)
/*const connectMG = async () => {
   client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   try {
      await client.connect();
      console.log('Wah Connected MG');
   } catch (err) {
      console.error('Failed Connect MG',err);
   }
} */ //mongodb method(cnDB)//const kittySchema = require('./models/kitty');//schema requirement
//
//names
const collectionName_user = 'users';  //login/create
const uri = `mongodb+srv://userfornode:12345678900@book-managementsystem.cqntnli.mongodb.net/BookManage`;
//names

//quotes
const mongoose = require('mongoose');
const express = require('express');
const session = require('cookie-session');
const app = express();
 app.set('view engine','ejs');
const bodyParser=require('body-parser');
 app.use(bodyParser.urlencoded({ extended: true }));
//quotes

//shortcuts
const closeDB=()=>mongoose.disconnect();	
mongoose.connect(uri);	
const db=mongoose.connection;
//shortcuts
app.use(session({
    userid: "session",  
    keys: ["123"],
}))

//bookSchema
 const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    year: Number
});
const Book = mongoose.model('books', bookSchema);

//functions
   const handle_login = async (username, password) => {
   try{ 
   console.log("Connected DB");
   let result= await db.collection(collectionName_user).findOne({ "username": username,"password":password});
   if(result){
   console.log(result)
   return result;
   }
   else{
   return null;
   console.log("NOTCORRECT!!!")}
 
   
  }
   catch (err){
   console.error("Error while handle login",err);
   }
   finally{
   console.log("Disconnected DB");}}
 //  
   const handle_accCreate = async (username, password) => {
   try{  
   console.log("Connected DB");
	let match = await db.collection(collectionName_user).findOne({"username":username});
	if(match){
	console.log("Username used");
	return true;
	}
	
	else{
   let result=await db.collection(collectionName_user).insertOne({"username":username,"password":password});
   console.log(username + " Created");
   return false;}}
   
   
   catch (err){
   console.error("Error while handle acccreate",err);
   }
   finally{
   console.log("Disconnected DB");}}
   
   
   
   
//res req

app.get('/login', (req, res) => {
   res.status(200).render('login.ejs',{Message:null});   
  
});
app.post('/login', async(req,res) => {
   const result=await handle_login(req.body.username,req.body.password);
   if(result){
   req.session.loggedIn = true;
   req.session.authenticated = true;
   req.session.userid = result._id.toString();
   console.log("Logged as " + result.username);
   res.redirect('/');
	   }
   else{res.status(200).render('login.ejs',{Message:"incorrect username or passwd"});}
});

app.get('/createaccount', (req, res) => {
   res.status(200).render('createaccount.ejs',{Message:null});   
  });
  
app.post('/createaccount', async(req, res) => {
    const result=await handle_accCreate(req.body.username,req.body.password);
    if(result){ res.status(200).render('createaccount.ejs',{Message:"User Name Already Used"});}
	else{
	res.status(200).render('login.ejs',{Message:"Successfully Create Account! Plz Login"});
	}
  });
  
  app.get('/logout',(req,res)=>{
  req.session.loggedIn = null;
  res.redirect('/login');
  })
  
  //books
  
  app.get('/', async (req, res) => {
	 //check if login
	if (req.session.loggedIn==nnull) {
	res.redirect('/login');} ;
	
    try {
		console.log('list books');
        const books = await Book.find();
        res.render('index', { books: books });
    } catch (err) {
        res.status(500).send('Connot connect to DB');
		console.log('Connot connect to DB');
    }
});

app.get('/books/new', async (req, res) => {
    try {
		console.log('insertone');
		res.render('createbook');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.get('/books/edit/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.render('edit', { book: book });
    } catch (err) {
        res.status(500).send('Server error');
		console.log('insert error or cannot connect db');
    }
});

app.post('/books/add', async (req, res) => {
    try {
		console.log('insertone');
        const newBook = new Book(req.body);
        await newBook.save();
		console.log('inserted book with id: ' + newBook._id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Server error');
		console.log('insert error or cannot connect db');
    }
});

app.post('/books/update/:id', async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Server error');
		console.log('insert error or cannot connect db');
    }
});

app.post('/books/delete/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Server error');
		console.log('insert error or cannot connect db');
    }
});
  
  
//end
app.listen(process.env.PORT || 3000);

   

