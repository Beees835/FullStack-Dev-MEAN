const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    package_id: {
        type: String,
        unique: true,
        default: function () {
            const randomLetters = Array(2).fill(null).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
            const initials = "LC";
            const randomDigits = Math.floor(Math.random() * 900 + 100); // 3 random digit numbers
            return `P${randomLetters}-${initials}-${randomDigits}`;
        }
    },
    package_title: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Only allow letters and spaces and length 3 to 15 inclusive
                return /^[a-zA-Z\s]{3,15}$/.test(v);
            },
            message: props => `${props.value} is not a valid package title!`
        }
    },
    package_weight: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v > 0;  // Weight must be a positive number
            },
            message: props => `${props.value} is not a valid weight! Weight must be positive.`
        }
    },
    package_description: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // string can take special characters and spaces and 0 to 30 characters long
                return /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{0,30}$/.test(v);
            },
            message: props => `${props.value} is not a valid description!`
        }
    },
    package_destination: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                //Alphanumeric with length between 5 and 15 inclusive	
                return /^[a-zA-Z0-9]{5,15}$/.test(v);
            },
            message: props => `${props.value} is not a valid destination!`
        }
    },
    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',  // Reference to Driver model
        required: true,
        validate: {
            validator: function (v) {
                return mongoose.Types.ObjectId.isValid(v);  // Ensure it's a valid ObjectId
            },
            message: props => `${props.value} is not a valid driver ID!`
        }
    },
    isAllocated: {
        type: Boolean,
        required: false,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
