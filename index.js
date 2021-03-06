const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(()=>console.log("DB Connection successful"))
  .catch((err)=> {
    console.log(err)
  });

app.use(express.json());

app.use("/api/auth", authRoute);
/* app.get("/api/users/usertest", (req, res) => {
    res.send("user test is successful");
}); */
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

app.listen(process.env.PORT || 5000, ()=>{
    console.log("Backend server is running!")
})