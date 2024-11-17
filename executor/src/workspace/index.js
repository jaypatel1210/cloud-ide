// Import the Express module
const express = require('express');

// Initialize the Express application
const app = express();

// Define the /health route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});


const PORT = 9999;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
