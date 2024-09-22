const { Router } = require("express");
const orderRouter = require("./order-routes");
const userRouter = require("./user-routes");

const router = Router();

// Prefix all routes defined in `bookRoutes.js` with `/books
router.use('/users', userRouter);
router.use("/orders", orderRouter);

module.exports = router;

// activity 14.05
