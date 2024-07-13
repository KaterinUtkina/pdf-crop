import {memo} from "react";

export const ImagePreview = memo(function ImagePreview(
    props: {imagePreview : string}
){
    return (
        <div>
            <img src={props.imagePreview} alt={""}/>
        </div>
    )
});