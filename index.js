
const express = require("express");
const cors = require("cors")
const User = require("./db/User");
require('./db/config')
const user = require("./db/User");
const Product = require("./db/Product");
const app = express();
app.use(cors());
app.use(express.json());
app.post("/register", async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result);
})

app.post("/login", async (req, res) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            res.send(user);
        } else {
            res.send({ result: "No user found" });
        }

    }
    else {
        res.send({ result: "No user found" });
    }
})

app.post("/add-product", async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
})

app.get("/products", async (req, res) => {
    let products = await Product.find();
    if (products.length > 0) {
        res.send(products);
    } else {
        res.send({ result: "No Product Found" })
    }
})

app.delete("/products/:id", async (req, res) => {
    const result = await Product.deleteOne({ _id: req.params.id })
    res.send(result)
})

app.get("/products/:id", async (req, res) => {
    let result = await Product.findOne({_id:req.params.id })
    if (result) {
        res.send(result)
    }
    else {
        res.send({ result: "No record found" })
    }
})

app.put("/products/:id",async(req,res)=>{
  let result =await Product.updateOne(
    {_id:req.params.id},
    {$set:req.body}
  )
  res.send(result)
})

app.get("/search/:key", async(req,res)=>{
    let result = await Product.find({
        "$or":[
            {
                name:{$regex: req.params.key}
            },
            {company:{$regex: req.params.key}},
            {price:{$regex: req.params.key}},
            {category:{$regex: req.params.key}}
        ]
    })
    res.send(result);
})
app.listen(8085);