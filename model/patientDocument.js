const mongoose = require('mongoose')

const patientDocument = new mongoose.Schema({
    patient_id: {
        type: String
    },

    data: [
        {
            image_data: {
                type: String
            }
        }
    ]


});


const PatientDocument = new mongoose.model('PatientDocuments', patientDocument)




module.exports = PatientDocument;