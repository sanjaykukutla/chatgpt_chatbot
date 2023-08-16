const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(
    cors({
        origin:"http://127.0.0.1:5173/"
    })
)

app.use(express.json());
const API_KEY = "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";

app.post('/getChatResponse', async (req, res) => {
    const apiRequestBody = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
    });

    const data = await response.json();
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
