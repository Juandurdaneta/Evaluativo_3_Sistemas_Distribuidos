const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 3002;
require('dotenv').config();
// app config
const app = express();
app.use(express.json());

// routes
const postRoutes = require('./posts/routes');

// database connection
mongoose.connect(process.env.DATABASE_URI, { useUnifiedTopology: true, useNewUrlParser: true });

app.use('/posts', postRoutes);

app.listen(port, ()=>{
    console.log(`App running on port ${port}`)
});
