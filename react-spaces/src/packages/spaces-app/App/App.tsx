import React, {Component} from "react";
import {Service} from "../../react-service/components/Service";
import {NScene} from "../../react-surfaces/components/NScene";
import {NSurface} from "../../react-surfaces/components/NSurface";
import {Transform} from "../../react-surfaces/model/Transform";
import {SocketService} from "../../spaces-api/network/socket";

const Demo = (props: any) => {
    return (
        <div style={{background: "#efefef", border: "3px solid #333333"}}>
            <h1>POC</h1>
            <p>
                {props.children}
            </p>
            <button onClick={() => alert("hi")}>Click me</button>
        </div>
    );
};

const objects = [
    {
        id: 0,
        transform: new Transform({x: 0, y: 0, z: 0}),
        content: () => (
            <>
                <Demo>Demo one</Demo>
                <Demo>Demo two dfdf</Demo>
            </>
        ),
    },
    {
        id: 1,
        transform: new Transform({x: 40, y: 3, z: 60}),
        content: () => (
            <Demo>Demo hello OK</Demo>
        ),
    },
];

const serverUrl = "ws://127.0.0.1:3012";

class App extends Component {
    public render() {
        return (
            <div className="App">
                <Service
                    url={serverUrl}
                    config={{retryTimeout: 200}}
                    useStatusBar={true}
                    render={(status, connection, error) => (
                        <div>
                            Hello world
                        </div>
                    )}
                />
                <NScene width={window.innerWidth}
                        height={window.innerHeight - 50}
                        fov={40} near={1}
                        far={10000}
                        render={(scene, camera) => (
                            <>
                                {objects.map((i) => (
                                    <NSurface scene={scene} transform={i.transform} key={i.id}>
                                        {i.content()}
                                    </NSurface>
                                ))}
                            </>
                        )}/>
            </div>
        );
    }
}

export default App;
