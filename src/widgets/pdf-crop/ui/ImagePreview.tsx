import {memo, useEffect, useState} from "react";
import {usePdfCropContext} from "./PdfCropProvider.tsx";

export const ImagePreview = memo(function ImagePreview(
    props: {
        show: boolean,
        closeShowPreview: () => void
}){
    const pdfContext = usePdfCropContext();
    const [isMobileSizeDevice, setIsMobileSizeDevice]
        = useState<boolean>(false);

    useEffect(() => {
        checkMobileSizeDevice();
    }, []);

    const checkMobileSizeDevice = () => {
        setIsMobileSizeDevice(window.matchMedia('(max-width: 767px)').matches);
    }

    const closeHandler = () => {
        props.closeShowPreview();
    }

    return (
        isMobileSizeDevice ? (
            props.show &&
            <div className={"absolute w-full h-full top-0 left-0 flex items-center justify-center bg-gray-800/90"}
                 onClick={(e) => {
                     if (e.target === e.currentTarget) closeHandler();
                 }}>
                <img
                    src={pdfContext?.imagePreview}
                    alt={"preview"}
                    className={"max-w-full w-auto h-auto"}/>
            </div>
        ) : (
            <div className={"w-2/4 p-4 flex items-center justify-center border-solid border-2 border-l-zinc-400"}>
                {pdfContext?.imagePreview
                    ? <img
                        src={pdfContext.imagePreview}
                        alt={"preview"}
                        className={"max-w-full w-auto h-auto"}/>
                    : <p>No preview available</p>
                }
            </div>
        )
    )
});