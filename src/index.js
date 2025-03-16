const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');

// require('../src/utils/scheduler');
dotenv.config();

const app = express();

app.use(morgan('dev'));  

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/emotions', require('./routes/emotions.routes'));
app.use('/api/messages', require('./routes/messages.routes'));
app.use('/api/recommendations', require('./routes/recommendations.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});
