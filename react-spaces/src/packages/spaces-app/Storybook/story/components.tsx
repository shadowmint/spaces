import {Button} from "antd";
import * as React from "react";
import {IStory} from "../model/IStory";

export const componentStories: IStory[] = [
    {
        name: "Components.Native.default",
        render: () => (
            <Button htmlType="button">Hello</Button>
        ),
    },
    {
        name: "Components.Native.modal",
        render: () => (
            <Button htmlType="button">Hello</Button>
        ),
    },
];
