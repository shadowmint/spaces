import {Observable, Subject} from "rxjs";
import {ServiceConnectionError, ServiceConnectionErrorCode} from "./ServiceConnectionError";

enum WebSocketEvent {
    Open = "open",
    Error = "error",
    Message = "message",
    Close = "close",
}

export class ServiceConnection<TEvent> {
    private socket: WebSocket | null = null;
    private messages: Subject<TEvent> | null = null;

    /** Attempt to open a websocket connection to the given url */
    public connect(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const socket = new WebSocket(url);
            const onOpen = () => {
                this.socket = socket;
                this.messages = new Subject<TEvent>();
                socket.removeEventListener(WebSocketEvent.Open, onOpen);
                socket.removeEventListener(WebSocketEvent.Error, onError);
                socket.addEventListener(WebSocketEvent.Message, this.onMessage);
                socket.addEventListener(WebSocketEvent.Close, this.onClose);
                socket.addEventListener(WebSocketEvent.Error, this.onError);
                resolve();
            };
            const onError = (event: any) => {
                reject(event);
            };
            socket.addEventListener(WebSocketEvent.Open, onOpen);
            socket.addEventListener(WebSocketEvent.Error, onError);
        });
    }

    /** Subscribe to messages from this connection */
    public subscribe(): Observable<TEvent> {
        if (this.messages === null) {
            throw new ServiceConnectionError(ServiceConnectionErrorCode.NotConnected);
        }
        return this.messages;
    }

    private onMessage = (event: any) => {
        if (this.messages === null) {
            throw new ServiceConnectionError(ServiceConnectionErrorCode.NotConnected);
        }
        try {
            const parsed = JSON.parse(event.data);
            this.messages.next(parsed as TEvent);
        } catch (error) {
            this.messages.error(error);
            this.messages = null;
        }
    }

    private onClose = (event: any) => {
        if (this.messages === null) {
            throw new ServiceConnectionError(ServiceConnectionErrorCode.NotConnected);
        }
        this.messages.complete();
        this.messages = null;
    }

    private onError = (event: any) => {
        if (this.messages === null) {
            throw new ServiceConnectionError(ServiceConnectionErrorCode.NotConnected);
        }
        this.messages.error(event as Error);
        this.messages = null;
    }
}
