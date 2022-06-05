const { getMachinesByCompanyName } = require("../../modules/machines");
const { isPrimaryKeyExist, addNewRecordToTable} = require('../../modules/db-essentials');
const { authenticateUser, getCompanyNameOfUser } = require('../../modules/users');

const jwt = require('jsonwebtoken');

const generateToken = (email, company_name)=>{
    try {
        const token = jwt.sign(
            // payload contains identifier + uniqe field (e.g expiration time)
            { email, company_name, expiresIn: new Date((new Date().getTime() + 5 * 60000)) },
            process.env.JWT_PK, // secret key from .env
            { expiresIn: '30s' } // 5 minutes
        );

        return token;
    } catch(err) {
        throw err;
    }
}

const validate = async (token)=>{
    try {
        return await jwt.verify(token, process.env.JWT_PK, (err, decoded) => {
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    } catch(err) {
        return false;
    }
}

const signup = async (email, password, companyName)=>{
    try {
        const isExist = await isPrimaryKeyExist('users', 'email', email);

        if (isExist) {
            throw `${email} is already in use!`;
        }

        await addNewRecordToTable('users', {email, password, company_name: companyName});

    } catch (err) {
        throw err;
    }
}

const adminPage = async (host, typeOfInstance, region, companyName)=>{

    try {
        const isExist = await isPrimaryKeyExist('machines', 'host', host);

        if (isExist) {
            throw `${host} is already in use!`;
        }
        await addNewRecordToTable('machines', {host, typeOfInstance, region, companyName});

    } catch (err) {
        throw err;
    }

}

const dashboard = async(companyName)=>{
    try{
        const machines = await getMachinesByCompanyName(companyName);
        return machines;
    } catch (err) {
        throw err;
    }
    
}

const signin = async (email, password) =>{
        try {
        const isValidCerdentials = await authenticateUser(email, password);

        if (!isValidCerdentials) {
            throw 'Invalid email or password';
        }

        const companyName = await getCompanyNameOfUser(email);
        const token = generateToken(email, companyName);

        return token;

    } catch (error) {
        throw error;
    }
}

module.exports = {
    generateToken,
    validate,
    signup,
    signin,
    adminPage,
    dashboard,
}