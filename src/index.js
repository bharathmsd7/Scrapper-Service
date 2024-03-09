const express = require("express");
const scrapper = require("./scrapper")

const app = express();
const port = process.env.PORT || 3000;

function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_.-]*$/;
    return usernameRegex.test(username);
}

app.get("/scrape/:username", async (req, res) => {
    const username = req.params.username;

    if (!validateUsername(username)) {
        return res.status(400).send("Invalid username format");
    }
    try {
        const response = await scrapper(username);
        if (response) {
            res.status(200).send(JSON.stringify(response))
        } else {
            res.status(404).send("Video not found for the account @", username)
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error scraping data");
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
