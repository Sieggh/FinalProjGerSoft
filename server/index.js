const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config();
const path = require('path');
const pontoRoutes = require('./routes/api/ponto');
const usuarioRoutes = require('./routes/api/usuarios');
const cargoRoutes = require('./routes/api/cargos');
const setorRoutes = require('./routes/api/setores');
const empresaRoutes = require('./routes/api/empresa');


app.use(cors()) // to allow cross origin requests
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB database Connected...'))
    .catch((err) => console.log(err))

app.use('/api/ponto', pontoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cargos', cargoRoutes);
app.use('/api/setores', setorRoutes);
app.use('/api/empresa', empresaRoutes);

app.listen(process.env.PORT, () => console.log(`App listening at http://localhost:${process.env.PORT}`))
