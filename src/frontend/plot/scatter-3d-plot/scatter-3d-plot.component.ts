import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PlotComponent } from "../plot.component";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "scatter-3d-plot",
    templateUrl: "../plot.component.html",
    styleUrls: ["../plot.component.scss"]
})
export class Scatter3dPlotComponent extends PlotComponent {
    constructor(matDialog: MatDialog) {
        super(matDialog);
    }

    protected calculateData(): any {
        super.calculateData();

        const max = this.sliderControl.value * (this.dataFrame.columns.length - 1);
        return [{
            opacity: 0.8,
            color: "rgb(300,100,200)",
            mode: "markers",
            type: "scatter3d",
            x: this.dataFrame.x.slice(0, max),
            y: this.dataFrame.y.slice(0, max),
            z: this.dataFrame.z.slice(0, max)
        }];
    }
}
