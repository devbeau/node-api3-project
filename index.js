const server = require('./server');
// code away!
const PORT = 5002;

server.listen(PORT, () => {
    console.log('\nServer is running on ' + PORT);
})