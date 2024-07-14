import {FileUploadInput} from "./FileUploadInput.tsx";
import {ImagePreview} from "./ImagePreview.tsx";
import {usePdfCropContext} from "./PdfCropProvider.tsx";
import {lazy, Suspense} from "react";
import {Loader} from "../../../shared/ui";

const PdfCanvasRendererLazy = lazy(() => import('./PdfCanvasRenderer.tsx'));

export function PdfCrop() {
    const pdfContext = usePdfCropContext();

    return (
        <main className={"w-screen h-full px-12 py-12"}>
            {(pdfContext && !pdfContext.inputFile) ? (
                <section className={"flex flex-col items-center"}>
                    <FileUploadInput/>
                </section>
            ) : (
                <section className={"h-full flex flex-col"}>
                    {(pdfContext && !!pdfContext.inputFile) && (
                        <Suspense fallback={<Loader/>}>
                            <h1 className={"text-4xl mb-10 flex"}>
                                <span className={"w-2/4  text-center"}>
                                    Select area
                                </span>
                                <span className={"w-2/4  text-center"}>
                                    Preview
                                </span>
                            </h1>
                            <div className={"flex justify-between rounded-2xl border-solid border-2 border-zinc-400 bg-slate-100 overflow-hidden"}>
                                <PdfCanvasRendererLazy/>
                                <ImagePreview imagePreview={pdfContext?.imagePreview ?? ""}/>
                            </div>
                        </Suspense>
                    )}
                </section>
            )}
        </main>
    )
}