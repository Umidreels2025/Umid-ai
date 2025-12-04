const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const chatRoute = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api/chat", chatRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
