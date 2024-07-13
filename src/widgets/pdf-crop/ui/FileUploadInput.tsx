import {ChangeEvent, memo} from "react";
import {usePdfCropContext} from "./PdfCropProvider.tsx";

export const FileUploadInput = memo(function FileUploadInput() {
    const ACCEPT_FILE = ".pdf"
    const context = usePdfCropContext();

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!context) {
            console.log('Context is null');
            return;
        }

        context.changeInputFile(event.target.files ? event.target.files[0] : null);
    }

    return (
        <div>
            <input type={"file"} accept={ACCEPT_FILE} onChange={onChangeHandler}/>
        </div>
    )
});