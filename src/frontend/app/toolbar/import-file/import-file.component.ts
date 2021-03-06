import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DataService } from "../../services/data/data.service";
import { EFileType, FileImporterService } from "../../services/file-importer/file-importer.service";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "import-file",
    templateUrl: "./import-file.component.html",
    styleUrls: ["./import-file.component.scss"]
})
export class ImportFileComponent {
    public inputFile: FormControl = new FormControl();
    public supportedFileTypes = EFileType.Xlsx;

    constructor(
        private fileImporterService: FileImporterService,
        private dataService: DataService
    ) { }

    public handleFileInput(target: EventTarget | null) {
        if (target != null) {
            const files: FileList = (target as any).files;
            this.fileImporterService.importFiles(files)
                .subscribe(
                    dataFrame => this.dataService.addData(dataFrame),
                    err => alert(err)
                ).add(this.inputFile.setValue(null, {emitEvent: false}));
        }
    }
}
