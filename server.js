const express =require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
//added bcrypt-nodejs instead of bcrypt
const cors = require('cors');
var knex = require('knex')

const register = require('./Controllers/register');
const signin = require('./Controllers/signin');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');

var db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1', //local host, which should be replaced actual host
      user : 'ana',
      password : '',
      database : 'face_id_db'
    }
  });

  db.select('*').from('users')
  .then(data => {
    console.log(data);
  });

const app = express();



app.use(bodyParser.json());
app.use(cors());

/* 
/root res = 'This is working'
/signin --> POST = success/fail
/register --> POST = user object
/profile/:userid --> GET  user object
/image --> PUT --> (update) user
*/

app.get('/', (req, res) => {res.send('It is working!')})
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)}) 
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen( process.env.PORT || 3000, () => {
    console.log('App is running on port ${process.env.PORT}');
})

