import {FileUploadInput} from "./FileUploadInput.tsx";
import {ImagePreview} from "./ImagePreview.tsx";
import {usePdfCropContext} from "./PdfCropProvider.tsx";
import {lazy, Suspense} from "react";

const PdfCanvasRendererLazy = lazy(() => import('./PdfCanvasRenderer.tsx'));

export function PdfCrop() {
    const pdfContext = usePdfCropContext();

    return (
        <main className={"w-screen h-full px-4 py-12"}>
            <section className={"flex flex-col items-center"}>
                {(pdfContext && !pdfContext.inputFile) && (
                    <FileUploadInput/>
                )}
            </section>
            <section>
                {(pdfContext && !!pdfContext.inputFile) && (
                    <Suspense fallback={<>Loading</>}>
                        <PdfCanvasRendererLazy />
                    </Suspense>
                )}
            </section>
            <section>
                <ImagePreview imagePreview={pdfContext?.imagePreview ?? ""} />
            </section>
        </main>
    )
}