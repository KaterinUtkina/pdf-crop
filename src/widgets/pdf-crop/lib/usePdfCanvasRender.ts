import React, {useEffect, useRef, useState} from "react";
import {getDocument} from "pdfjs-dist";
import {usePdfCropContext} from "../ui";
import "pdfjs-dist/build/pdf.worker.mjs";

export function usePdfCanvasRender() {
    const imageCanvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
    const canvasWrapperRef = useRef<HTMLDivElement>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const NUMBER_PAGE_PDF = 1;
    const SCALE_PAGE_PDF = 1;
    const HANDLE_TOP_LEFT = 'top-left';
    const HANDLE_TOP_RIGHT = 'top-right';
    const HANDLE_BOTTOM_LEFT = 'bottom-left';
    const HANDLE_BOTTOM_RIGHT = 'bottom-right';
    const HANDLE_SIZE = 8;
    const LINE_DASH = [6];
    const FILL_COLOR = 'rgba(0, 0, 0, 0.5)';
    const STROKE_COLOR = 'black';
    const pdfContext = usePdfCropContext();
    const [file] = useState<null | File>(pdfContext?.inputFile ?? null);

    useEffect(() => {
        if (!file) return;

        void fillCanvas(file);
    }, [file]);

    const fillCanvas = async (file: File) => {
        try {
            const pdf = await getDocument(URL.createObjectURL(file)).promise;
            const page = await pdf.getPage(NUMBER_PAGE_PDF);
            const viewport = page.getViewport({ scale: SCALE_PAGE_PDF });

            const canvas = imageCanvasRef.current;
            if (!canvas) return;

            const canvasWrapper = canvasWrapperRef.current;
            if (canvasWrapper) {
                canvasWrapper.style.height = `${viewport.height}px`;
                canvasWrapper.style.width = `${viewport.width}px`;
            }

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const context = canvas.getContext('2d');

            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
            } else return;

            const renderContext = {
                canvasContext: context,
                viewport,
            };

            await page.render(renderContext).promise;

            page.cleanup();
            await pdf.cleanup();

            const overlayCanvas = overlayCanvasRef.current;
            if (!overlayCanvas) return;

            const contextOverlayCanvas = overlayCanvas.getContext('2d');

            if (contextOverlayCanvas) {
                contextOverlayCanvas.clearRect(0, 0, canvas.width, canvas.height);
            }

            overlayCanvas.width = viewport.width;
            overlayCanvas.height = viewport.height;

        } catch (error) {
            console.error('Error rendering PDF:', error);
        }
    };

    const handleMouseDown = ({ clientX, clientY }: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = overlayCanvasRef.current;
        if (!canvas) return;

        const { left, top } = canvas.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        if (isOverHandle(x, y, selectionRect)) {
            setResizeHandle(getHandleName(x, y, selectionRect));
            return;
        }

        setIsSelecting(true);
        setSelectionRect(new DOMRect(x, y, 0, 0));
    };

    const handleTouchStart = ({ touches }: React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = overlayCanvasRef.current;
        if (!canvas) return;

        const touch = touches[0];
        const { left, top } = canvas.getBoundingClientRect();
        const x = touch.clientX - left;
        const y = touch.clientY - top;

        if (isOverHandle(x, y, selectionRect)) {
            setResizeHandle(getHandleName(x, y, selectionRect));
            return;
        }

        setIsSelecting(true);
        setSelectionRect(new DOMRect(x, y, 0, 0));
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = overlayCanvasRef.current;
        if (!canvas) return;

        const { left, top } = canvas.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;

        if (isSelecting && selectionRect) {
            updateSelectionRect(x, y);
        } else if (resizeHandle && selectionRect) {
            resizeSelectionRect(x, y, resizeHandle);
            drawSelectionRect();
        }
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = overlayCanvasRef.current;
        if (!canvas) return;

        const { x, y } = getTouchCoordinates(event, canvas);

        if (isSelecting && selectionRect) {
            updateSelectionRect(x, y);
        } else if (resizeHandle && selectionRect) {
            resizeSelectionRect(x, y, resizeHandle);
            drawSelectionRect();
        }
    };

    const handleMouseUp = () => {
        setIsSelecting(false);
        setResizeHandle(null);

        if (!selectionRect?.height || !selectionRect?.width) {
            setSelectionRect(null);
            resetSelectionRect();
            return;
        }

        drawSelectionRect();

        if (selectionRect) {
            saveSelectionAsImage();
        }
    }

    const getTouchCoordinates = (event: React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
        const touch = event.touches[0];
        const { left, top } = canvas.getBoundingClientRect();
        const x = touch.clientX - left;
        const y = touch.clientY - top;
        return { x, y };
    };

    const updateSelectionRect = (x: number, y: number) => {
        if (!selectionRect) return;

        const newWidth = x - selectionRect.x;
        const newHeight = y - selectionRect.y;

        setSelectionRect(new DOMRect(selectionRect.x, selectionRect.y, newWidth, newHeight));
        drawSelectionRect();
    };

    const resizeSelectionRect = (x: number, y: number, handle: string) => {
        if (!selectionRect) return;

        const { x: startX, y: startY, width: startWidth, height: startHeight } = selectionRect;
        const newRect = new DOMRect(startX, startY, startWidth, startHeight);

        switch (handle) {
            case HANDLE_TOP_LEFT:
                newRect.x = x;
                newRect.y = y;
                newRect.width = startWidth + (startX - x);
                newRect.height = startHeight + (startY - y);
                break;
            case HANDLE_TOP_RIGHT:
                newRect.y = y;
                newRect.width = x - startX;
                newRect.height = startHeight + (startY - y);
                break;
            case HANDLE_BOTTOM_LEFT:
                newRect.x = x;
                newRect.width = startWidth + (startX - x);
                newRect.height = y - startY;
                break;
            case HANDLE_BOTTOM_RIGHT:
                newRect.width = x - startX;
                newRect.height = y - startY;
                break;
            default:
                break;
        }

        setSelectionRect(newRect);
    };

    const isOverHandle = (x: number, y: number, rect: DOMRect | null): boolean => {
        if (!rect) return false;

        const handles = getHandlePositions(rect);
        return handles.some(handle =>
            x >= handle.x - HANDLE_SIZE &&
            x <= handle.x + HANDLE_SIZE &&
            y >= handle.y - HANDLE_SIZE &&
            y <= handle.y + HANDLE_SIZE
        );
    };

    const getHandleName = (x: number, y: number, rect: DOMRect | null): string => {
        if (!rect) return '';

        const handles = getHandlePositions(rect);
        const handleNames = [
            HANDLE_TOP_LEFT,
            HANDLE_TOP_RIGHT,
            HANDLE_BOTTOM_LEFT,
            HANDLE_BOTTOM_RIGHT
        ];

        const handleIndex = handles.findIndex(handle =>
            x >= handle.x - HANDLE_SIZE &&
            x <= handle.x + HANDLE_SIZE &&
            y >= handle.y - HANDLE_SIZE &&
            y <= handle.y + HANDLE_SIZE
        );

        return handleIndex !== -1 ? handleNames[handleIndex] : '';
    };

    const getHandlePositions = (rect: DOMRect | null): { x: number, y: number }[] => {
        if (!rect) return [];

        const { x, y, width, height } = rect;

        return [
            { x, y },
            { x: x + width, y },
            { x, y: y + height },
            { x: x + width, y: y + height }
        ];
    };

    const drawSelectionRect = () => {
        const canvas = overlayCanvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx || !selectionRect) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = FILL_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.clearRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height);

        ctx.setLineDash(LINE_DASH);
        ctx.strokeStyle = STROKE_COLOR;
        ctx.strokeRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height);
        ctx.setLineDash([]);

        const handles = getHandlePositions(selectionRect);
        handles.forEach(handle => {
            ctx.fillStyle = FILL_COLOR;
            ctx.fillRect(
                handle.x - HANDLE_SIZE,
                handle.y - HANDLE_SIZE,
                HANDLE_SIZE * 2
                , HANDLE_SIZE * 2
            );
        });
    };

    const resetSelectionRect = () => {
        const canvas = overlayCanvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const saveSelectionAsImage = () => {
        if (!selectionRect) return;

        const canvas = imageCanvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const width = Math.abs(selectionRect.width);
        const height = Math.abs(selectionRect.height);
        const imageData = context.getImageData(
            selectionRect.left,
            selectionRect.top,
            width,
            height
        );

        const newCanvas = document.createElement('canvas');
        newCanvas.width = width;
        newCanvas.height = height;

        const newContext = newCanvas.getContext('2d');
        if (!newContext) return;

        newContext.putImageData(imageData, 0, 0);

        const dataUrl = newCanvas.toDataURL('image/png');

        if (!pdfContext) {
            console.log('Context is null');
            return;
        }

        pdfContext.setImagePreviewHandler(dataUrl);
    };

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleTouchStart,
        handleTouchMove,
        overlayCanvasRef,
        imageCanvasRef,
        canvasWrapperRef,
        resizeHandle,
    }
}