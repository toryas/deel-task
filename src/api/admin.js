import { Router } from "express";
import { QueryTypes } from 'sequelize';

export class Admin {
    constructor() {
        this.router = new Router();
        this.router.get(`/best-profession`, this.bestProfesion);
        this.router.get(`/best-clients`, this.bestClient);
        return this.router;
    }

    async bestProfesion(req, res) {
        const sequelize = req.app.get('sequelize');
        const { start, end } = req.query;
        const result = await sequelize.query(`
        select a.profession, sum(b.price) as total from Profiles a , 
        Jobs b , Contracts c 
        where c.ContractorId = a.id 
        and b.ContractId = c.id and b.paid is true and b.paymentDate between date('${start}') AND date('${end}')  
        group by a.profession order by sum(b.price) desc`, { type: QueryTypes.SELECT });
        if (!result || !start || !end) return res.status(404).end()
        res.json(result);
    }
    async bestClient(req, res) {

    }
}