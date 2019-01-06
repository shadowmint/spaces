import * as React from "react";
import {SpaceLogger} from "../../spaces-model/services/SpaceLogger";
import {SpaceTheme} from "../../spaces-ui/common/spaces/SpaceTheme/SpaceTheme";
import {StorybookSidenav} from "./components/StorybookSidenav/StorybookSidenav";
import {IStory} from "./model/IStory";
import {componentStories} from "./story/components";

interface IStoryBookState {
    stories: IStory[];
}

const stories = [
    ...componentStories,
];

export class StoryBook extends React.Component<any, IStoryBookState> {
    constructor(props: any) {
        super(props);
        this.state = {
            stories,
        };
    }

    public render() {
        return (
            <SpaceTheme>
                <StorybookSidenav stories={this.state.stories} onClick={this.onClick}/>
            </SpaceTheme>
        );
    }

    private onClick = (event: any) => {
        new SpaceLogger().log(event);
    }
}
