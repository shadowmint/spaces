import TrackballControls from "three-trackballcontrols";

export class TrackballControlsWrapper {
    constructor(camera, renderer) {
        this.native = new TrackballControls(camera, renderer);
    }
}
