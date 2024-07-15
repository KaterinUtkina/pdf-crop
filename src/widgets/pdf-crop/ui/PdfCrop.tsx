import {FileUploadInput} from "./FileUploadInput.tsx";
import {ImagePreview} from "./ImagePreview.tsx";
import {usePdfCropContext} from "./PdfCropProvider.tsx";
import {lazy, Suspense, useState} from "react";
import {Loader} from "../../../shared/ui";

const PdfCanvasRendererLazy = lazy(() => import('./PdfCanvasRenderer.tsx'));

export function PdfCrop() {
    const pdfContext = usePdfCropContext();
    const [showPreview, setShowPreview] = useState(false);

    const toggleShowPreview = () => {
        setShowPreview(prevState => !prevState);
    }

    const closeShowPreview = () => {
        setShowPreview(false);
    }

    return (
        <main className={"w-screen h-full px-4 md:px-12 py-12"}>
            {(pdfContext && !pdfContext.inputFile) ? (
                <section className={"flex flex-col items-center"}>
                    <FileUploadInput/>
                </section>
            ) : (
                <section className={"h-full flex flex-col"}>
                    {(pdfContext && !!pdfContext.inputFile) && (
                        <Suspense fallback={<Loader/>}>
                            <h1 className={"text-4xl mb-2 md:mb-10 flex"}>
                                <span className={"w-full md:w-2/4 text-center"}>
                                    Select area
                                </span>
                                <span className={"hidden md:inline w-2/4 text-center"}>
                                    Preview
                                </span>
                            </h1>
                            <button
                                onClick={toggleShowPreview}
                                className={`block md:hidden mb-10 w-fit m-auto px-4 py-2 rounded-md bg-cyan-500 hover:bg-cyan-600 text-white opacity-0 transition-opacity ${!!pdfContext?.imagePreview.length && 'opacity-100'}`}
                                type={"button"}>
                                Show preview
                            </button>
                            <div
                                className={"flex justify-between rounded-2xl border-solid border-2 border-zinc-400 bg-slate-100 overflow-hidden"}>
                                <PdfCanvasRendererLazy/>
                                <ImagePreview
                                    show={showPreview}
                                    closeShowPreview={closeShowPreview}/>
                            </div>
                        </Suspense>
                    )}
                </section>
            )}
        </main>
    )
}