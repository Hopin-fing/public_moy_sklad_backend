import { injectable } from 'inversify';
import MSGetContractListExecutor from '@src/Infrastructure/Api/MoySklad/RequestExecutor/MSGetContractListExecutor';
import Contract from '@src/Contexts/MoySklad/Contract/domain/Contract';

@injectable()
export default class ContractService {
    public async GetContractList() {
        const MSRequest = new MSGetContractListExecutor(),
            MSContent = await MSRequest.execute(),
            req = new Contract(MSContent).getContent(),
            result: any[] = [];
        if (req)
            req.forEach((contract) => {
                const item = {
                    id: contract.id,
                    name: contract.name,
                    agent: contract.agent?.meta.href
                };
                result.push(item);
            });
        return result;
    }
}
