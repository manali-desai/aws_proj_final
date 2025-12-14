const express = require('express');
const app = express();
const PORT = 3000;

// Home route
app.get('/', (req, res) => {
    res.send('Hello from frontend!');
});

app.listen(PORT, () => {
    console.log(`Frontend running on http://localhost:${PORT}`);
});
