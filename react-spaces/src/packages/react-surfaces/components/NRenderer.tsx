import * as THREE from "three";
import React, {Component} from "react";
import {CSS3DRendererWrapper} from "../3rdparty/three/CSS3DRendererWrapper";
import styles from "./NRenderer.module.scss";

interface NRendererProps {
    /** The scene instance */
    scene: THREE.Scene;

    /** The camera instance */
    camera: THREE.PerspectiveCamera;

    /** Controls */
    controlsFactory: (camera: THREE.PerspectiveCamera, rendererDomElement: any) => IRendererControls;

    /** Width of the render viewport */
    width: number,

    /** Height of the render viewport */
    height: number
}

interface NRendererState {
    /** The active controls object */
    controls: IRendererControls;

    /** The active renderer */
    renderer: CSS3DRendererWrapper;

    /** Are we currently rendering? */
    rendering: boolean;
}

export interface IRendererControls {
    native: any;
}

export class NRenderer extends Component<NRendererProps, NRendererState> {
    /** A reference to the native dom element */
    private readonly rendererRef: React.RefObject<HTMLDivElement>;

    /** Update this element and re-render it when called */
    private readonly renderSceneCallback: () => void;

    constructor(props: any) {
        super(props);
        this.rendererRef = React.createRef<HTMLDivElement>();

        this.renderSceneCallback = () => {
            this.renderScene();
            if (this.state.rendering) {
                requestAnimationFrame(this.renderSceneCallback);
            }
        };

        this.state = {
            renderer: new CSS3DRendererWrapper(),
            controls: {native: {}},
            rendering: false
        };
    }

    componentDidMount() {
        this.props.camera.position.z = 3000;

        this.state.renderer.native.setSize(this.props.width, this.props.height);
        if (this.rendererRef.current) {
            this.rendererRef.current.appendChild(this.state.renderer.native.domElement);
        }

        const controls = this.props.controlsFactory(this.props.camera, this.state.renderer.native.domElement);
        controls.native.addEventListener('change', () => {
            this.state.renderer.native.render(this.props.scene, this.props.camera);
        });

        this.setState({
            controls,
            rendering: true
        }, () => {
            this.renderSceneCallback();
        });
    }

    componentWillUnmount(): void {
        this.setState({
            rendering: false
        });
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        this.renderScene();
    }

    renderScene() {
        this.state.controls.native.update();
        this.state.renderer.native.render(this.props.scene, this.props.camera);
    }

    render() {
        return (
            <div className={styles.NRenderer} style={{width: this.props.width, height: this.props.height}} ref={this.rendererRef}>
                {this.props.children}
            </div>
        )
    }
}