import {memo} from "react";

export const ImagePreview = memo(function ImagePreview(
    props: {imagePreview : string}
){
    return (
        <div className={"w-2/4 p-4 flex items-center justify-center border-solid border-2 border-l-zinc-400"}>
            {props.imagePreview ?
                <img
                    src={props.imagePreview}
                    alt={"preview"}
                    className={"max-w-full w-auto h-auto"}/>
                : <p>No preview available</p>
            }
        </div>
    )
});