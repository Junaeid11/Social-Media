import 'dotenv/config'
import connectToMongo from './db/index.js'
import {app} from "./app.js"
const port = process.env.PORT || 8000;

connectToMongo()
.then(()=>{
  app.on("error", ()=>{
    console.log("ERROR", error);
  })
  app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`)
  })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
  });

// Export app as the serverless function for Vercel
export default (req, res) => {
  app(req, res); // Express app will handle the request
};
