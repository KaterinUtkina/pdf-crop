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
        <div className={"w-full md:w-2/4 overflow-auto"}>
            <div ref={canvasWrapperRef} style={{position: 'relative'}} className={"mx-auto"}>
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
        </div>
    )
}