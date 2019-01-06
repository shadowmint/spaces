import {Vector3} from "./Vector3";

export class Transform {
    public position: Vector3;

    public constructor(position: Vector3) {
        this.position = position;
    }
}