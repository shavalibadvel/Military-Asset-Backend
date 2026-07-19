var express = require("express");
var cors = require("cors");
var connectDB = require("./db");
var apiLogger = require("./middleware/logger");

var authRoutes = require("./routes/AuthRoutes");
var dashboardRoutes = require("./routes/DashboardRoutes");
var purchaseRoutes = require("./routes/PurchaseRoutes");
var transferRoutes = require("./routes/transferRoutes");
var assignmentRoutes = require("./routes/AssignmentRoutes");

var server = express();
var PORT = 8085;

server.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
server.use(express.json());    
server.use(apiLogger);        



server.use("/api/auth", authRoutes);             
server.use("/api/dashboard", dashboardRoutes);  
server.use("/api/purchases", purchaseRoutes);    
server.use("/api/transfers", transferRoutes);   
server.use("/api/assignments", assignmentRoutes); 


server.get("/api/health", function (req, res) {
  res.json({ status: "OK", message: "Military Asset Management API is running successfully so" });
});

async function startServer() {
  await connectDB();   

  server.listen(PORT, function () {
    console.log("is working")
    console.log("Server running at http://localhost:" + PORT);
    console.log("Health checking: http://localhost:" + PORT + "/api/health");
  });
}

startServer();