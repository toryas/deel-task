import { Router } from "express";

export class Admin {
    constructor() {
        this.router = new Router();
        this.router.get(`/best-profession`, this.bestProfesion);
        this.router.get(`/best-clients`, this.bestClient);
        return this.router;
    }

    async bestProfesion(req, res) {
        const sequelize = req.app.get('sequelize');
        const [result,metadata] = await sequelize.query(`select a.profession, sum(b.price),b.paid from Profiles a , Jobs b , Contracts c where c.ContractorId = a.id and b.ContractId = c.id and b.paid is true and b.paymentDate between date('2000-01-01') AND date('2022-12-31')  group by a.profession`); 
        return result;
    }
    async bestClient(req, res) {

    }
}