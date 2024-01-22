import IRequestExecutor from './interfaces/IRequestExecutor';

export default abstract class RequestExecutor implements IRequestExecutor {
    abstract callApi(): Promise<any>;
}
