import app from "./app.js";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";

dotenv.config();

// PORT 
const PORT = process.env.PORT;


const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is up and running at ${PORT}`);  
    })
}


startServer();