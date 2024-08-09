import "overlayscrollbars/styles/overlayscrollbars.css";
import {PdfCropProvider} from "../features/pdf-crop/providers/PdfCropProvider.tsx";
import {PdfCrop} from "../features/pdf-crop/ui/PdfCrop.tsx";

function App() {
    return (
        <PdfCropProvider>
            <PdfCrop/>
        </PdfCropProvider>
    )
}

export default App
