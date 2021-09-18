/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Dolma Bhuti Student ID: 0154381398 Date: 17/09/2021
* Heroku Link:  https://git.heroku.com/boiling-chamber-82558.git
*
********************************************************************************/

const express = require('express')
const app = express()
const cors = required("cors")

//restaurant collection
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB();
const HTTP_PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());  //server can parse the JSON provided in the request body for some of our routes
app.get('/', (req, res) => {
    res.json({ message: 'API Listening' });
})


db.initialize("mongodb+srv://dbhuti1:Brita&filter867@cluster0.zwkw1.mongodb.net/sample_restaurants?retryWrites=true&w=majority")
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`server listening on: ${HTTP_PORT}`);
        });
    }).catch((err) => {
        console.log(err);
    });

app.post('api/restaurants', (req, res) => {

    db.addNewRestaurant(req).then(() => {
        res.send("Success");
    }).catch((err) => {
        console.log(err);
        res.send("Failed adding new restaurant" + err);
    })
});

app.get('/api/restaurants', (req, res) => {
    page = req.query.page;
    perPage = req.query.perPage;

    if (req.query.borough) {
        db.getAllRestaurants(page, perPage, req.query.borough)
            .catch((err) => {
                console.log(err);
                res.status(404).send("Incorrect page parameters");
            })
    }
});

app.get('api/restaurants/:_id', (req, res) => {
    id = req.params._id
    db.getRestaurantById(id)
        .catch((err) => {
            console.log(err);
            res.status(404).send("Incorrect ID");
        })
});

app.put('api/restaurants/:_id', (req, res) => {
    updateRestaurantById(req.body, req.params._id).then(() => {
        res.send('Update Successful');
    }).catch((err) => {
        res.status(404).send('Update Unsuccessful: ID incorrect');
    })
});

app.delete('api/restaurants/:_id', (req, res) => {
    deleteRestaurantById(req.params._id)
        .then(() => {
            res.send('Delete Successful');
        }).catch((err) => {
            res.status(404).send('Delete Unsuccessful: ID incorrect');
        })
})