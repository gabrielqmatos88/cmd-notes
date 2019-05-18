export interface IParameter {
    name: string;
    value: any;
}
export interface ICommand {
    name: string;
    cmdStr: string;
    isNew?: boolean;
    tag?: string;
    parameters?: IParameter[];
}
