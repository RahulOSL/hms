const mongoose = require('mongoose')

const bloodReport = new mongoose.Schema({
    test_name: {
        type: String
    },
    department: {
        type: String,
    },
    amount: {
        type: String
    }


});


const BloodReport = new mongoose.model('BloodReports', bloodReport)




module.exports = BloodReport;