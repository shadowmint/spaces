import * as React from "react";

export interface IStory {
    name: string;
    display?: string;
    render: () => React.ReactNode;
}
