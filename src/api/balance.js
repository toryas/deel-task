import { Router } from "express";
import { QueryTypes } from 'sequelize';

export class Balance {
    constructor() {
        this.router = new Router();
        this.router.post(`/deposit/:userId`, this.deposit);
        return this.router;
    }

    async deposit(req, res) {
        console.log("asd");
        const { Profile } = req.app.get('models');
        const sequelize = req.app.get('sequelize');
        const { userId } = req.params;
        const { amount } = req.body;
        const profile = await Profile.findOne({ where: { id: userId || 0 } })
        if (!profile) return res.status(401).end();
        const queryResult = await sequelize.query(`
        select 
        sum(b.price) as totalToPaid
        from Profiles a , Jobs b , Contracts c 
        where c.ClientId = a.id 
        and b.ContractId = c.id 
        and b.paid is not true 
        and a.id =${profile.id}`, { type: QueryTypes.SELECT });


        const { totalToPaid } = queryResult[0];

        if (amount > (totalToPaid / 4)) {
            res.json({ error: "You cant deposit more than 25% of total paid jobs" })
            return;
        }

        await Profile.update({ balance: (profile.balance + parseFloat(amount)) }, { where: { id: profile.id } });
        res.json("Deposit done");
    }


}