import {CSS3DObject} from "three-css3drenderer";

/** This is a wrapper for the non-functional react types for three.js */
export class CSS3DObjectWrapper {
    constructor(element) {
        this.native = new CSS3DObject(element);
    }
}