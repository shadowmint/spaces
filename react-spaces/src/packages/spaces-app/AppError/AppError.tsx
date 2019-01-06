import * as React from "react";
import {SpaceModal} from "../../spaces-ui/common/spaces/SpaceModal/SpaceModal";

export const AppError = (props:any) => (
    <SpaceModal open={true}>
        {props.children}
    </SpaceModal>
);