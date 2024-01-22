export default interface ISendWarehousesUseCase {
    sendWarehouses(warehouseDto: any): Promise<any>;
}
