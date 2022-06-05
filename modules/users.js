const db = require('./db-init');

const authenticateUser = async (email, password) => {
    const isAuthenticated = await db('users').where('email', email).andWhere('password', password)
    return isAuthenticated.length !== 0;
}

const getCompanyNameOfUser = async (email) => {

    try {
        const companies = await db('users').select('company_name').where('email', email);

        if (companies.length === 0) {
            throw 'Company or user not found!'
        }

        return companies[0].company_name;

    } catch (err) {
        throw err;
    }
}

module.exports = {
    authenticateUser,
    getCompanyNameOfUser,
}