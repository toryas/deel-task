import { Router } from "express";
import { Op } from "sequelize";

import { getProfile } from "../middleware/getProfile";

export class Contracts {
    constructor() {
        this.router = new Router();
        this.router.use(getProfile);
        this.router.get(`/:id`, this.getContractById);
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
            raw:true
        })
        if (!contract) return res.status(404).end();
        res.json(contract)
    }

}
