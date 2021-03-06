import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";

export interface EditPlotData {
    title: string;
    xAxisName: string;
    yAxisName: string;
    zAxisName: string;
    zMax: number;
    zMin: number;
    meanRange: number;
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "edit-plot-dialog",
    templateUrl: "./edit-plot-dialog.component.html",
    styleUrls: ["./edit-plot-dialog.component.scss"]
})
export class EditPlotDialogComponent implements OnDestroy {
    public form: FormGroup;
    public readonly titleControl: FormControl = new FormControl();
    public readonly xAxisNameControl: FormControl = new FormControl();
    public readonly yAxisNameControl: FormControl = new FormControl();
    public readonly zAxisNameControl: FormControl = new FormControl();
    public readonly zMaxControl: FormControl = new FormControl();
    public readonly zMinControl: FormControl = new FormControl();
    public readonly meanRangeControl: FormControl = new FormControl();

    private formData: EditPlotData;

    private titleChangeSubscription: Subscription;
    private xAxisChangeSubscription: Subscription;
    private yAxisChangeSubscription: Subscription;
    private zAxisChangeSubscription: Subscription;
    private zMaxChangeSubscription: Subscription;
    private zMinChangeSubscription: Subscription;
    private meanRangeChangeSubscription: Subscription;

    constructor(
        @Inject(MAT_DIALOG_DATA) data: EditPlotData,
        private matDialogRef: MatDialogRef<EditPlotDialogComponent>,
        fb: FormBuilder
    ) {
        // Init form data
        this.formData = {
            title: data.title,
            xAxisName: data.xAxisName,
            yAxisName: data.yAxisName,
            zAxisName: data.zAxisName,
            zMax: data.zMax,
            zMin: data.zMin,
            meanRange: data.meanRange,
        };

        this.titleControl.setValue(data.title, { emitEvent: false });
        this.xAxisNameControl.setValue(data.xAxisName, { emitEvent: false });
        this.yAxisNameControl.setValue(data.yAxisName, { emitEvent: false });
        this.zAxisNameControl.setValue(data.zAxisName, { emitEvent: false });
        this.zMaxControl.setValue(data.zMax, { emitEvent: false });
        this.zMinControl.setValue(data.zMin, { emitEvent: false });
        this.meanRangeControl.setValue(data.meanRange, { emitEvent: false });

        // Subscribe to changes
        this.titleChangeSubscription = this.titleControl.valueChanges.subscribe(value => this.formData.title = value);
        this.xAxisChangeSubscription = this.xAxisNameControl.valueChanges.subscribe(value => this.formData.xAxisName = value);
        this.yAxisChangeSubscription = this.yAxisNameControl.valueChanges.subscribe(value => this.formData.yAxisName = value);
        this.zAxisChangeSubscription = this.zAxisNameControl.valueChanges.subscribe(value => this.formData.zAxisName = value);
        this.zMaxChangeSubscription = this.zMaxControl.valueChanges.subscribe(value => this.formData.zMax = value);
        this.zMinChangeSubscription = this.zMinControl.valueChanges.subscribe(value => this.formData.zMin = value);
        this.meanRangeChangeSubscription = this.meanRangeControl.valueChanges.subscribe(value => this.formData.meanRange = value);

        this.form = fb.group({
            title: this.titleControl,
            xAxisName: this.xAxisNameControl,
            yAxisName: this.yAxisNameControl,
            zAxisName: this.zAxisNameControl,
            zMax: this.zMaxControl,
            zMin: this.zMinControl,
            meanRange: this.meanRangeControl,
        });
    }

    public ngOnDestroy(): void {
        this.titleChangeSubscription.unsubscribe();
        this.xAxisChangeSubscription.unsubscribe();
        this.yAxisChangeSubscription.unsubscribe();
        this.zAxisChangeSubscription.unsubscribe();
        this.zMaxChangeSubscription.unsubscribe();
        this.zMinChangeSubscription.unsubscribe();
        this.meanRangeChangeSubscription.unsubscribe();
    }

    public save(): void {
        this.matDialogRef.close(this.formData);
    }

    public close(): void {
        this.matDialogRef.close(undefined);
    }
}
