const express = require('express');
const cors = require('cors');
const { createServer: createHttpServer } = require('http');
const dotenv = require('dotenv');
dotenv.config();

const { initWS } = require('./ws');
const { ALLOWED_ORIGINS } = require('./config');

const PORT = process.env.PORT || 4051;

const app = express();
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
  })
);
const httpServer = createHttpServer(app);

app.get('/health', (req, res) => {
  res.status(200).send({
    status: 'OK',
  });
});

initWS(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Executor is running on port ${PORT}`);
});
