import {IStory} from "./IStory";

export interface IStoryNavSub {
    name: string;
    stories: IStory[];
}

export interface IStoryNavMain {
    name: string;
    subs: IStoryNavSub[];
}

export interface IStoryNav {
    mains: IStoryNavMain[];
}

export class StoryNav implements IStoryNav {
    public mains: IStoryNavMain[] = [];

    /** Get a main */
    public getMain(name: string) {
        let match = this.mains.find((i) => i.name === name);
        if (!match) {
            match = {name, subs: []};
            this.mains.push(match);
        }
        return match;
    }

    /** Get a sub from a specific main */
    public getSub(main: string, name: string) {
        const mainMatch = this.getMain(main);
        let match = mainMatch.subs.find((i) => i.name === name);
        if (!match) {
            match = {name, stories: []};
            mainMatch.subs.push(match);
        }
        return match;
    }

    /** Add a story */
    public addStory(story: IStory) {
        const parts = story.name.split(".");
        if (parts.length !== 3) {
            throw new Error(`Invalid story name: ${story.name}`);
        }
        const main = parts[0];
        const sub = parts[1];
        const name = parts[2];
        const subInstance = this.getSub(main, sub);
        story.display = name;
        subInstance.stories.push(story);
    }
}