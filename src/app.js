import express from 'express';
import bodyParser from 'body-parser';
import { ModelUtil } from './utils/model.helper'
import { Contracts } from './api/contracts';
import { Jobs } from './api/jobs';
import { Admin } from './api/admin';


export class App {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.loadModels(this.app);
        this.loadApis(this.app);
        return this.app;
    }

    loadModels(app) {
        const sequelize = ModelUtil.init();
        app.set('sequelize', sequelize)
        app.set('models', sequelize.models)
    }

    loadApis(app) {
        app.use(`/contracts`, new Contracts());
        app.use(`/jobs`,new Jobs());
        app.use(`/admin`,new Admin());
    }
}