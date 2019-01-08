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
            try {
                const socket = new WebSocket(url);
                const onOpen = () => {
                    this.socket = socket;
                    this.messages = new Subject<TEvent>();
                    socket.removeEventListener(WebSocketEvent.Open, onOpen);
                    socket.removeEventListener(WebSocketEvent.Error, onError);
                    socket.addEventListener(WebSocketEvent.Message, (e) => this.onMessage(e));
                    socket.addEventListener(WebSocketEvent.Close, (e) => this.onClose(e));
                    socket.addEventListener(WebSocketEvent.Error, (e) => this.onError(e));
                    resolve();
                };
                const onError = (event: any) => {
                    reject(new ServiceConnectionError(ServiceConnectionErrorCode.ConnectionFailed, event));
                };
                socket.addEventListener(WebSocketEvent.Open, onOpen);
                socket.addEventListener(WebSocketEvent.Error, onError);
            } catch (error) {
                reject(new ServiceConnectionError(ServiceConnectionErrorCode.ConnectionFailed, event));
            }
        });
    }

    /** Subscribe to messages from this connection */
    public observer(): Observable<TEvent> {
        if (this.messages === null) {
            throw new ServiceConnectionError(ServiceConnectionErrorCode.NotConnected);
        }
        return this.messages;
    }

    /** Close this socket connection */
    public close() {
        if (this.socket == null || this.messages == null) {
            throw new ServiceConnectionError(ServiceConnectionErrorCode.NotConnected);
        }

        // 1000 = normal explicit closure event.
        // see: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
        this.socket.close(1000);
        this.socket = null;

        // Close message stream
        this.messages.complete();
        this.messages = null;
    }

    private onMessage(event: any) {
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

    private onClose(event: any) {
        if (this.messages === null) {
            throw new ServiceConnectionError(ServiceConnectionErrorCode.NotConnected);
        }
        this.messages.complete();
        this.messages = null;
    }

    private onError(event: any) {
        if (this.messages === null) {
            throw new ServiceConnectionError(ServiceConnectionErrorCode.NotConnected);
        }
        console.log(event);
        this.messages.error(event as Error);
        this.messages = null;
    }
}
