import {ChangeEvent, memo} from "react";
import {usePdfCropContext} from "../lib/usePdfCropContext.ts";
import {UploadIcon} from "../../../shared/ui/icon/UploadIcon.tsx";

export const PdfFileUploadInput = memo(function FileUploadInput() {
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
        <>
            <h1 className={"text-4xl mb-2 text-center"}>Upload your file</h1>
            <p className={"text-gray-500 text-lg mb-8"}>File should be PDF</p>
            <span className={"block w-full md:w-2/5 xl:w-1/3 rounded-2xl border-dashed border-2 border-zinc-400 bg-slate-100"}>
                <label className={"block w-full pb-100% relative cursor-pointer"}>
                    <input
                        className={"absolute top-0 left-0 opacity-0 pointer-events-none z-0"}
                        type={"file"}
                        accept={ACCEPT_FILE}
                        onChange={onChangeHandler}
                    />
                    <span className={"absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 flex flex-col gap-4 items-center"}>
                        <UploadIcon className={"w-20 h-20 fill-sky-500"}/>
                        <p className={"text-gray-500 text-center"}>
                            Choose file to upload
                        </p>
                    </span>
                </label>
            </span>
        </>
    )
});