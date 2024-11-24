const express = require('express')
const app = express()

const router = express.Router()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

const path = require('path')
const fs = require('fs')

const dotenv = require('dotenv')
dotenv.config()

// for managing css file when sent to client 
app.use(express.static('frontend'))


router.get('/', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/homepage.html'))
})

router.get('/homepage', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/homepage.html'))
})

router.get('/all-tutor', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/all_tutor.html'))
})

router.get('/search-tutor', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/search_result.html'))
})

router.get('/no-tutor', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/no_result.html'))
})

router.get('/contact-us', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/contact_us.html'))
})

router.get('/product-add', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/product_add.html'))
})

router.get('/product-edit', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/product_edit.html'))
})

router.get('/product-delete', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/product_delete.html'))
})

router.get('/product-manage', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/product_manage.html'))
})

router.get('/my-profile', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/admin_homepage.html'))
})

router.get('/account-add', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/account_add.html'))
})

router.get('/account-edit', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/account_edit.html'))
})

router.get('/account-delete', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/account_delete.html'))
})


router.get('/account-manage', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/account_manage.html'))
})

// op
router.get('/admin-login', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/admin_login.html'))
})

router.get('/admin-homepage', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/admin_homepage.html'))
})

router.get('/admin-account', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, './frontend/html/account.html'))
})


// get tutor by id
router.get('/tutorinfo/:id', (req, res) => {
    console.log(req.params)
    console.log(req.params.id)
    const urltoFetch = `http://localhost:3031/tutorinfo/${req.params.id}`
    // console.log(urltoFetch)
    fetch(urltoFetch)
        .then(response => response.json())
        .then((queryDATA) => {
            console.log(queryDATA);


            const { Account_Mail, Account_Tel, Account_FirstName, Account_LastName, Education, Experience, SubjectsOffered, TeachingApproach, Availability, Location, Rates, imgpath } = queryDATA


            const tutorinformationTEMP =
                `<div class='profile'>
                    <img src="../pictures/user.png">
                
                    <div class='card'>
                        <p>${Account_FirstName} ${Account_LastName}</p>
                        <p class='green'>${Education}</p>
                    </div>

            </div>

            <div class='detail'>
                <h4>Name:</h4>
                <ul>${Account_FirstName} ${Account_LastName}</ul>
    
                <h4>Education:</h4>
                <ul>
                    <li>${Education}</li>
                
                </ul>
    
                <h4>Experience:</h4>
                <ul>
                    <li>${Experience}</li>
                    
                </ul>
    
                <h4>Subjects Offered:</h4>
                <div class='boxes'>
                <div class='box'>${SubjectsOffered}</div>
                </div>
    
                <h4>Teaching Approach:</h4>
                <ul>
                <li>${TeachingApproach}</li>
                </ul>
    
                <h4>Availability:</h4>
                <ul>
                    <li>${Availability}</li>
            
                </ul>
    
                <h4>Location:</h4>
                <div class='boxes'>
                    <div class='box'>${Location}</div>
            
                </div>
                <ul>
                    <li>Online tutoring available</li>
                </ul>
    
                <h4>Rates:</h4>
                <ul>
                    <li>${Rates}</li>
                    
                </ul>
    
                <h4>Contact Information:</h4>
                <ul>
                    <li>Phone: ${Account_Tel}</li>
                    <li>Email: ${Account_Mail}</li>
                </ul>
    
            </div>`;
            const productDetailsHTML = fs.readFileSync('./frontend/html/tutor_profile1.html', 'utf8');
            res.send(productDetailsHTML.replace('omg', tutorinformationTEMP));
        })
})

// get admin by id
router.get('/admininfo/:email', (req, res) => {
    console.log(req.params)
    console.log(req.params.id) // can I get by email though
    const urltoFetch = `http://localhost:3031/admininfo/${req.params.email}`;

    // console.log(urltoFetch)
    fetch(urltoFetch)
        .then(response => response.json())
        .then((queryDATA) => {
            console.log(queryDATA);


            const { Admin_FirstName, Admin_LastName, Account_Mail } = queryDATA


            const admininformationTEMP =
                `
                <div class="head">
                    <h1>Admin Control Panel</h1>
                </div>
                <nav>
                    <ul>
                        <li><a href="/admininfo/${Account_Mail}">My Profile</a></li>
                        <li><a href="/homepage">Home Page</a></li>
                        <li class="dropdown">
                            <a href="/product-manage" class="dropbtn">Tutor Management <i class="fa fa-caret-down"></i></a>
                            <div class="dropdown-content">
                                <a href="/product-add">Add</a>
                                <a href="/product-delete">Delete</a>
                                <a href="/product-edit">Edit</a>
                            </div>
                        </li>
            
                        <li class="dropdown">
                            <a href="/account-manage" class="dropbtn">Admin Management <i class="fa fa-caret-down"></i></a>
                            <div class="dropdown-content">
                                <a href="/account-add">Add</a>
                                <a href="/account-delete">Delete</a>
                                <a href="/account-edit">Edit</a>
                            </div>
                        </li>
                    </ul>
                </nav>
            
                <div class="container">
            
                    <div class="profile">
                        <img class="profile-image" src="../pictures/user.png" alt="Profile Image">
                        <div>
                            <h2>${Admin_FirstName} ${Admin_LastName}</h2>
                            <div>${Account_Mail}</div>
                        </div>
                    </div>
            
                    <div class="right">
                        <div class="welcome-text">Welcome back, ${Admin_FirstName}!</div>
            
                        <div class="card">
                            <h3>Product Management</h3>
                            <ul>
                                <li onclick="window.location.href='/product-add'">• Add Tutor</li>
                                <li onclick="window.location.href='/product-delete'">• Delete Tutor</li>
                                <li onclick="window.location.href='/product-edit'">• Edit Tutor Information</li>
                            </ul>
                        </div>
            
                        <div class="card">
                            <h3>Account Management</h3>
                            <ul>
                                <li onclick="window.location.href='/account-add'">• Add Account</li>
                                <li onclick="window.location.href='/account-delete'">• Delete Account</li>
                                <li onclick="window.location.href='/account-edit'">• Edit Account Information</li>
                            </ul>
                        </div>
                    </div>
            
                </div>`;
        

            const productDetailsHTML = fs.readFileSync('./frontend/html/admin_homepage.html', 'utf8');
            res.send(productDetailsHTML.replace('adminjra', admininformationTEMP));
        })
})


// router.get('/searchpagecondition', (req, res) => {
//     console.log(req.query)
//     console.log(req.query.search)

//     delete req.query.search;
//     console.log(req.query)
//     console.log(req.query.search)
// })




// fetch('http://localhost:3030/api/Accounts')
// fetch('http://localhost:3030/api/all-tutor')



app.listen(process.env.PORTFRONT, () => {
    console.log(`Front-end Server Connected to port ${process.env.PORTFRONT}`)
})

