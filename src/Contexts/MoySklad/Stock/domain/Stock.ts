export interface IStock {
    assortmentId: string;
    storeId: string;
    stock: number;
}

export default class Stock {
    //@desc Этот ответ отличается по структуре от иних ответов Моего Склада, поэтому он не наследует класс ResponseMoySklad
    content: IStock[];

    constructor(bodyReq: IStock[]) {
        this.content = bodyReq;
    }

    public getContent(): IStock[] {
        return this.content;
    }
}
