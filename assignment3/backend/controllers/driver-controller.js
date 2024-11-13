const Driver = require('../models/driver');
const admin = require("firebase-admin");
const firestore = admin.firestore();
const mongoose = require('mongoose');

exports.addDriver = async (req, res) => {
    const { driver_name, driver_department, driver_licence, driver_isActive } = req.body;

    try {
        const newDriver = new Driver({
            driver_name,
            driver_department,
            driver_licence,
            driver_isActive
        });

        const savedDriver = await newDriver.save();
        const increment = firestore.collection('data').doc('stats');
        await increment.update({
          create: admin.firestore.FieldValue.increment(1)
        });

        res.status(201).json({
            id: savedDriver._id,
            driver_id: savedDriver.driver_id
        });
    } catch (err) {

        if (err.name === 'ValidationError') {
            // Mongoose validation error
            console.error('Validation error:', err.message);
            return res.status(400).json({ error: 'Invalid data', details: err.errors });
        }

        console.error("Error saving the driver:", err);
        res.status(500).send("Server Error");
    }
};

exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find({}).populate('assigned_packages');
        const studentFullName = "Hao-I Lin";
        const studentId = "33049386";
        const increment = firestore.collection('data').doc('stats');
        increment.update({
            retrieve: admin.firestore.FieldValue.increment(1)
        });

        res.status(200).json({
            studentFullName,
            studentId,
            drivers
        });
    } catch (err) {
        console.error("Error fetching drivers:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteDriverById = async (req, res) => {
    const { _id } = req.params;

    try {
        const result = await Driver.findByIdAndDelete({ _id });
        const increment = firestore.collection('data').doc('stats');
        increment.update({
            delete: admin.firestore.FieldValue.increment(1)
        });

        if (result) {
            res.status(200).json({
                acknowledged: true,
                deletedCount: 1
            });
        } else {
            res.status(404).json({
                acknowledged: true,
                deletedCount: 0
            });
        }
    } catch (err) {
        console.error("Error deleting the driver:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.updateDriverById = async (req, res) => {
    const { _id, driver_licence, driver_department } = req.body;

    // check if driver_licence is Alphanumeric of length 5 and driver_department is Alphabets and spaces
    if (!/^[a-zA-Z0-9]{5}$/.test(driver_licence)) {
        return res.status(400).json({ message: "Invalid driver licence" });
    }

    if (!/^[a-zA-Z\s]*$/.test(driver_department)) {
        return res.status(400).json({ message: "Invalid driver department" });
    }

    try {
        const updatedDriver = await Driver.findOneAndUpdate(
            { _id: _id },
            { driver_licence, driver_department },
            { new: true }
        );

        if (!updatedDriver) {
            return res.status(404).json({ status: "ID not found" });
        }

        const increment = firestore.collection('data').doc('stats');
        increment.update({
            update: admin.firestore.FieldValue.increment(1)
        });

        res.status(200).json({ status: "Driver updated successfully" });
    } catch (err) {
        console.error("Error updating driver:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getDriverById = async (req, res) => {
    const { _id } = req.params;

    console.log("Driver ID:", _id);
    try {
        const driver = await Driver.findById({ _id });
        if (!driver) {
            return res.status(404).json({ status: "Driver not found" });
        }

        const increment = firestore.collection('data').doc('stats');
        await increment.update({
          retrieve: admin.firestore.FieldValue.increment(1)
        });

        res.status(200).json(driver);
    } catch (err) {
        console.error("Error fetching driver:", err);
        res.status(500).json({ message: "Server Error" });
    }
}
