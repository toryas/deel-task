const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
    const { params: { id }, profile } = req;
    const { Contract } = req.app.get('models');
    const contract = await Contract.findOne({
        where: {
            id: id,
            [Op.or]: [
                { ClientId: profile.id },
                { ContractorId: profile.id }
            ]
        }
    })
    if (!contract) return res.status(404).end()
    res.json(contract)
})
module.exports = app;
