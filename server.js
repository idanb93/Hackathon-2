// Imports:

const express = require('express');
const dotenv = require('dotenv');
const cookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');

const { createNewTable } = require('./modules/db-essentials');

const {
    validate,
    signup,
    signin,
    adminPage,
    dashboard,
} = require('./src/services/authService');

// Config Environmental Variables:

dotenv.config();

// Initiate App:

const app = express();

app.listen(process.env.EXPRESS_SERVER_PORT, () => {
    console.log(`Server is listening on ${process.env.EXPRESS_SERVER_PORT}`);
})

const openRoutes = [
    '/index',
    '/signin',
    '/signup',
    '/logo',
];

app.use(cookieSession({ signed: false }));

app.use('/', async (req, res, next) => {

    // Checks if the url entered is allowed
    const isOpenRoute = openRoutes.some((openRoute) => {
        return req.originalUrl.startsWith(openRoute);
    });

    // Chceks if the url entered is the defualt route
    const isDefaultRoute = (req.originalUrl === '/');

    if (!isOpenRoute && !isDefaultRoute) {

        const token = req.session?.JwtHttpOnly; // with http-only
        const isValidToken = await validate(token);

        if (!token) {
            res.redirect('/');
            return;
        }
        if (!isValidToken){
            res.clearCookie('session');
            return res.status(200).json({msg: 'The session has ended, please login again!'});
        }
    }
    next();
})

// Populate database with tables:

createNewTable('users');
createNewTable('machines');

// Express server routes:

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/signup', (req, res) => {

    const {email, password, companyName} = req.body;
    
    signup(email, password, companyName)
        .then(data => {
            res.status(200).send({msg: ' You have successfully signed up!'}).end();
        })
        .catch(err => {
            res.status(400).send({ error: '400', msg: ' Email is already in use!' }).end();
        })
})

app.post('/signin', (req, res, next) => {

    const {email, password} = req.body;
    signin(email, password)
        .then(token => {

            if (req.session) {
                req.session.JwtHttpOnly = token;
            }
            res.status(200).send({msg: ' You have successfully signed in!'}).end();
        })
        .catch(err => {
            res.status(400).send({error: '400', msg: " Invalid email or password!"}).end();
        })
})

app.get('/dashboard', (req, res)=>{

    let companyName = '';

    jwt.verify(req.session.JwtHttpOnly, process.env.JWT_PK, (err, decoded)=>{
        companyName = decoded['company_name'];
    });

    dashboard(companyName)
    .then(data => {
        res.status(200).send(data).end();
    })
    .catch(err => {
        res.status(400).send(err);
    })
})

app.post('/admin-page', (req, res) => {

    const { host, typeOfInstance, region } = req.body;

    let companyName = '';

    try {
        jwt.verify(req.session.JwtHttpOnly, process.env.JWT_PK, (err, decoded) => {
            companyName = decoded['company_name'];
        });
    }
    catch (err){
        res.status(401).send({msg: 'Your session has ended!'}).end();
    }

    if (companyName){
        adminPage(host, typeOfInstance, region, companyName)
        .then(data => {
            res.status(200).send({msg: ' You have successfully added a new machine!'}).end();
        })
        .catch(err => {
            res.status(400).send({msg: ' There was a problem adding a new machine'}).end();
        })
    }

})


app.get('/signout', (req, res) => {
    res.clearCookie('session').status(200).send({msg: 'You have successfully signed out!'}).end();
})
