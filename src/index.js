//  G:/Stuff/my_projects/mongodb/bin/mongod.exe --dbpath=G:/Stuff/my_projects/mongodb-data
const app = require('./app');

const port = process.env.PORT;

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});


