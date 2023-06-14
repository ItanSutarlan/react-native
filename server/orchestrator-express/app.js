const cors = require('cors');
const express = require('express');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const router = require('./routers');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

app.use(errorHandler);

app.listen(port, (_) => console.log(`Apps is listening at port ${port}`));
