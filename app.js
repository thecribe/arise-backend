import express from "express";
import userRoutes from "./api/recruitment/v1/routes/user.routes.js";
import visaRoutes from "./api/recruitment/v1/routes/visa.routes.js";
import siteDetailRoutes from "./api/recruitment/v1/routes/sitedetails.routes.js";
import roleRoutes from "./api/recruitment/v1/routes/role.routes.js";
import trainingRoutes from "./api/recruitment/v1/routes/training.routes.js";
import referenceRoutes from "./api/recruitment/v1/routes/reference.routes.js";
import screeningRoutes from "./api/recruitment/v1/routes/screening.routes.js";
import jobtypeRoutes from "./api/recruitment/v1/routes/jobtype.routes.js";
import departmentRoutes from "./api/recruitment/v1/routes/department.routes.js";
import completionRateRoutes from "./api/recruitment/v1/routes/completionRate.routes.js";
import emailRoutes from "./api/recruitment/v1/routes/email.routes.js";
import authRoutes from "./api/recruitment/v1/routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://arise.cribe.org",
  "https://recruitment-one-swart.vercel.app",
];

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(cookieParser());

const API_BASE_ROUTE = "/api/recruitment/v1";
// expose static route

app.use(
  "/static",
  express.static(path.join(process.cwd(), "public/static"), {
    setHeaders(res) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

//AUTH ROUTES
app.use(API_BASE_ROUTE, authRoutes);

//USER ROUTES
app.use(API_BASE_ROUTE, userRoutes);

//VISA ROUTE
app.use(API_BASE_ROUTE, visaRoutes);

//SITE DETAILS ROUTE
app.use(API_BASE_ROUTE, siteDetailRoutes);

//ROLE DETAILS ROUTE
app.use(API_BASE_ROUTE, roleRoutes);

//TRAINING AND CERTIFCATE ROUTE
app.use(API_BASE_ROUTE, trainingRoutes);
//REFERENCE  ROUTE
app.use(API_BASE_ROUTE, referenceRoutes);
//Screening  ROUTE
app.use(API_BASE_ROUTE, screeningRoutes);
//Job TYpe  ROUTE
app.use(API_BASE_ROUTE, jobtypeRoutes);
//Department ROUTE
app.use(API_BASE_ROUTE, departmentRoutes);
//Completion Rate ROUTE
app.use(API_BASE_ROUTE, completionRateRoutes);

//Email Route
app.use(API_BASE_ROUTE, emailRoutes);

export default app;
