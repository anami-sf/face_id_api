const express =require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
var knex = require('knex')

const register = require('./Controllers/register');
const signin = require('./Controllers/signin');

var db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1', //local host, which should be replaced actual host
      user : 'anahome',
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

app.get('/', (req, res) => {
    res.json(database.users);
})

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {
    
    const {id} = req.params;
    
    db.select('*')
        .from('users')
        .where({
            id: id
    })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            }else{
                res.status(400).json("User not found")
            }           
        })
        .catch(err => {
            err.status(400).json("User not found")
        })
}) 

app.put('/image', (req, res) => {
    
    const {id} = req.body;

    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => {res.status(400).json('unable to get entries')})
})

app.listen(3000, () => {
    console.log("App is running in port 3000");
})

