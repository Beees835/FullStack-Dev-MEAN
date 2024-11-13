const mongodb = require("mongodb");
const Package = require('../models/package');
const Driver = require('../models/driver');
const path = require("path");
const VIEWS_PATH = path.join(__dirname, "../views");
const admin = require("firebase-admin");

const firestore = admin.firestore();

exports.addPackage = async (req, res) => {
    const { package_title, package_weight, package_description, package_destination, isAllocated, driver_id } = req.body;

    // Check if the package_destination is valid then create a new package instance
    try {
        const newPackage = new Package({
            package_title,
            package_weight,
            package_description,
            package_destination,
            isAllocated,
            driver_id
        });

        // Save the new package to the database
        const savedPackage = await newPackage.save();

        // We then update the driver's assigned_packages array
        const driverUpdateResult = await Driver.findByIdAndUpdate(
            driver_id,  // Find the driver by its ID
            { $push: { assigned_packages: savedPackage._id } },  // Push the new package _id into the assigned_packages array
            { new: true }  // Return the updated driver document
        );

        // Check if the driver was successfully updated
        if (!driverUpdateResult) {
            return res.status(400).json({ message: "Driver not found to assign package" });
        }

        const increment = firestore.collection('data').doc('stats');
        await increment.update({
          create: admin.firestore.FieldValue.increment(1)
        });

        // Return success response
        res.status(201).json({
            id: savedPackage._id,
            package_id: savedPackage.package_id,
            message: "Package created and assigned to driver successfully"
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            // Mongoose validation error
            console.error('Validation error:', err.message);
            return res.status(400).json({ error: 'Invalid data', details: err.errors });
        }
        console.error("Error saving the package or updating the driver:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find();

        const increment = firestore.collection('data').doc('stats');
        await increment.update({
          retrieve: admin.firestore.FieldValue.increment(1)
        });

        res.status(200).json(packages);
    } catch (err) {
        console.error("Error fetching packages:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deletePackage = async (req, res) => {
    const { _id } = req.params;

    try {
        const deletedPackage = await Package.findByIdAndDelete({ _id });

        const increment = firestore.collection('data').doc('stats');
        await increment.update({
          delete: admin.firestore.FieldValue.increment(1)
        });

        if (!deletedPackage) {
            return res.status(400).json({ acknowledged: true, deletedCount: 0 });
        }

        console.log("Deleted package:", _id);

        await Driver.updateMany(
            { assigned_packages: _id },
            { $pull: { assigned_packages: _id } }
        );

        res.status(200).json({ acknowledged: true, deletedCount: 1 });
    } catch (err) {
        console.error("Error deleting the package:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.updatePackageDestination = async (req, res) => {
    const { package_id, package_destination } = req.body;

    //check if the package_destination is valid
    if (!/^[a-zA-Z0-9]{5,15}$/.test(package_destination)) {
        return res.status(400).json({ status: "Invalid destination" });
    }

    try {
        const updatedPackage = await Package.findOneAndUpdate(
            { _id: package_id },
            { package_destination },
            { new: true }
        );

        if (!updatedPackage) {
            return res.status(400).json({ status: "Package not found" });
        }

        const increment = firestore.collection('data').doc('stats');
        increment.update({
            update: admin.firestore.FieldValue.increment(1)
        });

        res.status(200).json({ status: "updated successfully" });
    } catch (err) {
        console.error("Error updating package:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getPackagesByDriverId = async (req, res) => {
    const { _id } = req.params;
    console.log("Driver ID:", _id);
    try {
        const packages = await Package.find({ driver_id: _id });

        if (packages.length === 0) {
            return res.status(404).json({ message: 'No Packages Found' });
        }

        const increment = firestore.collection('data').doc('stats');
        await increment.update({
          retrieve: admin.firestore.FieldValue.increment(1)
        });

        res.status(200).json(packages);
    } catch (err) {
        console.error('Error fetching packages for driver:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

