const dotenv = require('dotenv')
const express = require('express');
const app = express();
const path = require('path');


dotenv.config({
    path: './config.env'
})

app.use(express.static(path.join(__dirname, 'documents')));


require('./database/connection')

app.use(express.json({
    limit: '5mb'
}))
// app.use(express.json())
// app.use(express.limit(100000000));

app.use(require(path.join(__dirname, './controller/auth')));


app.use(express.static(path.join(__dirname, "./build")));
app.get("*", function (_, res) {
    res.sendFile(
        path.join(__dirname, "./build/index.html"),
        function (err) {
            res.status(500).send(err);
        }
    );
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT} `)
})