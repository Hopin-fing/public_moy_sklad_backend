import 'reflect-metadata';
import 'module-alias/register';
import dotenv from 'dotenv';
import ip from 'ip';
import fetch from 'node-fetch';
import cors from 'cors';
import TYPES from './constants/types';
import ContractService from './Infrastructure/Configuration/usecases/ContractService';
import CounterpartyService from './Infrastructure/Configuration/usecases/CounterpartyService';
import ProductService from './Infrastructure/Configuration/usecases/ProductService';
import WarehouseService from './Infrastructure/Configuration/usecases/WarehouseService';
import UOMService from './Infrastructure/Configuration/usecases/UOMService ';
import OrderService from './Infrastructure/Configuration/usecases/OrderService';
import OrganizationService from './Infrastructure/Configuration/usecases/OrganizationService';
import StockService from './Infrastructure/Configuration/usecases/StockService';

dotenv.config();
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import '@controllers/ContractController';
import '@controllers/CounterpartyController';
import '@controllers/ProductController';
import '@controllers/WarehouseController';
import '@controllers/UOMController';
import '@controllers/OrderController';
import '@controllers/OrganizationController';
import '@controllers/StockController';
import MoySkladApi from './Infrastructure/Api/MoySklad/MoySkladApi';

const container = new Container();

container.bind<ContractService>(TYPES.ContractService).to(ContractService);
container.bind<CounterpartyService>(TYPES.CounterpartyService).to(CounterpartyService);
container.bind<ProductService>(TYPES.ProductService).to(ProductService);
container.bind<WarehouseService>(TYPES.WarehouseService).to(WarehouseService);
container.bind<UOMService>(TYPES.UOMService).to(UOMService);
container.bind<OrderService>(TYPES.OrderService).to(OrderService);
container.bind<OrganizationService>(TYPES.OrganizationService).to(OrganizationService);
container.bind<StockService>(TYPES.StockService).to(StockService);

const server = new InversifyExpressServer(container);
server.setConfig((application: express.Application) => {
    application.use(cors({ origin: `*` }));
    application.use(bodyParser.urlencoded({ extended: true }));
    application.use(bodyParser.json());
});

const app = server.build(),
    address = ip.address(),
    port = process.env.PORT ?? 5006;

app.listen(port, async () => {
    console.log(`server started at http://localhost:${port}`);

    const config: any = {
        headers: {
            'Content-Type': 'application/json',
            'Retry-After': '2000'
        },
        method: 'GET'
    };
    try {
        await fetch(`http://localhost:${port}/order/context/item`, config).then(async (response: any) => console.log(await response.json()));
        console.log('end');
    } catch {
        process.exit(1);
    }
});
