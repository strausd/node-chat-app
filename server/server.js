const path = require("path");
const express = require("express");
var app = express();

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.render('index');
});


app.listen(process.env.PORT, () => {
    console.log('Server started...');
});