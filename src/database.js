/*
brew tap mongodb/brew
brew install mongodb-community@4.4

brew services start mongodb-community@4.4
brew services stop mongodb-community@4.4
*/

const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/ejemplo',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}) 
   .then(() => console.log('Database is conected'))
   .catch(err => console.log(err));