import express from 'express';
import bodyParser from 'body-parser';
import { ModelUtil } from './utils/model.helper'
import { Contracts } from './api/contracts';


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
    }
}