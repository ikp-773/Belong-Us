const express = require('express');
const app = express();
const port = process.env.port || 3000;
const axios = require('axios');
const xml2js = require('xml2js');

const baseURL = 'https://api.alamy.com/images/api/v2/search'


app.use(express.json());

// app.get('/', (reg, res) => {
//     res.send('Hello World!');
// });



app.get('/get-all', (req, res) => {
    axios.get(baseURL + "?qt=trending")
        .then(response => {
            xml2js.parseString(response.data, (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Conversion of XML to JSON failed' });
                } else {
                    res.json(result);
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});

app.post('/search', (req, res) => {
    const query = req.body.query;
    const filters = req.body.filters;
    var queryString = '';

    if (filters) {
        const otValues = filters.ot || [];
        const licValues = filters.lic || [];
        const pgs=filters.pgs||1;


        if (otValues.length > 0) {
            otValues.forEach(value => {
                queryString += "&ot=" + value;
            });
        }

        if (licValues.length == 1) {
            licValues.forEach(value => {

                queryString += "&lic=" + value;
            });
        }

        queryString=queryString+"&pgs="+pgs;
    }

    console.log(queryString);

    console.log(req.body)
    console.log(baseURL + `?qt=${query}` + queryString);

    axios.get(baseURL + `?qt=${query}` + queryString)
        .then(response => {

            xml2js.parseString(response.data, (error, result) => {
                if (error) {

                    res.status(500).json({ error: 'Internal Server Error' });
                } else {

                    res.json(result);
                }
            });
        })
        .catch(error => {
            // Handle errors and send an appropriate response to the frontend
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});