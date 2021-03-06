import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogConfig } from "@angular/material/dialog";
import { MatDialog } from "@angular/material/dialog";
import { interval, Subscription } from "rxjs";
import { DataFrame } from "src/frontend/app/core";
import { EditPlotData, EditPlotDialogComponent } from "./edit-plot-dialog/edit-plot-dialog.component";

declare var Plotly: any;

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "plot",
    templateUrl: "./plot.component.html",
    styleUrls: ["./plot.component.scss"]
})
export class PlotComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public dataFrame: DataFrame = new DataFrame();

    @ViewChild("graph", { static: true })
    public graphElement: ElementRef<HTMLElement>;

    public readonly sliderControl: FormControl = new FormControl();
    public sliderMin = 1;
    public sliderMax: number;
    public isPlaying = false;

    private sliderValueChangesSubscription: Subscription;
    private automaticRangeTickSubscription: Subscription;

    private title = "Plot";
    private xAxisName = "Columns";
    private yAxisName = "Rows";
    private zAxisName = "Values";
    private zMax = 0;
    private zMin = 0;
    private meanRange = 1;

    constructor(private matDialog: MatDialog) { }

    public ngOnInit(): void {
        this.sliderValueChangesSubscription = this.sliderControl.valueChanges.subscribe(() => this.updatePlot(false));
        this.updatePlot(true);
        this.updateSlider();
    }

    public ngOnDestroy() {
        this.sliderValueChangesSubscription.unsubscribe();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.dataFrame) {
            this.updatePlot(true);
            this.updateSlider();
        }
    }

    public toggleRangeCycle(): void {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.automaticRangeTickSubscription.unsubscribe();
        } else {
            this.isPlaying = true;
            this.automaticRangeTickSubscription = interval(1000).subscribe(() => {
                let value = this.sliderControl.value + 1;
                if (value > this.sliderMax) {
                    value = this.sliderMin;
                }
                this.sliderControl.setValue(value);
            });
        }
    }

    public edit(): void {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.width = "250px";

        dialogConfig.data = {
            title: this.title,
            xAxisName: this.xAxisName,
            yAxisName: this.yAxisName,
            zAxisName: this.zAxisName,
            zMax: this.zMax,
            zMin: this.zMin,
            meanRange: this.meanRange,
        } as EditPlotData;

        const dialogRef = this.matDialog.open(EditPlotDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe((result: EditPlotData) => {
            if (result) {
                this.title = result.title;
                this.xAxisName = result.xAxisName;
                this.yAxisName = result.yAxisName;
                this.zAxisName = result.zAxisName;
                this.zMax = result.zMax;
                this.zMin = result.zMin;
                this.meanRange = result.meanRange;

                this.updatePlot(false);
            }
        });
    }

    private updatePlot(isDataFrameChange: boolean) {
        const data = this.calculateData();
        const layout = this.calculateLayout(isDataFrameChange);
        const config = {
            responsive: true
        };

        Plotly.react(this.graphElement.nativeElement, data, layout, config);
    }

    private updateSlider() {
        if (this.dataFrame.isEmpty) {
            this.sliderControl.disable();
        } else {
            this.sliderControl.enable();
        }

        const value = this.dataFrame.isEmpty ? 1 : this.dataFrame.rows.length;
        this.sliderMax = value;
        this.sliderControl.setValue(value);
    }

    protected calculateData(): any {
        this.dataFrame.reduce(this.meanRange);
    }

    private calculateLayout(updateZ: boolean): any {
        if (updateZ) {
            // Use a z range a 10% bigger than current data
            this.zMin = Math.min(...this.dataFrame.min("row"));
            this.zMax = Math.max(...this.dataFrame.max("row"));

            const zLength = this.zMax - this.zMin;
            this.zMin -= zLength * 0.05;
            this.zMax += zLength * 0.05;
        }

        // Calculate ratio in reference to x_ratio=1
        const yRatio = this.dataFrame.shape[0] / this.dataFrame.shape[1];

        return {
            uirevision: this.dataFrame,
            autosize: true,
            margin: {
                t: 50,
                r: 0,
                b: 10,
                l: 0,
            },
            title: {
                text: this.title
            },
            scene: {
                aspectmode: "manual",
                aspectratio: {
                    x: 1,
                    y: yRatio,
                    z: 1
                },
                xaxis: {
                    title: {
                        text: this.xAxisName
                    },
                    ticks: "outside",
                    nticks: this.dataFrame.shape[1],
                    range: [0, this.dataFrame.shape[1]]
                },
                yaxis: {
                    title: {
                        text: this.yAxisName
                    },
                    ticks: "outside",
                    nticks: this.dataFrame.shape[0],
                    range: [0, this.dataFrame.shape[0]]
                },
                zaxis: {
                    title: {
                        text: this.zAxisName
                    },
                    ticks: "outside",
                    range: [this.zMin, this.zMax]
                }
            }
        };
    }
}
