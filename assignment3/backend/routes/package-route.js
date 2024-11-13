const express = require("express");
const router = express.Router();
const packageController = require("../controllers/package-controller");

router.post("/add-package", packageController.addPackage);
router.get("/packages", packageController.getAllPackages);
router.delete("/delete-package/:_id", packageController.deletePackage);
router.put("/update-package", packageController.updatePackageDestination);
router.get("/get-packages-by-driver-id/:_id", packageController.getPackagesByDriverId);

module.exports = router;
