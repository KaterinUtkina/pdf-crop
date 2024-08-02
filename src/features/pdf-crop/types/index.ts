export interface PdfCropContextType {
    inputFile: File | null;
    imagePreview: string;
    changeInputFile: (file: File | null) => void;
    setImagePreviewHandler: (image: string) => void
}