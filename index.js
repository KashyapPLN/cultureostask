import express, { response } from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// const MONGO_URL = "mongodb://localhost";
// const MONGO_URL = "mongodb://127.0.0.1";
const MONGO_URL = process.env.MONGO_URL;

const PORT = 4000;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected ✌😊");
  return client;
}

const client = await createConnection();

// app.get('/',  function (req, res) {
//   res.send('Hello World')
// })
app.get('/',async function (req, res) {

 const desserts = await client.db("GID_project").collection("DessertsData").find({}).toArray()
    res.send(desserts)
  })

  app.get('/:id', async function (req, res) {
    const {id} = req.params;
    console.log(req.params,id);
    //  const item = desserts.filter((mi)=> mi.id==id);
    const item= await client.db("GID_project").collection("DessertsData").findOne({id:parseInt(id)})
    
    item ? res.send(item) : res.status(400).send({msg : "menu item not found"});
  })
 

  app.post('/',async function (req, res) {

    const data= req.body;
  console.log(data);
  const result = await client.db("GID_project").collection("DessertsData").insertMany(data);
    res.send(result);})
    


app.listen(PORT,()=>console.log(`App Started in ${PORT}`));