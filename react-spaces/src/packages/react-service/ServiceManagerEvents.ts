import {Observable, Subject} from "rxjs";
import {ServiceManager} from "./ServiceManager";

export enum ServiceManagerStatus {
    Connected = "Connected",
    Connecting = "Connecting",
    Disconnected = "Disconnected",
}

export interface IServiceManagerMessageEvent<TEvent> {
    context: ServiceManager<TEvent>;
    message: TEvent;
}

export interface IServiceManagerStatusEvent<TEvent> {
    context: ServiceManager<TEvent>;
    status: ServiceManagerStatus;
    error?: Error | null;
    lastConnected?: number | null;
    failedAttempts?: number;
    maxAttempts?: number;
}

export class ServiceManagerEvents<TEvent> {
    private messageStream = new Subject<IServiceManagerMessageEvent<TEvent>>();
    private statusStream = new Subject<IServiceManagerStatusEvent<TEvent>>();

    public constructor(private parent: ServiceManager<TEvent>) {
        const onMessage = (event: IServiceManagerMessageEvent<TEvent>) => this.onMessage(event);
        const onStatus = (event: IServiceManagerStatusEvent<TEvent>) => this.onStatus(event);
        parent.registerStreams(onMessage, onStatus);
    }

    public get messages(): Observable<IServiceManagerMessageEvent<TEvent>> {
        return this.messageStream;
    }

    public get status(): Observable<IServiceManagerStatusEvent<TEvent>> {
        return this.statusStream;
    }

    private onMessage(event: IServiceManagerMessageEvent<TEvent>) {
        this.messageStream.next(event);
    }

    private onStatus(event: IServiceManagerStatusEvent<TEvent>) {
        this.statusStream.next(event);
    }
}
