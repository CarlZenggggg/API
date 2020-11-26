const express = require('express');
const app = express();
const port = 3000;

app.get('/', (request, response) => {
    response.send('Hello!')
});

app.listen(port, () => {
    console.log(`Sever is running at http://localhost:${port}`);
});
