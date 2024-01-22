import IRequestExecutor from './IRequestExecutor';

export default abstract class RequestExecutor implements IRequestExecutor {
    abstract callApi(): Promise<any>;
}
