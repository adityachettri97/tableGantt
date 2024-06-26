import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var learningtableGantt3BE60C2254D74A57A46A2956C42B73B8_DEBUG: IVisualPlugin = {
    name: 'learningtableGantt3BE60C2254D74A57A46A2956C42B73B8_DEBUG',
    displayName: 'TableGantt',
    class: 'Visual',
    apiVersion: '5.1.0',
    create: (options?: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = (<any>globalThis).dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["learningtableGantt3BE60C2254D74A57A46A2956C42B73B8_DEBUG"] = learningtableGantt3BE60C2254D74A57A46A2956C42B73B8_DEBUG;
}
export default learningtableGantt3BE60C2254D74A57A46A2956C42B73B8_DEBUG;