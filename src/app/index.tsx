import {PdfCropProvider, PdfCrop} from "../features/pdf-crop";
import "overlayscrollbars/styles/overlayscrollbars.css";

function App() {
    return (
        <PdfCropProvider>
            <PdfCrop/>
        </PdfCropProvider>
    )
}

export default App
