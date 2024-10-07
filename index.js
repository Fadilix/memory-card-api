const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.json({ message: "Hello World" })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})
