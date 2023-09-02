const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('./utility/logger')
require("./db/conn")
const bodyParser = require("body-parser");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const addPost = require('./routes/addpost');
app.use(bodyParser.json());

// app.use(cors());
app.use("/uploads",express.static('uploads'));

// Routes
app.use("/api/user", userRoute);
app.use("/api/addpost", addPost);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});