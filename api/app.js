import express  from "express";
import mongoose from "mongoose"
import helmet from "helmet";

const port = 3001
const app = express()
mongoose.set('strictQuery', true);
const conn = mongoose.connection;

main().catch(err => console.log(err));
main().then(() => {
  console.log("mongo connection established");
})

const logSchema = new mongoose.Schema({
  remote: String,
  host: String,
  user: String,
  method: String,
  path: String,
  code: String,
  size: String,
  referer: String,
  agent: String,
  time: Date
});

const Log = mongoose.model('logs', logSchema);

async function main() {
    await mongoose.connect('mongodb://root:root@localhost:27017/admin', {
      authSource: "admin",
      user: "root",
      pass: "root",
    })
}

conn.on('error', console.error.bind(console, 'connection error:'));

app.use(helmet());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/logs",async (req,res) => {
  try{
    const logs = await Log.find()
    res.json(logs)
  }catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.listen(port, () => {
  console.log(`server running on ${port}`)
})
