const mysql = require('mysql2')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const cors = require('cors')
app.use(cors());

const router = express.Router()
app.use(router)

const path = require('path')
const fs = require('fs')

const dotenv = require('dotenv')
dotenv.config()

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API Endpoint to Get Accounts
router.get('/api/accounts', (req, res) => {
    const sql = 'SELECT Ad.Admin_ID, Ad.Admin_Firstname, Ad.Admin_Lastname, Ac.Account_Mail, Ac.Account_Tel, Ac.Account_Password FROM Admins Ad JOIN Manages M ON Ad.Admin_ID = M.Admin_ID JOIN Accounts Ac on M.Account_ID = Ac.Account_ID;'; // 'Accounts' is the table name

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }

        res.json(results);
    });
});

// API Endpoints to Get Tutors for all tutor page
router.get('/all-tutor', (req, res) => {
    const sql = `SELECT CONCAT(a.Account_FirstName, ' ', a.Account_LastName) AS TutorName, t.Tutor_ID AS id, t.Education AS Education, t.Location AS Location FROM TutorInformation t JOIN Accounts a ON t.Account_ID = a.Account_ID`;

    //const sql = `SELECT a.Account_FirstName, t.Education, t.Location FROM TutorInformation t JOIN Accounts a ON t.Account_ID = a.Account_ID`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching tutors:", err);
            res.status(500).json({ error: "Error fetching tutors" });
            return;
        }
        console.log("Tutors fetched successfully:", result);
        return res.json(result);

    });
});


// for fetch all tutors
router.get('/tutorinfo', (req, res) => {
    db.query(`
        SELECT *
        FROM TutorInformation t
        JOIN Accounts a ON t.Account_ID = a.Account_ID;
    `, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

//for fetching tutor information by tutorID
router.get('/tutorinfo/:id', (req, res) => {
    // console.log(req.params)
    console.log(req.params.id)

    db.query(`SELECT *
    FROM TutorInformation t
    JOIN Accounts a ON t.Account_ID = a.Account_ID
    WHERE t.Tutor_ID = "${req.params.id}";`, (err, result) => {
        if (err) throw err;
        console.log(result[0])
        res.send(result[0]);
    })
})

//for fetching admin information by adminID
router.get('/admininfo/:email', (req, res) => {
    const email = req.params.email;

    db.query(`SELECT *
    FROM Accounts ac
    JOIN Manages m ON ac.Account_ID = m.Account_ID
    JOIN Admins ad ON m.Admin_ID = ad.Admin_ID
    WHERE ac.Account_Mail = ?;`, [email], (err, result) => {
        if (err) throw err;
        console.log(result[0]);
        res.send(result[0]);
    });
});


// ---------------------------------------------------------------------------------------Product Management---------------------------------------------------------------------------------------
//pro man show all
// API Endpoint to Get All Tutor Information
router.get('/all-tutor-information', (req, res) => {
    const sql = `
        SELECT *
        FROM TutorInformation
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching tutor information:", err);
            res.status(500).json({ error: "Error fetching tutor information" });
            return;
        }
        console.log("Tutor information fetched successfully:", results);
        return res.json(results);
    });
});

// Testcase: Postman Add Start
// POST | http://localhost:3031/temp-tutor-insert-data
// {
//     "tutor": {
//         "Account_FirstName": "John",
//         "Account_LastName": "Doe",
//         "Account_Mail": "john@example.com",
//         "Account_Tel": "1234567890",
//         "Account_Password": "password123",
//         "Education": "Bachelors Degree",
//         "Experience": "5 years",
//         "SubjectsOffered": "Math, Science",
//         "TeachingApproach": "Interactive",
//         "Availability": "Weekdays",
//         "Location": "City, Country",
//         "Rates": "50",
//         "imgpath": "/path/to/image.jpg"
//     }
// }

//pro add start here
router.post('/temp-tutor-insert-data', (req, res) => {
    querymaxTutorIDnum = `SELECT *
FROM TutorInformation
WHERE Tutor_ID LIKE 'Tutor%'
ORDER BY CAST(SUBSTRING(Tutor_ID, 6) AS UNSIGNED) DESC
LIMIT 1`;
    querymaxAccountIDnum = `SELECT *
FROM Accounts
WHERE Account_ID LIKE 'ACC%'
ORDER BY CAST(SUBSTRING(Account_ID, 4) AS UNSIGNED) DESC
LIMIT 1`;

    console.log(req.body);
    const newTutor = req.body.tutor

    // Initialize variables for new IDs
    var newTutorID;
    var newAccountID;

    db.query(querymaxTutorIDnum, function (error, results) {
        if (error) throw error;

        // Generate new Tutor ID
        const lastTutorID = results[0].Tutor_ID;
        newTutorID = 'Tutor' + (parseInt(lastTutorID.substring(5)) + 1).toString().padStart(3, '0');
        newTutorID = newTutorID.trim();
        console.log("New tutor ID : " + newTutorID);

        // After generating new Tutor ID, execute the insertion query for Accounts
        db.query(querymaxAccountIDnum, function (error, results) {
            if (error) throw error;

            // Generate new Account ID
            const lastAccountID = results[0].Account_ID;
            newAccountID = 'ACC' + (parseInt(lastAccountID.substring(3)) + 1).toString().padStart(3, '0');
            newAccountID = newAccountID.trim();
            console.log("New account ID : " + newAccountID);

            console.log("Inserting new user!");
            if (!newTutor) {
                return res.status(400).send({ error: true, message: 'Please provide user information' });
            }

            // Insert into Accounts table
            db.query(`INSERT INTO Accounts (Account_ID, Account_FirstName, Account_LastName, Account_Mail, Account_Tel, Account_Password) values('${newAccountID}', '${newTutor.Account_FirstName}','${newTutor.Account_LastName}','${newTutor.Account_Mail}','${newTutor.Account_Tel}', '${newTutor.Account_Password}')`, function (error, accountResults) {
                if (error) {
                    console.error('Error inserting new account:', error);
                    return res.status(500).send({ error: true, message: 'Failed to create new user.' });
                }

                // Insert into TutorInformation table
                db.query(`INSERT INTO TutorInformation (Tutor_ID, Account_ID, Education, Experience, SubjectsOffered, TeachingApproach, Availability, Location, Rates, imgpath) values('${newTutorID}','${newAccountID}', '${newTutor.Education}','${newTutor.Experience}','${newTutor.SubjectsOffered}','${newTutor.TeachingApproach}','${newTutor.Availability}','${newTutor.Location}','${newTutor.Rates}','${newTutor.imgpath}')`, function (error, userResults) {
                    if (error) {
                        console.error('Error inserting new user:', error);
                        return res.status(500).send({ error: true, message: 'Failed to create new user.' });
                    }

                    // Send response after both insertion queries are executed
                    return res.status(201).send({ error: false, data: userResults.affectedRows, message: 'New user has been created successfully.', newTutor });
                });
            });
        });
    });
});
//pro add end here


// Postman: Edit Start
// PUT | http://localhost:3031/edit?accid=ACC031&tutorid=Tutor011
// {
//     "tutor": {
//         "Account_FirstName": "Johnson",
//         "Account_LastName": "Doe",
//         "Account_Mail": "john@example.com",
//         "Account_Tel": "1234567890",
//         "Account_Password": "password123",
//         "Education": "Bachelors Degree",
//         "Experience": "10 years",
//         "SubjectsOffered": "Math, Science",
//         "TeachingApproach": "Interactive",
//         "Availability": "Weekdays",
//         "Location": "City, Country",
//         "Rates": "THB 1600 per session",
//         "imgpath": "/path/to/image.jpg"
//     }
// }

//pro edit edit start here
router.put('/edit', (req, res, next) => { //edit?accid=${accid}&tutorid=${tutorid}
    const accidtext = req.query.accid;
    const tutoridtext = req.query.tutorid;
    const user = req.body.tutor;

    const sql = `
    UPDATE TutorInformation AS t
    JOIN Accounts AS a ON t.Account_ID = a.Account_ID 
    SET ?
    WHERE t.Account_ID LIKE ? AND t.Tutor_ID LIKE ?;
    `;

    const params = [user, `%${accidtext}%`, `%${tutoridtext}%`];
    console.log(user)
    db.query(sql, params, function (error, accountResults) {
        if (error) {
            console.error('Error updating account:', error);
            return res.status(500).send({ error: true, message: 'Failed to update user.' });
        }
        return res.send({ error: false, data: accountResults.affectedRows, message: 'User has been updated successfully.' });

    });
});
//pro edit edit end here


// Edit search route
router.get('/edit-search', (req, res) => {
    const accidtext = req.query.accid;
    const tutoridtext = req.query.tutorid;
    const fnametext = req.query.name;

    const sql = `
        SELECT *
        FROM TutorInformation t
        JOIN Accounts a ON t.Account_ID = a.Account_ID 
        WHERE t.Account_ID LIKE ?
        AND t.Tutor_ID LIKE ?
        AND a.Account_FirstName LIKE ?;
    `;

    const params = [`%${accidtext}%`, `%${tutoridtext}%`, `%${fnametext}%`];

    db.query(sql, params, (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ error: true, message: 'Failed to fetch users.' });
        }

        if (results.length > 0) {
            return res.json({ error: false, data: results, message: 'Users retrieved' });
        } else {
            return res.status(404).json({ error: true, message: 'No users found' });
        }
    });
});
//pro edit search end here

//pro delete search start here
router.get('/delete-search', (req, res) => {
    const accidtext = req.query.accid;
    const tutoridtext = req.query.tutorid;
    const fnametext = req.query.name;

    const sql = `
        SELECT *
        FROM TutorInformation t
        JOIN Accounts a ON t.Account_ID = a.Account_ID 
        WHERE t.Account_ID LIKE ?
        AND t.Tutor_ID LIKE ?
        AND a.Account_FirstName LIKE ?;
    `;

    const params = [`%${accidtext}%`, `%${tutoridtext}%`, `%${fnametext}%`];

    db.query(sql, params, (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ error: true, message: 'Failed to fetch users.' });
        }

        if (results.length > 0) {
            return res.json({ error: false, data: results, message: 'Users retrieved' });
        } else {
            return res.status(404).json({ error: true, message: 'No users found' });
        }
    });
});
//pro delete search end here


// Postman delete by id
// DELETE | http://localhost:3031/delete/ACC031

//pro delete pro delete start here
router.delete('/delete/:id', (req, res) => {
    let userId = req.params.id;
    const sql = `
        DELETE t
        FROM TutorInformation t
        JOIN Accounts a ON t.Account_ID = a.Account_ID 
        WHERE t.Account_ID IN (
        SELECT a.Account_ID
        FROM Accounts a 
        WHERE t.Account_ID LIKE ?
    );
    `;

    db.query(sql, userId, (error, results) => {
        if (error) {
            console.error('Error deleting account:', error);
            return res.status(500).json({ error: true, message: 'Failed to delete account.' });
        }

        if (results.affectedRows > 0) {
            return res.json({ error: false, message: 'Account deleted successfully.' });
        } else {
            return res.status(404).json({ error: true, message: 'No account found matching the criteria.' });
        }
    });
});
//pro delete pro delete end here


// ---------------------------------------------------------------------------------------Admin Account Management---------------------------------------------------------------------------------------
// add admin account
function getNextAdminID(currentAdminID) {
    // Extract the numeric part from the current ID
    let numberPart = parseInt(currentAdminID.slice(2));

    // Increment the number part
    numberPart++;

    // Check if the number part exceeds 99
    if (numberPart > 99) {
        throw new Error('Maximum Admin ID reached');
    }

    // Format the number part to always have two digits
    let formattedNumber = numberPart.toString().padStart(2, '0');

    // Combine with prefix "Ad" to form the new Admin ID
    return 'Ad' + formattedNumber;
}

//admin add start here
router.post('/addadmin', (req, res) => {

    querymaxAdminsID = `SELECT *
FROM Admins
WHERE Admin_ID LIKE 'Ad%'
ORDER BY CAST(SUBSTRING(Admin_ID, 3) AS UNSIGNED) DESC
LIMIT 1`;

    querymaxAccountsID = `SELECT *
FROM Accounts
WHERE Account_ID LIKE 'ACC%'
ORDER BY CAST(SUBSTRING(Account_ID, 4) AS UNSIGNED) DESC
LIMIT 1`;

    console.log(req.body);
    const newAdmin = req.body.admin

    // const newAdmins = { firstName, lastName, email, telephone, password } = req.body;

    // Initialize variables for new IDs
    var newAccountID;
    var newAdminID;

    db.query(querymaxAdminsID, function (error, results) { // ad then acc
        if (error) throw error;


        // Generate new Admin ID
        const lastAdminID = results[0].Admin_ID;
        newAdminID = 'Ad' + (parseInt(lastAdminID.substring(2)) + 1).toString().padStart(2, '0');
        newAdminID = newAdminID.trim();
        // newAdminID = getNextAdminID(newAdminID)

        console.log("New Admin ID : " + newAdminID);

        // After generating new Tutor ID, execute the insertion query for Accounts
        db.query(querymaxAccountsID, function (error, results) {
            if (error) throw error;

            // Generate new Account ID
            const lastAccountID = results[0].Account_ID;
            newAccountID = 'ACC' + (parseInt(lastAccountID.substring(3)) + 1).toString().padStart(3, '0');
            newAccountID = newAccountID.trim();
            console.log("New account ID : " + newAccountID);


            console.log("Inserting new user!");
            if (!newAccountID) {
                return res.status(400).send({ error: true, message: 'Please provide user information' });
            }

            // [newAccountID, firstName, lastName, email, telephone, password]
            db.query('INSERT INTO Accounts (Account_ID, Account_FirstName, Account_LastName, Account_Mail, Account_Tel, Account_Password) values(?, ?, ?, ?, ?, ?)', [newAccountID, newAdmin.Account_FirstName, newAdmin.Account_LastName, newAdmin.Account_Mail, newAdmin.Account_Tel, newAdmin.Account_Password], function (error, accountResults) {
                if (error) {
                    console.error('Error inserting new account:', error);
                    return res.status(500).send({ error: true, message: 'Failed to create new user.' });
                }


                // Use parameterized queries
                db.query('INSERT INTO Admins (Admin_ID, Admin_FirstName, Admin_LastName) values(?, ?, ?)', [newAdminID, newAdmin.Account_FirstName, newAdmin.Account_LastName], function (error, userResults) {
                    if (error) {
                        console.error('Error inserting new user:', error);
                        return res.status(500).send({ error: true, message: 'Failed to create new user.' });
                    }


                    //add table manage
                    db.query('INSERT INTO Manages (`Admin_ID`,`Account_ID`)VALUES (?, ?)', [newAdminID, newAccountID], function (error, userResults) {
                        if (error) {
                            console.error('Error inserting new user:', error);
                            return res.status(500).send({ error: true, message: 'Failed to create new user.' });
                        }

                        // Send response after both insertion queries are executed
                        //res.redirect('http://localhost:3030/account-manage');
                        return res.status(201).send({ error: false, data: userResults.affectedRows, message: 'New user has been created successfully.', newAdminID });
                    });

                });
            });
        });

    });
});

//admin delete search start here
router.get('/admin-delete-search', (req, res) => {
    const accountidtext = req.query.accid;
    const adminidtext = req.query.adminid;

    const sql = `
    SELECT *
    FROM Accounts a 
    JOIN Manages m ON a.Account_ID = m.Account_ID
    JOIN Admins ad ON m.Admin_ID = ad.Admin_ID
    WHERE a.Account_ID LIKE ? AND ad.Admin_ID LIKE ?;
    `;

    const params = [`%${accountidtext}%`, `%${adminidtext}%`];

    db.query(sql, params, (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ error: true, message: 'Failed to fetch users.' });
        }

        if (results.length > 0) {
            return res.json({ error: false, data: results, message: 'Users retrieved' });
        } else {
            return res.status(404).json({ error: true, message: 'No users found' });
        }
    });
});
//admin delete search end here

//admin delete delete start here
router.delete('/deleteadmin', (req, res) => {
    let accid = req.query.accid;
    let adminid = req.query.adminid;

    if (!accid || !adminid) {
        return res.status(400).send({ error: true, message: 'Please provide user ID' });
    }

    // Delete from Manages table first
    db.query("DELETE FROM Manages WHERE Admin_ID = ?", adminid, function (error, results) {
        if (error) {
            console.error('Error deleting user:', error);
            return res.status(500).send({ error: true, message: 'Failed to delete user.' });
        }



        return res.send({ error: false, message: 'Admin and associated data have been deleted successfully.' });
    });
});


//admin edit edit start here
router.put('/admin-edit', (req, res, next) => {
    const accountidtext = req.query.accid;
    const adminidtext = req.query.adminid;
    const {tutor, newAdmin} = req.body.requestBody;

    if (!accountidtext || !adminidtext) {
        return res.status(400).send({ error: true, message: 'Please provide user information' });
    }

    db.query("UPDATE Accounts SET ? WHERE Account_ID = ?", [tutor, accountidtext], function (error, accountResults) {
        if (error) {
            console.error('Error updating account:', error);
            return res.status(500).send({ error: true, message: 'Failed to update user.' });
        }

        db.query("UPDATE Admins SET ? WHERE Admin_ID = ?", [newAdmin, adminidtext], function (error, userResults) {
            if (error) {
                console.error('Error updating user:', error);
                return res.status(500).send({ error: true, message: 'Failed to update user.' });
            }

            return res.send({ error: false, data: userResults.affectedRows, message: 'User has been updated successfully.' });
        });
    });
});
//admin edit edit end here

//pro edit search start here
// Edit search route
router.get('/admin-edit-search', (req, res) => {
    const accidtext = req.query.accid;
    const adminidtext = req.query.adminid;

    const sql = `
    SELECT *
    FROM Accounts a 
    JOIN Manages m ON a.Account_ID = m.Account_ID
    JOIN Admins ad ON m.Admin_ID = ad.Admin_ID
    WHERE a.Account_ID LIKE ? AND ad.Admin_ID LIKE ?;
    `;

    const params = [`%${accidtext}%`, `%${adminidtext}%`];

    db.query(sql, params, (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ error: true, message: 'Failed to fetch users.' });
        }

        if (results.length > 0) {
            return res.json({ error: false, data: results, message: 'Users retrieved' });
        } else {
            return res.status(404).json({ error: true, message: 'No users found' });
        }
    });
});


// ---------------------------------------------------------------------------------------Login for Administrator---------------------------------------------------------------------------------------
//for fetching admin information to show in Admin control panel page
router.get('/admin-controlpanel', (req, res) => {
    // console.log(req.query)
    const id = req.query.id
    
    db.query(`SELECT *
         FROM Accounts ac
         JOIN Admins a ON t.Account_ID = a.Account_ID
         WHERE t.Tutor_ID = ${id}`, (err, result) => {
        if (err) throw err;
        console.log(result)

        return res.send(result)
    })
})


router.post('/admin-email-password', (req, res) => {
    const { email, password } = req.body;
    const query = `
        SELECT Ac.Account_ID, Ac.Account_Mail, Ac.Account_Password
        FROM Admins Ad 
        JOIN Manages M ON Ad.Admin_ID = M.Admin_ID
        JOIN Accounts Ac ON M.Account_ID = Ac.Account_ID
        WHERE Ac.Account_Mail = ?;
    `;

    db.query(query, [email], (err, result) => {
        if (err) {
            console.error('SQL error', err);
            return res.status(500).send({ error: true, message: 'Internal server error' });
        }
        if (result.length === 0) {
            return res.send({ loginCHECK: false });
        } else {
            const { Account_Password, Account_Mail } = result[0];
            if (password === Account_Password) {
                return res.send({ loginCHECK: true, admin_token: Account_Mail });
            } else {
                return res.send({ loginCHECK: false });
            }
        }
    });
});

// ---------------------------------------------------------------------------------------Searching and Filtering Tutor---------------------------------------------------------------------------------------
router.get('/search-tutor', (req, res) => {
    const { name, subject, location } = req.query;

    let sql = `
        SELECT CONCAT(a.Account_FirstName, ' ', a.Account_LastName) AS Name
        FROM TutorInformation t
        JOIN Accounts a ON t.Account_ID = a.Account_ID
    `;

    let params = [];

    router.get('/search-tutor', (req, res) => {
        const { name, subject, location } = req.query;

        let sql = `
            SELECT CONCAT(a.Account_FirstName, ' ', a.Account_LastName) AS Name
            FROM TutorInformation t
            JOIN Accounts a ON t.Account_ID = a.Account_ID
        `;

        let params = [];

        if (name && subject && location) {
            sql = `
                SELECT CONCAT(a.Account_FirstName, ' ', a.Account_LastName) AS Name
                FROM TutorInformation t
                JOIN Accounts a ON t.Account_ID = a.Account_ID
                WHERE CONCAT(a.Account_FirstName, ' ', a.Account_LastName) LIKE ?`;
            params = [`%${name}%`];
        } else {
            if (name || subject || location) {
                sql += ' WHERE ';

                if (name) {
                    sql += `CONCAT(a.Account_FirstName, ' ', a.Account_LastName) LIKE ? `;
                    params.push(`%${name}%`);
                }
                if (subject) {
                    if (params.length > 0) sql += ' AND ';
                    sql += `t.SubjectsOffered LIKE ? `;
                    params.push(`%${subject}%`);
                }
                if (location) {
                    if (params.length > 0) sql += ' AND ';
                    sql += `t.Location LIKE ? `;
                    params.push(`%${location}%`);
                }
            }
        }
    });
});

// Postman search all
// GET | http://localhost:3031/search

router.get('/search', (req, res) => {
    const sql = `
    SELECT *
    FROM Accounts a
    JOIN TutorInformation t ON t.Account_ID = a.Account_ID;
    `;
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ error: true, message: 'Failed to fetch users.' });
        }

        if (results.length > 0) {
            return res.json({ error: false, data: results, message: 'Users retrieved' });
        } else {
            // return res.json({ error: false, data: results, message: 'Users retrieved' });
            console.log('Tutor not found');
            // return res.status(404).json({ error: true, message: 'No users found' });
        }
    });
});

// Postman search special 1 input
// GET | http://localhost3031/search-sp?name=pran&location=?&subject=?

// Postman search special 2 input
// GET | http://localhost3031/search-sp?name=Paranee&location=?&subject=Genetics

// Postman search special 3 input
// GET | http://localhost3031/search-sp?name=Paranee&location=bangkok&subject=Genetics

router.get('/search-sp', (req, res) => {
    const fnametext = req.query.name;
    const subject = req.query.subject;
    const location = req.query.location;

    var fname = ''
    var subj = ''
    var loc = ''

    if (fnametext !== '') {
        fname = `%${fnametext}%`
    } else {
        fname = '%';
    }

    if (subject !== '') {
        subj = `%${subject}%`
    } else {
        subj = '%';
    }

    if (location !== '') {
        loc = `%${location}%`
    } else {
        loc = '%';
    }

    console.log(fname)
    console.log(subj)
    console.log(loc)

    const sql = `
    SELECT *
    FROM Accounts a
    JOIN TutorInformation t ON t.Account_ID = a.Account_ID
    where a.Account_FirstName like ?
    AND t.SubjectsOffered LIKE ?
    AND t.Location LIKE ?;
    `;

    const params = [fname, subj, loc];

    db.query(sql, params, (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ error: true, message: 'Failed to fetch users.' });

        }

        if (results.length > 0) {
            return res.json({ error: false, data: results, message: 'Users retrieved' });
        } else {
            // return res.status(404).json({ error: true, message: 'No users found' });
            return res.json({ error: false, data: [], message: 'Users not found' });;
        }

    });

});


// Server listening
app.listen(process.env.PORT, function () {
    console.log("Server listening at Port " + process.env.PORT);
});

