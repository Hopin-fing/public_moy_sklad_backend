export default interface IRequestExecutor {
    callApi(): Promise<any>;
}
