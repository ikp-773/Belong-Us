const express = require('express');
const app = express();
const port = 3000;

app.get('/', (reg, res) => {
        res.send('Hello World!');
    });

app.get('/en', (req, res) => {
    axios.get("https://api.alamy.com/images/api/v2/search?qt=<searchterm>")
        .then(response =› {
            res.json(response.data);
])
        .catch(err =›
            {
                console.error(err);
                res.sendStatus(500);
]):
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});