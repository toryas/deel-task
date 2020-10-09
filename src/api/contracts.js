import { Router } from "express";
import { Op } from "sequelize";

import { getProfile } from "../middleware/getProfile";

export class Contracts {
    constructor() {
        this.router = new Router();
        this.router.use(getProfile);
        this.router.get(`/:id`, this.getContractById);
        this.router.get(`/`,this.getUnfinishContrants)
        return this.router;
    }

    async getContractById(req, res) {
        const { params: { id }, profile } = req;
        const { Contract } = req.app.get('models');
        const contract = await Contract.findOne({
            where: {
                id: id,
                [Op.or]: [
                    { ClientId: profile.id },
                    { ContractorId: profile.id }
                ]
            },
            raw: true
        })
        if (!contract) return res.status(404).end();
        res.json(contract)
    }

    async getUnfinishContrants(req, res) {
        const { profile } = req;
        const { Contract } = req.app.get('models');

        const contracts = await Contract.findAll({
            where: {
                [Op.or]: [
                    { ClientId: profile.id },
                    { ContractorId: profile.id }
                ],
                status: { [Op.ne]: `terminated` }
            }
        });
        if (!contracts) return res.status(404).end();
        res.json(contracts)
    }

}
