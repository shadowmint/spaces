import {Menu} from "antd";
import * as React from "react";
import {SpaceLogger} from "../../../../spaces-model/services/SpaceLogger";
import {SpaceTheme} from "../../../../spaces-ui/common/spaces/SpaceTheme/SpaceTheme";
import {IStory} from "../../model/IStory";
import {IStoryNavMain, IStoryNavSub, StoryNav} from "../../model/StoryNav";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

interface IStorybookSidenav {
    stories: IStory[];
    onClick: (event: any) => void;
}

export class StorybookSidenav extends React.Component<IStorybookSidenav> {
    public render() {
        const nav = this.resolveNav();
        return (
            <SpaceTheme>
                <Menu onClick={this.onClick} style={{width: 256, height: "100%"}} mode="inline">
                    {nav.mains.map((main: IStoryNavMain) => (
                        <SubMenu key={main.name} title={<span>{main.name}</span>}>
                            {main.subs.map((sub: IStoryNavSub) => (
                                <MenuItemGroup key={`${main.name}::${sub.name}`} title={sub.name}>
                                    {sub.stories.map((story: IStory) => (
                                        <Menu.Item key={story.name}>{story.display}</Menu.Item>
                                    ))}
                                </MenuItemGroup>
                            ))}
                        </SubMenu>
                    ))}
                </Menu>
            </SpaceTheme>
        );
    }

    private resolveNav(): StoryNav {
        const rtn = new StoryNav();
        for (const story of this.props.stories) {
            rtn.addStory(story);
        }
        return rtn;
    }

    private onClick = (event: any) => {
        new SpaceLogger().log(event);
    }
}
