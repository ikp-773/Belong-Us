const express = require('express');
const app = express();
const port = process.env.port || 3000;
const axios = require('axios');
const xml2js = require('xml2js');

const baseURL = 'https://www.alamy.com/search-api/search/?sortBy=relevant&ispartial=true&langcode=en&type=picture&geo=IN' //'https://api.alamy.com/images/api/v2/search'


app.use(express.json());

// app.get('/', (reg, res) => {
//     res.send('Hello World!');
// });



app.get('/get-all', (req, res) => {
    axios.get(baseURL + "&qt=trending&pg=50")
        .then(response => {
           res.json(response.data)
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
            queryString += "&ot="
            otValues.forEach(value => {
                switch(value){
                    case 1: queryString += "landscape," ;break;
                    case 2: queryString += "portrait,"; break;
                    case 4: queryString += "panoramic,"; break;
                    case 8: queryString += "square,"; break;
                }
                
            });
        }

        queryString = queryString.slice(0, -1);


        if (licValues.length == 1) {
            licValues.forEach(value => {
                if(value==1){
                    queryString += "&lic=rf" ;

                } if (value == 2) {
                    queryString += "&lic=rm";

                }
            });
        }

        queryString=queryString+"&ps="+pgs;
    }

    console.log(queryString);

    console.log(req.body)
    console.log(baseURL + `&qt=${query}` + queryString);

    axios.get(baseURL + `&qt=${query}` + queryString)
        .then(response => {
            console.log(response.data);
            res.json(response.data); 

          
        })
        .catch(error => {
            // console.log(error);
            // Handle errors and send an appropriate response to the frontend
            res.status(500).json({ error: error },);
        });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});