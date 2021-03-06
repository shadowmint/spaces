import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {SocketService} from "./packages/spaces-api/network/socket";
import App from "./packages/spaces-app/App/App";
import {AppError} from "./packages/spaces-app/AppError/AppError";
import {StoryBook} from "./packages/spaces-app/Storybook/Storybook";
import "./serviceWorker";

(async () => {
    // Test mode
    if (document.location.toString().indexOf("#storybook") !== -1) {
        ReactDOM.render(<StoryBook/>, document.getElementById("root"));
        return;
    }

    // Real mode
    ReactDOM.render(<App/>, document.getElementById("root"));
})();
