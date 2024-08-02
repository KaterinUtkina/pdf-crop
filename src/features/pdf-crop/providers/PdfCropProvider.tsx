import React, {createContext, useCallback, useMemo, useState} from 'react';
import {PdfCropContextType} from "../types";

export const PdfCropContext = createContext<PdfCropContextType | null>(null);

export const PdfCropProvider = ({ children } : {
    children: React.ReactNode
}) => {
    const [inputFile, setInputFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const changeInputFile = useCallback((file: File | null) => {
        setInputFile(file);
    }, []);

    const setImagePreviewHandler = useCallback((image: string) => {
        setImagePreview(image);
    }, []);

    const contextValue = useMemo(() => ({
        inputFile,
        imagePreview,
        changeInputFile,
        setImagePreviewHandler
    }), [inputFile, imagePreview, changeInputFile, setImagePreviewHandler]);

    return (
        <PdfCropContext.Provider value={contextValue}>
            {children}
        </PdfCropContext.Provider>
    );
};