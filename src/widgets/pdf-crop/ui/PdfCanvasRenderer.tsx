import {usePdfCanvasRender} from "../lib/usePdfCanvasRender.ts";

export default function PdfCanvasRenderer() {
    const {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleTouchStart,
        handleTouchMove,
        overlayCanvasRef,
        imageCanvasRef,
        canvasWrapperRef,
        resizeHandle
    } = usePdfCanvasRender();

    return (
        <div ref={canvasWrapperRef} style={{position: 'relative'}}>
            <canvas
                ref={imageCanvasRef}
                style={{position: 'absolute', top: 0, left: 0}}
            />
            <canvas
                ref={overlayCanvasRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className={`${resizeHandle}`}
                style={{position: 'absolute', top: 0, left: 0}}
            />
        </div>
    )
}