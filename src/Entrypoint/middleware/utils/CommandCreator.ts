export default class CommandCreator {
    public find(attr: any[], command: string): string {
        attr.forEach((arrItem, index) => {
            command += `(`;
            Object.keys(arrItem).map((key: string, index: number) => {
                const keyTyped = key as keyof typeof attr,
                    value = Array.isArray(arrItem[keyTyped]) ? arrItem[keyTyped].join(`' || '`) : arrItem[keyTyped];
                command += ` ${key} = '${value}' ` + (Object.keys(arrItem).length !== ++index ? `&&` : ``);
            });
            command += Object.keys(attr).length !== ++index ? ') || ' : '))';
        });
        return command;
    }

    public createMultiple(data: any[], command: string): string {
        data.forEach((element: any, index) => {
            command = command + '(';
            Object.values(element).forEach((value, index) => {
                if (typeof value === 'number') {
                    command = command + value;
                } else {
                    command = command + `"${value}"`;
                }
                command += Object.keys(element).length !== ++index ? ', ' : '';
            });
            command += data.length !== ++index ? '), ' : ');';
        });
        return command;
    }
}
