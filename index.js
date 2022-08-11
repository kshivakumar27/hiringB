const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
//const URL = "mongodb+srv://tejas:Tejas11@cluster0.vpuuy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//const URL = "mongodb+srv://shivakumar:Test1234@cluster0.kot9grj.mongodb.net/?retryWrites=true&w=majority";
//const URL = "mongodb+srv://shivakumark:Test1234@cluster0.kot9grj.mongodb.net/?retryWrites=true&w=majority";
const URL = "mongodb://127.0.0.1:27017/hiring"
const DB = "hiring";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




app.use(cors())
app.use(express.json());











//posting the candidate registration details
app.post("/register", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //check wheater email is unique
        let uniqueEmail = await db.collection("users").findOne({ email: req.body.email });

        if (uniqueEmail) {
            res.json({
                message: "email already exist"
            })
        } else {
            let salt = await bcrypt.genSalt(10);

            let hash = await bcrypt.hash(req.body.password, salt);

            //encrypting the paasword using bycrypt 
            req.body.password = hash;

            //inserting deatails of candidates 
            let users = await db.collection("users").insertOne(req.body);

            await connection.close();
            res.json({
                message: "User Registerd"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

//posting the candidate login details 
app.post("/login", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        //finding the email ispresent in the user collection
        let user = await db.collection("users").findOne({ email: req.body.email })

        if (user) {

            //comparing the given password and password present in the daatabase
            let isPassword = await bcrypt.compare(req.body.password, user.password);
            if (isPassword) {
                
                //generating the JWT token
               // let token = jwt.sign({ _id: user._id }, process.env.secret)
                let token = jwt.sign({ _id: user._id }, "qwertyuiop")
                res.json({
                    message: "allow",
                    token,
                    id: user._id
                })
            } else {
                res.json({
                    message: "Email or password is incorrect"
                })
            }
        } else {
            res.json({
                message: "Email or password is incorrect"
            })
        }
    } catch (error) {
        console.log(error)
    }
})


// regestration for recruiter
app.post("/recregister", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //check wheater email is unique
        let uniqueEmail = await db.collection("recruiter").findOne({ email: req.body.email });

        if (uniqueEmail) {
            res.json({
                message: "email already exist"
            })
        } else {
            let salt = await bcrypt.genSalt(10);

            let hash = await bcrypt.hash(req.body.password, salt);

            //encrypting the paasword using bycrypt 
            req.body.password = hash;

            //inserting deatails of recruiter 
            let users = await db.collection("recruiter").insertOne(req.body);

            await connection.close();
            res.json({
                message: "User Registerd"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

//posting the recrutier login details 
app.post("/reclogin", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //finding the email ispresent in the recruiter collection
        let user = await db.collection("recruiter").findOne({ email: req.body.email })

        if (user) {
            //comparing the given password and password present in the daatabase
            let isPassword = await bcrypt.compare(req.body.password, user.password);
            if (isPassword) {

                //generating the JWT token
               // let token = jwt.sign({ _id: user._id }, process.env.secret)
                let token = jwt.sign({ _id: user._id }, "qwertyuiop")

                res.json({
                    message: "allow",
                    token,
                    id: user._id
                })
            } else {
                res.json({
                    message: "Email or password is incorrect"
                })
            }
        } else {
            res.json({
                message: "Email or password is incorrect"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

/*
function authenticate(req, res, next) {
    //Check if there is a Token
    if (req.headers.authorization) {
        //Token is present
        //Check if the token is valid or expired
        try {
            let jwtValid = jwt.verify(req.headers.authorization, process.env.secret);
            if (jwtValid) {
                req.userId = jwtValid._id;
                next();
            }
        } catch (error) {
            res.status(401).json({
                message: "Invalid Token"
            })
        }

    }
    else {
        res.status(401).json({
            message: "No Token Present"
        })
    }

}
*/
//getting user by email

app.get("/user/:id", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //getting user details for the corresponding email
        let user = await db.collection("users").findOne({ email: req.params.id })
        res.json(user)
        await connection.close();
    } catch (error) {
        console.log(error)

    }
})

//getting recruiter by email

app.get("/recruiter/:id", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //getting recruiter details for the corresponding email
        let user = await db.collection("recruiter").findOne({ email: req.params.id })
        res.json(user)
        await connection.close();
    } catch (error) {
        console.log(error)

    }
})

//posting job details by recruiter

app.post("/company", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //inserting job detaials to companies collection
        await db.collection("companies").insertOne(req.body);
        await connection.close();
        res.json({
            message: "company created"
        })
    } catch (error) {
        console.log(error)
    }
})


//getting recruiter by id

app.get("/recruiters/:id", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //getting recruiter details for the corresponding id
        let recruiter = await db.collection("recruiter").findOne({ _id: mongodb.ObjectID(req.params.id) })
        res.json(recruiter)
        await connection.close();
    } catch (error) {
        console.log(error)
    }
})

//getting user by id

app.get("/users/:id", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //getting user details for the corresponding id
        let users = await db.collection("users").findOne({ _id: mongodb.ObjectID(req.params.id) })
        res.json(users)
        await connection.close();
    } catch (error) {
        console.log(error)
    }
})

//getting job details

app.get("/job",  async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //getting  details of all the jobs
        let companies = await db.collection("companies").find().toArray();
        res.json(companies)
        await connection.close();
    } catch (error) {
        console.log(error)
    }
})



//posting job details by recruiter

app.post("/upcomingcompany", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //inserting job detaials to companies collection
        await db.collection("upcomingcompanies").insertOne(req.body);
        await connection.close();
        res.json({
            message: "upcoming company created"
        })
    } catch (error) {
        console.log(error)
    }
})


app.get("/upcomingjob",  async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //getting  details of all the jobs
        let companies = await db.collection("upcomingcompanies").find().toArray();
        res.json(companies)
        await connection.close();
    } catch (error) {
        console.log(error)
    }
})































//posting applied job details by user

app.post("/apply", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //check wheather the job is applied or not
        let unique = await db.collection("appliedjobs").findOne({ unique: req.body.unique});
        if (unique) {
            res.json({
                message: "Already applied to this job"
            })
        } else{
            //post the job details and user details for the appliedjobs collection
            await db.collection("appliedjobs").insertOne(req.body);
            await connection.close();
            res.json({
                message:"job applied"
            })
        }
       
      
    } catch (error) {
        console.log(error)
    }
})

//getting applied job details for users

app.get("/appliedjob/:id",  async function (req, res) {
    
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //getting appliedjob details for the corresponding user email
        let jobs = await db.collection("appliedjobs").find({ email: req.params.id}).toArray();
        res.json(jobs)
        await connection.close();
    } catch (error) {
        console.log(error)
    }
})















app.post("/interested", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //check wheather the job is applied or not
        let unique = await db.collection("interestedjobs").findOne({ unique: req.body.unique});
        if (unique) {
            res.json({
                message: "Already shown interest to this job"
            })
        } else{
            //post the job details and user details for the appliedjobs collection
            await db.collection("interestedjobs").insertOne(req.body);
            await connection.close();
            res.json({
                message:"job applied"
            })
        }
       
      
    } catch (error) {
        console.log(error)
    }
})






app.get("/interestedjob/:id",  async function (req, res) {
    
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //getting appliedjob details for the corresponding user email
        let jobs = await db.collection("interestedjobs").find({ email: req.params.id}).toArray();
        res.json(jobs)
        await connection.close();
    } catch (error) {
        console.log(error)
    }
})








//getting applied job details for recruiters

app.get("/viewcandidates/:id",  async function (req, res) {
    
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //getting appliedjob details for the corresponding recruiter email
        let jobs = await db.collection("appliedjobs").find({ recemail: req.params.id}).toArray();
        res.json(jobs)
        await connection.close();
    } catch (error) {
        console.log(error)
    }
})




app.get("/viewinterestedcandidates/:id",  async function (req, res) {
    
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //getting appliedjob details for the corresponding recruiter email
        let jobs = await db.collection("interestedjobs").find({ recemail: req.params.id}).toArray();
        res.json(jobs)
        await connection.close();
    } catch (error) {
        console.log(error)
    }
})


app.listen(3001)

app.listen(process.env.PORT || 5000)