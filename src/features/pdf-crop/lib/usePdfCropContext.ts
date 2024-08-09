import {useContext} from "react";
import {PdfCropContextType} from "../types";
import {PdfCropContext} from "../providers/PdfCropProvider.tsx";

export const usePdfCropContext = (): PdfCropContextType | null => useContext(PdfCropContext);