const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/movies', require('./routes/movies'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reviews', require('./routes/reviews'));

mongoose.connect('mongodb://127.0.0.1:27017/moviesDB')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('API de reseñas funcionando');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`servidor corriendo en el puerto ${PORT}`));
