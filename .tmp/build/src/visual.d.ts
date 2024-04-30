import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";
import { Selection } from "d3";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import { IViewModel } from "./interfaces";
export declare class Visual implements IVisual {
    private target;
    private formattingSettings;
    private formattingSettingsService;
    visualDiv: Selection<HTMLDivElement, unknown, HTMLElement, any>;
    tableBody: Selection<HTMLDivElement, unknown, HTMLElement, any>;
    viewModel: IViewModel;
    options: VisualUpdateOptions;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    getFormattingModel(): powerbi.visuals.FormattingModel;
}
