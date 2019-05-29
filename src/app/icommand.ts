export interface IParameter {
    name: string;
    label: string;
    value: any;
    defaultValue?: string;
}
export interface ICommand {
    name: string;
    cmdStr: string;
    isNew?: boolean;
    tag?: string;
    parameters?: IParameter[];
}
