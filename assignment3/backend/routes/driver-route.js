const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver-controller");

router.post("/add-driver", driverController.addDriver);
router.get("/drivers", driverController.getAllDrivers);
router.delete("/delete-driver/:_id", driverController.deleteDriverById);
router.put("/update-driver", driverController.updateDriverById);
router.get("/get-driver-by-id/:_id", driverController.getDriverById);

module.exports = router;
