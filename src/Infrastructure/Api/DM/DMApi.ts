import Api from '../Api';

export default class DMApi extends Api {
    token = process.env.DM_TOKEN;
    domain = process.env.DM_DOMAIN;
    portal_id = process.env.DM_PORTAL_ID;
}
