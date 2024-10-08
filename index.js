const express = require("express");
const cors = require("cors");
const userController = require("./controllers/userController");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.json({ message: "Hello World" })
})

app.get("/api/v1/users", userController.getUsers);
app.post("/api/v1/users", userController.createUser);
app.get("/api/v1/users/:id", userController.getUserById);
app.post("/api/v1/users/login", userController.logUserIn);
app.put("/api/v1/users/:id", userController.updateBestScoreAndGamePlayed);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})
