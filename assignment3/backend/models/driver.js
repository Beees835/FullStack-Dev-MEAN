const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driverSchema = new Schema({
    driver_id: {
        type: String,
        unique: true,
        default: function () {
            const randomDigits = Math.floor(Math.random() * 90 + 10);
            const studentIdPart = "62"; // Adjust this as per your logic
            const randomLetters = Array(3).fill(null).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
            return `D${randomDigits}-${studentIdPart}-${randomLetters}`;
        }
    },
    driver_name: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Only allow letters and spaces and length of 3 to 20 inclusive
                return /^[a-zA-Z\s]{3,20}$/.test(v);
            },
            message: props => `${props.value} is not a valid driver name!`
        }
    },
    driver_department: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z\s]*$/.test(v);  // Only allow letters and spaces
            },
            message: props => `${props.value} is not a valid department name!`
        }
    },
    driver_licence: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                //also check for 5 didgits and Only alphanumeric characters
                return /^[a-zA-Z0-9]{5}$/.test(v);  // Only allow alphanumeric characters and 5 characters long
            },
            message: props => `${props.value} is not a valid licence number!`
        }
    },
    driver_isActive: {
        type: Boolean,
        default: true
    },
    driver_createdAt: {
        type: Date,
        default: Date.now
    },
    assigned_packages: {
        type: [String],
        default: []
    }
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
