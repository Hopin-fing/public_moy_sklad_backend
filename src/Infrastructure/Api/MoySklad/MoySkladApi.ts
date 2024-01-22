import Api from '../Api';

export default class MoySkladApi extends Api {
    token = process.env.MS_TOKEN;
    domain = process.env.MS_DOMAIN;
}
