const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');

const app = express();
// db config
const db = monk('mongodb+srv://admin:{your-key}.mongodb.net/mews?retryWrites=true&w=majority');
const mews = db.get('mews');
const filter = new Filter();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.json({
        message: 'It is working!',
    });
});

app.get('/mews', (req, res) => {
    mews
        .find()
        .then(mews => {
            res.json(mews);
        });
});

function isValidMew(mew) {
    return mew.name && mew.name.toString().trim() !== '' &&
    mew.content && mew.content.toString().trim() !== '';
}

app.post('/mews', (req, res) => {
    if(isValidMew(req.body)) {
        const mew = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };

        mews
            .insert(mew)
            .then(createdMew => {
                res.json(createdMew);
            });
    } else {
        res.status(422);
        res.json({
            message: 'Hey! Name and Content are required!'
        });
    }
});

// listener
app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
});
