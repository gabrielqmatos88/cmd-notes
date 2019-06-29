export enum ParameterType {
  text,
  number,
  boolean,
  list
}

export interface IParameter {
    name: string;
    label: string;
    value: any;
    defaultValue?: string;
    type?: ParameterType;
    listParams?: string;
}
export interface ICommand {
    name: string;
    cmdStr: string;
    isNew?: boolean;
    tag?: string;
    opened?: boolean;
    parameters?: IParameter[];
}
