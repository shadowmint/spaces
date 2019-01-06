import * as React from "react";
import * as THREE from "three";
import {IRendererControls, NRenderer} from "./NRenderer";
import {TrackballControlsWrapper} from "../3rdparty/three/TrackBallControlsWrapper";

interface NSceneState {
    /** A self managed scene instance */
    scene: THREE.Scene | null;

    /** The camera instance */
    camera: THREE.PerspectiveCamera | null;

    /** A factory to return the controls object instance */
    controlsFactory: ((camera: THREE.PerspectiveCamera, rendererDomElement: any) => IRendererControls) | null;
}

interface NSceneProps {
    width: number;
    height: number;
    fov: number;
    near: number;
    far: number;

    /** A render prop that takes the scene and camera */
    render: (scene: THREE.Scene, camera: THREE.Camera) => React.ReactNode;
}

export class NScene extends React.Component<NSceneProps, NSceneState> {
    public constructor(props: NSceneProps) {
        super(props);
        this.state = {
            scene: null,
            camera: null,
            controlsFactory: null
        }
    }

    public componentDidMount() {
        const scene = new THREE.Scene();

        const aspectRatio = this.props.width / this.props.height;
        const camera = new THREE.PerspectiveCamera(this.props.fov, aspectRatio, this.props.near, this.props.far);

        const controlsFactory = (camera: THREE.PerspectiveCamera, rendererDomElement: any) => {
            const controls = new TrackballControlsWrapper(camera, rendererDomElement);
            controls.native.rotateSpeed = 0.5;
            controls.native.minDistance = 500;
            controls.native.maxDistance = 6000;
            return controls;
        };

        this.setState({
            scene,
            camera,
            controlsFactory
        });
    }

    public render() {
        if (this.state.scene == null || this.state.camera == null || this.state.controlsFactory == null) {
            return <React.Fragment/>;
        }
        return (
            <NRenderer scene={this.state.scene}
                       camera={this.state.camera}
                       controlsFactory={this.state.controlsFactory}
                       width={this.props.width}
                       height={this.props.height}>
                {this.props.render(this.state.scene, this.state.camera)}
            </NRenderer>
        )
    }
}