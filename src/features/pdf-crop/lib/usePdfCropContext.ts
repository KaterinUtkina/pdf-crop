import {useContext} from "react";
import {PdfCropContext} from "../providers";
import {PdfCropContextType} from "../types";

export const usePdfCropContext = (): PdfCropContextType | null => useContext(PdfCropContext);