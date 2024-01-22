import fetch from 'node-fetch';

type TConfig = {
    headers: {
        Authorization: string;
        'Content-Type': string;
        'Retry-After': string;
        'Portal-Id'?: string;
    };
    method?: string;
    body?: string;
};

export default abstract class Api {
    url: string;
    method: string;
    body: any;
    token: string;
    domain: string;
    portal_id?: string;

    constructor(body?: unknown) {
        this.body = body;
    }

    protected async SendRequest(): Promise<any> {
        const config: TConfig = {
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Retry-After': '2000'
            }
        };
        if (this.portal_id) config.headers['Portal-Id'] = this.portal_id;
        switch (this.method) {
            case 'GET':
                config['method'] = this.method;
                break;
            case 'POST':
                config['method'] = this.method;
                config['body'] = JSON.stringify(this.body);
                break;
            case 'PUT':
                config['method'] = this.method;
                config['body'] = JSON.stringify(this.body);
                break;
            default:
                throw new Error(`Unknown method ${this.method}`);
        }
        return await fetch(`${this.domain}${this.url}`, config)
            .then((res) => res.json())
            .catch((err: Error) => Error(`Ошибка: ${err.message}`));
    }
}
