const mongoose = require('mongoose')

const patientEntry = new mongoose.Schema({
    currentTime: {
        type: Number
    },
    name: {
        type: String
    },
    others_name: {
        type: String
    },
    age: {
        type: Number
    },
    area: {
        type: String
    },
    medical_history: {
        type: String,
    },
    gender: {
        type: String,
    },
    gov_id_type: {
        type: String
    },
    gov_id: {
        type: String
    },
    phone_number: {
        type: Number
    },
    blood_group: {
        type: String
    },
    health_data: [
        {
            date_time: {
                type: String,
            },
            blood_pressure: {
                type: String
            },
            height: {
                type: String
            },
            weight: {
                type: String
            },
            blood_test: {
                type: String
            },
        }
    ],

    doctor_selection: {
        type: String
    },
    date_time: {
        type: String
    },
    payment_mode: {
        type: String
    },
    booking_amount: {
        type: Number
    },
    due_amount: {
        type: Number
    },
    bill_amount: {
        type: Number
    },


});


const PatientEntry = new mongoose.model('PatientEntrys', patientEntry)




module.exports = PatientEntry;