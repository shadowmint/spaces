import {CSS3DRenderer} from "three-css3drenderer";

/** This is a wrapper for the non-functional react types for three.js */
export class CSS3DRendererWrapper {
    constructor() {
        this.native = new CSS3DRenderer();
    }
}