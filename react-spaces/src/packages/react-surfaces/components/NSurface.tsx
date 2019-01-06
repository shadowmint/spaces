import * as React from "react";
import {CSS3DObjectWrapper} from "../3rdparty/three/CSS3DObjectWrapper";
import * as THREE from "three";
import styles from "./NSurface.module.scss";
import {Transform} from "../model/Transform";

interface NSurfaceProps {
    /** The scene to render this surface on */
    scene: THREE.Scene

    /** The position to render this surface */
    transform: Transform
}

export class NSurface extends React.Component<NSurfaceProps> {
    private readonly frameRef: React.RefObject<HTMLDivElement>;
    private cssRefNode: CSS3DObjectWrapper | null = null;

    constructor(props: NSurfaceProps) {
        super(props);
        this.frameRef = React.createRef();
    }

    componentDidMount() {
        this.cssRefNode = new CSS3DObjectWrapper(this.frameRef.current);
        this.props.scene.add(this.cssRefNode.native);
        this.syncNodeState();
    }

    /** Sync application state to dom nodes */
    public componentDidUpdate() {
        this.syncNodeState();
    }

    private syncNodeState() {
        if (this.cssRefNode == null) return;
        this.cssRefNode.native.position.x = this.props.transform.position.x;
        this.cssRefNode.native.position.y = this.props.transform.position.y;
        this.cssRefNode.native.position.z = this.props.transform.position.z;
    }

    public render() {
        return (
            <div className={styles.NSurface} ref={this.frameRef}>
                {this.props.children}
            </div>
        )
    }
}