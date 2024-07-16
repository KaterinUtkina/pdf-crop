import {PdfCropProvider, PdfCrop} from "../widgets/pdf-crop";
import "overlayscrollbars/styles/overlayscrollbars.css";

function App() {
    return (
        <PdfCropProvider>
            <PdfCrop/>
        </PdfCropProvider>
    )
}

export default App
