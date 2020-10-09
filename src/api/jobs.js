import { Router } from "express";
import { Op } from "sequelize";
import { getProfile } from "../middleware/getProfile";
import { Contract } from "../models/contract.model";
export class Jobs {
    constructor() {
        this.router = new Router();
        this.router.use(getProfile);
        this.router.get(`/unpaid`, this.getUnpaidActiveJobs);
        this.router.post(`/:job_id/pay`, this.payJobById);
        return this.router;
    }

    async getUnpaidActiveJobs(req, res) {
        const { profile } = req;
        const { Job } = req.app.get('models');
        const jobs = await Job.findAll({
            where: {
                paid: { [Op.not]: true },
            },
            include: {
                model: Contract,
                attributes: [],
                where: {
                    [Op.or]: [
                        { ClientId: profile.id },
                        { ContractorId: profile.id }
                    ]
                }
            }
        });
        if (!jobs) return res.status(404).end()
        res.json(jobs)
    }

    async payJobById(req, res) {
        const { profile, params: { job_id } } = req;
        const { Job, Profile, Contract } = req.app.get('models');
        const sequelize = req.app.get('sequelize');
        const jobToPay = await Job.findByPk(job_id);
        const contractJob = await Contract.findByPk(jobToPay.ContractId);

        if (Jobs.canProfilePayJob(profile, jobToPay, contractJob)) {
            const t = await sequelize.transaction();

            await Profile.update(
                { balance: (profile.balance - jobToPay.price) },
                {
                    where: { id: profile.id }
                },
                { transaction: t }
            );

            const contractor = await Profile.findByPk(contractJob.ContractorId);

            await Profile.update(
                { balance: (profile.balance + parseFloat(jobToPay.price)) },
                {
                    where: { id: contractor.id }
                },
                { transaction: t }
            );

            await Job.update({ paid: true }, { where: { id: jobToPay.id } }, { transaction: t });

            await t.commit();

        } else {
            res.json("You can't pay this Job");
            return
        }

        res.json(jobToPay)
    }

    /**
     * Validate if Profile can pay a Job
     * @param {*} profile Profile who pays
     * @param {*} job Job to pay
     * @param {*} contract binding contract
     */
    static canProfilePayJob(profile, job, contract) {
        switch (true) {
            case !(profile.balance >= job.price):
                return false;
            case (profile.id != contract.ClientId):
                return false;
            case (job.paid):
                return false;
            default: return true;
        }
    }
}
