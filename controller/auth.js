const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
require('../database/connection')
const authenticate = require('../middleware/authenticate');
const sendMail = require('../sendMail/sendMail');
const approverMailSent = require('../sendMail/approverMailSent')
const afterApprovedMailSent = require('../sendMail/afterApprovedMailSent')
const multer = require('multer')
var path = require('path');
const excelToJson = require('convert-excel-to-json');
const xlsxj = require("xlsx-to-json-lc");

//Database
const User = require('../model/userSchema')
const PatientEntry = require('../model/patientEntry')
const PatientDocument = require('../model/patientDocument')
const BloodReport = require('../model/bloodReport')




const bcrypt = require('bcryptjs')
const crypto = require('crypto');

const cookieParser = require('cookie-parser')
router.use(cookieParser())

//Multer File Run
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './documents/');
    },
    filename: function (req, file, cb) {
        // cb(null, Date.now() + '_' + file.originalname);
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    // fileFilter: fileFilter1
});

// Admin Data
const storageAdmin = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './controller/AdminData/');
    },
    filename: function (req, file, cb) {
        // cb(null, Date.now() + '_' + file.originalname);
        cb(null, 'data.xlsx');
    }
});

const uploadAdmin = multer({
    storage: storageAdmin,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    // fileFilter: fileFilter1
});
router.use(express.static(path.join(__dirname, 'AdminData')));

//Sign In API

router.post('/signIn', async (req, res) => {
    try {
        let jwtToken
        const {
            email,
            password
        } = req.body
        // console.log(email)
        if (!email || !password) {
            return res.status(422).json({
                error: 'plz fill all the details'
            })
        }
        const userLogin = await User.findOne({
            email: email
        });
        //console.log(userLogin);



        const loginAccess = userLogin.login_access



        if (userLogin) {

            //generate JWT token for authentication

            //compare password 
            const passwordMatch = await bcrypt.compare(password, userLogin.password);
            if (!passwordMatch) {
                res.status(400).json({
                    error: "Invalid password "
                })

            } else {

                jwtToken = await userLogin.generateAuthToken();

                res.cookie("Token", jwtToken, {
                    expires: new Date(Date.now() + 43200000),
                    httpOnly: true
                });

                res.json({
                    message: "user login successfully"
                })
            }

        } else {
            res.status(400).json({
                error: "Invalid user "
            })
        }
    } catch (error) {
        console.log(error)
        // res.json({
        //     message: "Credential not valid or received!!!"
        // })
        res.status(420).json({
            error: "Credential not valid or received!!!"
        })
        console.log("Credential not valid or received!!!");
    }

})




router.get('/userInfo', authenticate, async (req, res) => {
    try {
        // console.log(req.rootUser);
        res.send(req.rootUser);

    } catch (error) {
        console.log("User data not send or get!!!");
    }
})

//clear all token of logged user
router.post('/clearTokens', async (req, res) => {
    try {
        const {
            email
        } = req.body
        // console.log(user_no)
        if (!email) {
            return res.status(422).json({
                error: 'Employee number not received'
            })
        } else {
            const result = await User.updateOne({
                email: email
            }, {
                $unset: {
                    jwtTokens: "",
                    moduleType: ""
                }
            });
            console.log(result);
            res.status(201).json({
                message: 'Removed token !!!'
            })
        }
    } catch (error) {
        console.log("User id not received!!!");
    }
})


// logout functionality (clear the cookie from the browser)
router.get('/logout', (req, res) => {
    try {
        // console.log('Logout page ....');
        res.clearCookie('Token', {
            path: '/'
        });
        res.status(200).send('user Logout');
    } catch (error) {
        console.log("Cookies or Credential not clear !!!");
    }
})

//Get the data from database and show on User management table
router.get('/displayUser', authenticate, async (req, res) => {
    try {
        const usersInfo = await User.find({});
        //req.usersInfo=usersInfo;
        res.json(usersInfo);
    } catch (error) {
        console.log("User data not send or get!!!");
    }
})

//Register user

router.post('/registerUser', async (req, res) => {
    try {
        const data = req.body
        console.log(data)

        const saveUserData = new User({
            name: data.name,
            email: data.email,
            user_type: data.user_type,
            department: data.department,
            doctor_fees: data.doctor_fees,
            password: "Test@111"
        })
        const result = await saveUserData.save();

        res.status(201).json({
            message: "User registered"
        })

    } catch (error) {
        console.log(error)
    }
})

//delete the user in User management table
router.post('/deleteUser', async (req, res) => {
    try {
        const email = req.body;
        const emp_email = Object.values(email);
        console.log(email, emp_email);

        if (!emp_email) {
            return res.status(422).send("Employee number is not valid!!!");
        }
        const deleteUserData = await User.deleteOne({
            email: emp_email
        });


        if (deleteUserData) {
            return res.status(201).json("Employee deleted!!!");
        } else {
            return res.status(400).json("Employee not deleted!!!");
        }
    } catch (error) {
        console.log(error)
        console.log("Data not valid or received !!!");
    }
})

//Save Patient Entry

router.post("/submitPatientInfo", async (req, res) => {
    try {
        const data = req.body;
        console.log(data)

        const patientEntry = new PatientEntry({
            currentTime: data.currentTime,
            name: data.name,
            others_name: data.others_name,
            blood_group: data.blood_group,
            age: data.age,
            area: data.area,
            gov_id_type: data.gov_id_type,
            gov_id: data.gov_id,
            phone_number: data.phone_number,
            gender: data.gender,
            medical_history: data.medical_history,
            health_data: {
                date_time: data.dateAndTime,
                blood_pressure: data.blood_pressure,
                height: data.height,
                weight: data.weight,
                blood_test: data.blood_test,
            },
            doctor_selection: data.doctor_selection,
            date_time: data.date_time,
            payment_mode: data.payment_mode,
            booking_amount: data.booking_amount,
            due_amount: data.due_amount,
            bill_amount: data.bill_amount,

        })
        // const result = await patientEntry.save();
        res.status(201).json({
            message: "Data inserted successfully"
        })
    } catch (error) {
        console.log(error)
    }
})
//Add health data of new record

router.post('/addHealthDataOfPatientData', async (req, res) => {
    try {
        const data = req.body
        console.log(data)
        const addHealthData = await PatientEntry.update({
            _id: data.id,
        },
            {
                $push: {
                    health_data: {
                        date_time: data.date_time,
                        blood_pressure: data.blood_pressure,
                        height: data.height,
                        weight: data.weight,
                        blood_test: data.blood_test,
                    }
                }
            }


        )
        res.status(201).json({
            message: "Data inserted successfully"
        })

    } catch (error) {
        console.log(error)
    }
})

//Display Patient data

router.get('/patientDataDisplay', async (req, res) => {
    try {
        const patientDataDisplay = await PatientEntry.find({});

        res.json(patientDataDisplay);
    } catch (error) {
        console.log(error)
    }
})

//delete the user in User management table
router.post('/deletePatientEntry', async (req, res) => {
    try {
        const id = req.body;
        const patient_id = Object.values(id);


        if (!patient_id) {
            return res.status(422).send("Employee number is not valid!!!");
        }
        const deleteUserData = await PatientEntry.deleteOne({
            _id: patient_id
        });


        if (deleteUserData) {
            return res.status(201).json("Employee deleted!!!");
        } else {
            return res.status(400).json("Employee not deleted!!!");
        }
    } catch (error) {
        console.log(error)
        console.log("Data not valid or received !!!");
    }
})


//Upload Prescriptions 

router.post('/uploadPrescriptions', async (req, res) => {
    try {
        const data = req.body
        console.log(data)
        const existingID = await PatientDocument.find({ patient_id: data.id })

        if (existingID.length !== 0 && existingID[0].patient_id === data.id) {
            const patientDocument = await PatientDocument.update({
                patient_id: data.id,
            },
                {
                    $push: {
                        data: {
                            image_data: data.prescription

                        }
                    }
                }

            )
        } else {
            const patientDocument = new PatientDocument({
                patient_id: data.id,
                data: {

                    image_data: data.prescription
                }
            })
            const result = await patientDocument.save();
        }


        res.status(201).json({
            message: "Data uploaded"
        })
    } catch (error) {
        console.log(error)
    }
})

router.get('/displayDocument', async (req, res) => {
    try {
        const getData = await PatientDocument.find({})
        res.json(getData)
    } catch (error) {
        console.log(error)
    }
})

//Get blood report data

router.get('/displayBloodReport', async (req, res) => {
    try {
        const getData = await BloodReport.find({}).sort({ _id: -1 })
        res.json(getData)

    } catch (error) {
        console.log(error)
    }
})

router.post('/sendBloodTestData', async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        const bloodtest = new BloodReport({
            test_name: data.test_name,
            department: data.department,
            amount: data.amount,
        })
        const result = await bloodtest.save()

        res.status(201).json({
            message: "Data uploaded"
        })

    } catch (error) {
        console.log(error)
    }
})

// Update blood test data 

router.post('/updateBloodTestData', async (req, res) => {
    try {
        const data = req.body;
        console.log(data)

        const updateData = await BloodReport.updateOne({ _id: data.id }, {
            $set: {
                test_name: data.test_name,
                department: data.department,
                amount: data.amount,
            }
        })
        res.status(201).json({
            message: "Data updated"
        })
    }

    catch (error) {
        console.log(error)
    }
})

//delete blood test data

router.post('/deleteBloodTestData', async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        if (!data.id) {
            return res.status(422).send("Employee number is not valid!!!");
        }
        const deleteUserData = await BloodReport.deleteOne({
            _id: data.id
        });
        res.status(201).json({
            message: "Data deleted"
        })

    } catch (error) {
        console.log(error)
    }
})


module.exports = router;