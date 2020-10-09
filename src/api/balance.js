import { Router } from "express";

import { getProfile } from "../middleware/getProfile";

export class Balance{
    constructor(){
        this.router = new Router();
        this.router.use(getProfile);
        this.router.post(`/deposit/:userId`, this.deposit);
        return this.router;
    }

    async deposit(req,res){

    }
}