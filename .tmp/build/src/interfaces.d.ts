export interface IViewModel {
    projectPriorities: IProjectPriority[];
    measureFieldMetada: IMeasureField[];
}
export interface IMeasureField {
    name: string;
    isBar: boolean;
}
export interface IProjectPriority {
    name: string;
    projects: IProject[];
}
export interface IProject {
    name: string;
    startDate: Date;
    endDate: Date;
    aggregatedData: IAggregatedMeasureData[];
    milestones: IMilestone[];
}
export interface IAggregatedMeasureData {
    value: number;
    measureMetada: IMeasureField;
    measureRows: IMeasureRow[];
}
export interface IMeasureRow {
    name: string;
    value: number;
}
export interface IMilestone {
    name: string;
    priority: string;
    milestoneDate: Date;
}
