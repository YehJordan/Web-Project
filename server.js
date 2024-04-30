const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const moment = require('moment-timezone');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const session = require('express-session')
const port = 5233;

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day in milliseconds
      }
}));

// Multer middleware for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(__dirname + '/uploads'));

// Set the view engine to use EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
    // Render your EJS template
    res.render('index');
});

app.get('/browse', (req, res) => {
    res.render('browse');
});

app.get('/find', (req, res) => {
    res.render('find');
});

app.get('/dogCare', (req, res) => {
    res.render('dogCare');
});

app.get('/catCare', (req, res) => {
    res.render('catCare');
});

app.get('/give', (req, res) => {
    res.render('give');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/disclamer', (req, res) => {
    res.render('disclamer');
});

app.get('/created', (req, res) => {
    res.render('created');
});

app.get('/existName', (req, res) => {
    res.render('existName');
});

app.get('/badName', (req, res) => {
    res.render('badName');
});

//Create account
app.get('/account', (req, res) => {
    res.render('account');
});

//login
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/petsubmission', (req, res) => {
    res.render('petsubmission')
});

app.get('/loginfail', (req, res) => {
    res.render('loginfail')
});
app.get('/findpet', (req, res) => {
    res.render('findpet')
});

//Find pet from info in petData.txt

app.post('/findpet', (req, res) => {
    const searchCriteria = req.body;

    // Read the contents of the pet data text file
    fs.readFile('petdata.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file.');
        }

        // Parse the pet data
        const pets = data.split('\n').map(entry => {
            const [
                user,
                animalChoice,
                breed,
                ageRange,
                gender,
                behavior,
                features,
                petImage,
                firstName,
                email
            ] = entry.split(':');
            return {
                user,
                animalChoice,
                breed,
                ageRange,
                gender,
                behavior,
                features,
                petImage,
                firstName,
                email
            };
        });

        // Filter the pets based on search criteria
        const filteredPets = pets.filter(pet => {
            return (!searchCriteria.AnimalChoice || pet.animalChoice === searchCriteria.AnimalChoice) &&
                (!searchCriteria.breed || pet.breed === searchCriteria.breed) &&
                (!searchCriteria.Age || pet.ageRange === searchCriteria.Age) &&
                (!searchCriteria.gender || pet.gender === searchCriteria.gender);
        });

        res.render('findpet', { pets: filteredPets });
    });
});

//Checks if session is active before accessing the Give Pet form
app.get('/givePet', (req, res) => {
    // check if session is active
    if (!req.session || !req.session.username) {
        return res.redirect('login');//redirects to login page if no session is active
    }
    else{
        return res.redirect('give');  //redirects to the give page 
    }
})

//Receive info from the give pet form
app.post('/petsubmission', upload.single('petImage'), (req, res) => {
    const formData = req.body;


    // Extract form data
    const userID = req.session.username;
    const animalChoice = formData.AnimalChoice || '';
    const breed = formData.breed || '';
    const ageRange = formData.Age || '';
    const gender = formData.gender || '';
    const behaviour = Array.isArray(formData.behaviour) ? formData.behaviour : [formData.behaviour]; // Ensure behaviour is an array
    const features = formData.features || '';
    const petImage = req.file; // This contains information about the uploaded image
    const firstName = formData.firstName || '';
    const lastName = formData.lastName || '';
    const email = formData.emailAddress || '';

    // Format data
    const dataToWrite = `${userID}:${animalChoice}:${breed}:${ageRange}:${gender}:${behaviour.join(',')}:${features}:${petImage.filename}:${firstName}:${email}\n`;

    // Write data to text file
    fs.appendFile('petData.txt', dataToWrite, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving data.');
        }
        res.redirect('petsubmission');
    });
});

app.post('/created', (req, res) => {
    const { person, password } = req.body;
    const formattedData = `${person}:${password}\n`;

    //checks if username is properly formatted
    const goodUsername = /^[a-zA-Z0-9]{4,}$/;
    if(!goodUsername.test(person)){
        return res.redirect('/badName');
    }

    // Read the contents of the text file
    fs.readFile('login.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file.');
        }

        // Parse the contents and validate the name (incorrect format or duplicate )
        const usernames = data.split('\n').map(entry => entry.split(':')[0]);

        if (usernames.includes(person)) {
            return res.redirect('/existName');
        }

        // If username is unique, proceed with account creation
        // Append the new username/password pair to the end of the file
        fs.appendFile('login.txt', formattedData, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving data.');
            }
            res.redirect('/created');
        });
    });
});


//Login page

//Logout post request
app.get('/logout', (req, res) => {
    // check if session is active
    if (!req.session || !req.session.username) {
        return res.redirect('login'); //redirects to the login page
    }

    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out.');
        }
        
        // Clear the session cookie from the client's browser
        res.clearCookie('sessionID');

        // Redirect the user to the login page or any other desired page
        res.redirect('logoutSuccess');
    });
});

app.get('/logoutSuccess', (req, res) => {
    res.render('logoutSuccess')
});

// Handle login POST request
app.post('/login', (req, res) => {
    const { person, password } = req.body;

    // Read login credentials from file
    fs.readFile('login.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading login file.');
        }

        // Parse credentials and check if username and password match
        const credentials = data.split('\n').map(line => line.split(':'));
        const validUser = credentials.find(([name, pass]) => name === person && pass === password);

        if (validUser) {
            req.session.username = person;
            res.redirect('give');
        } else {
            res.redirect('loginfail');
        }
    });
});


// Start the server

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});