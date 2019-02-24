const handleSignin = (req, res, db, bcrypt) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash); 
            if(isValid) {
                return db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    res.json(user[0])
                    console.log(user)
                })
                .catch(err => err.status(400).json('Wrong credentials'))   //res vs err
            }else{
                res.status(400).json('Wrong credentials')
            }
        })
        .catch(err => res.status(400).json('Invalid credentials'))
}

module.exports = {
    handleSignin: handleSignin
};