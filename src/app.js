const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');

dotenv.config();

// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// api route
app.use('/api', customerRoutes);

// docs api route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Welcome to technical test sutantoadi at Higo!');
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});