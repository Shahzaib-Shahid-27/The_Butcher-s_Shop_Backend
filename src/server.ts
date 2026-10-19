import "dotenv/config";
import express, { type Request, type Response } from "express";

import cors from "cors";
import { db } from "./prisma/db.ts";
import { authRouter } from "./routes/auth.route.ts";
import productRoutes from "./routes/product.routes.ts";
import { errorHandler } from "./middleware/error.middleware.ts";
import categoryRoutes from "./routes/category.routes.ts";
import cartRoutes from "./routes/cart.routes.ts";
import cartItemRoutes from "./routes/cartItem.routes.ts";

import cookieParser from "cookie-parser";

const app = express();  
const port = Number(process.env.PORT) || 3000;


// Middleware 

app.use(express.json());
app.use(express.urlencoded({  extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://the-butcher-s-shop-frontend.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as some API tools.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked origin: ${origin}`));
      }
    },
    credentials: true,
  })
);


app.use(cookieParser());
//router
app.use('/api/v1/auth',authRouter);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories",categoryRoutes);
app.use("/api/v1/carts",cartRoutes);
app.use("/api/v1/cart-items",cartItemRoutes);


app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString() 
    });
});

app.get("/", (req: Request, res: Response) => {
    res.send("The Bucther's Shop server is running");
});

app.use(errorHandler);


const startserver  = async  () => {

    try{
        
        await db.connect();

        app.listen(port, "0.0.0.0", async () => {
            console.log(`\n The Bucther's Shop server is running on port ${port} \n DataBase Connected Successfully...\n`);
        });

    }catch(error){
        console.log(`Error Connecting DB....`,error)
    }
}

startserver();
