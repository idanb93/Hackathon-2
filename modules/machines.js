const db = require('./db-init');

const getMachinesByCompanyName = async (companyName) => {
    const machines = await db('machines').where('companyName', companyName);
    return machines;
}

module.exports = {
    getMachinesByCompanyName,
}