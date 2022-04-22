const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 3002;
const host = process.env.HOST || '127.0.0.1';
require('dotenv').config();

const { Tracer, ExplicitContext, BatchRecorder, jsonEncoder } = require("zipkin");
const { HttpLogger } = require("zipkin-transport-http");
const zipkinMiddleware = require("zipkin-instrumentation-express").expressMiddleware;

const ZIPKIN_ENDPOINT = process.env.ZIPKIN_ENDPOINT || "http://localhost:9411";

//  zipkin tracer
const tracer = new Tracer({
  ctxImpl: new ExplicitContext(),
  recorder: new BatchRecorder({
    logger: new HttpLogger({
      endpoint: `${ZIPKIN_ENDPOINT}/api/v2/spans`,
      jsonEncoder: jsonEncoder.JSON_V2,
    }),
  }),
  localServiceName: "date-service",
});


// app config
const app = express();
app.use(express.json());

app.use(zipkinMiddleware({ tracer }));

// routes
const postRoutes = require('./posts/routes');

// database connection
mongoose.connect(process.env.DATABASE_URI, { useUnifiedTopology: true, useNewUrlParser: true });

app.use('/posts', postRoutes);

app.listen(port, ()=>{
    console.log(`App running on port ${port}`)
});
