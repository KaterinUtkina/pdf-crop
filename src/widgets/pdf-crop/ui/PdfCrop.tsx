import {FileUploadInput} from "./FileUploadInput.tsx";
import {ImagePreview} from "./ImagePreview.tsx";
import {usePdfCropContext} from "./PdfCropProvider.tsx";
import {lazy, Suspense} from "react";

const PdfCanvasRendererLazy = lazy(() => import('./PdfCanvasRenderer.tsx'));

export function PdfCrop() {
    const pdfContext = usePdfCropContext();

    return (
        <>
            <FileUploadInput/>
            {(pdfContext && !!pdfContext.inputFile) && (
                <Suspense fallback={<>Loading</>}>
                    <PdfCanvasRendererLazy />
                </Suspense>
            )}
            <ImagePreview imagePreview={pdfContext?.imagePreview ?? ""} />
        </>
    )
}