import {ReactNode} from 'react';
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";

type CustomScrollProps = {
    children: ReactNode,
}

export function Scroll(
    props: CustomScrollProps
) {
    return (
        <OverlayScrollbarsComponent style={{ height: "100%", width: "100%"}}>
            {props.children}
        </OverlayScrollbarsComponent>
    );
}