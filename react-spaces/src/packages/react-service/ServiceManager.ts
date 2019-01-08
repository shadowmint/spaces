import {ServiceConnection} from "./ServiceConnection";
import {ServiceManagerError, ServiceManagerErrorCode} from "./ServiceManagerError";
import {
    IServiceManagerMessageEvent,
    IServiceManagerStatusEvent,
    ServiceManagerEvents,
    ServiceManagerStatus,
} from "./ServiceManagerEvents";

/** A callback type to dispatch message events */
type MessageCb<T> = (event: IServiceManagerMessageEvent<T>) => void;

/** A callback type to dispatch status events */
type StatusCb<T> = (event: IServiceManagerStatusEvent<T>) => void;

/** The current status of the connection manager */
enum ServiceManagerState {
    Connected,
    Connecting,
    Disconnected,
    WaitRetry,
}

interface IServiceManagerConfig {
    retryTimeout: number;
    maxRetries: number;
    onError: (e: any) => void;
}

export interface IServiceManagerConfigPartial {
    retryTimeout?: number;
    maxRetries?: number;
    onError?: (e: any) => void;
}

const defaultConfig: IServiceManagerConfig = {
    maxRetries: 10,
    onError: (e) => {
        /* Ignore error logging by default */
    },
    retryTimeout: 5000,
};

export class ServiceManager<TEvent> {
    /** The events API for the service manager */
    public events: ServiceManagerEvents<TEvent>;

    /** If this service busy trying to do something? */
    public get idle(): boolean {
        console.log(this.state, ServiceManagerState.Disconnected);
        return this.state === ServiceManagerState.Disconnected;
    }

    private onMessage: null | MessageCb<TEvent> = null;

    private onStatus: null | StatusCb<TEvent> = null;

    private connection: null | ServiceConnection<TEvent> = null;

    private state: ServiceManagerState;

    private failuresSinceLastConnection: number = 0;

    private reconnectTimerHook: any = null;

    private config: IServiceManagerConfig;

    private lastConnected: number | null = null;

    /** Create a new service manager */
    constructor(private url: string, config: IServiceManagerConfigPartial = {}) {
        this.events = new ServiceManagerEvents(this);
        this.config = {...defaultConfig, ...config};
        this.state = ServiceManagerState.Disconnected;
        this.lastConnected = null;
    }

    public async connect() {
        if (this.state !== ServiceManagerState.Disconnected) {
            throw new ServiceManagerError(ServiceManagerErrorCode.AlreadyConnected);
        }
        this.close();
        await this.tryConnectNow();
    }

    public registerStreams(onMessage: MessageCb<TEvent>, onStatus: StatusCb<TEvent>) {
        this.onMessage = onMessage;
        this.onStatus = onStatus;
    }

    public close() {
        this.failuresSinceLastConnection = 0;
        this.transitionState(ServiceManagerState.Disconnected);
    }

    private async tryConnectNow(lastError: Error | null = null) {
        this.transitionState(ServiceManagerState.Connecting, lastError);
        this.connection = new ServiceConnection();
        try {
            await this.connection.connect(this.url);
            this.connection.observer().subscribe((messageEvent) => {
                this.dispatchMessage(messageEvent);
            }, (error) => {
                this.scheduleReconnectAttempt(error);
            }, async () => {
                // Try to reconnect, the server dropped out
                this.close();
                await this.connect();
            });
            this.transitionState(ServiceManagerState.Connected);
        } catch (error) {
            this.connection = null;
            this.scheduleReconnectAttempt(error);
            return;
        }
    }

    private scheduleReconnectAttempt(error: Error | null = null) {
        if (error) {
            this.config.onError(error);
            this.failuresSinceLastConnection += 1;
        }
        if (this.failuresSinceLastConnection > this.config.maxRetries) {
            this.transitionState(
                ServiceManagerState.Disconnected,
                new Error(`Disconnected after ${this.config.maxRetries} attempts`));
        } else {
            this.transitionState(ServiceManagerState.WaitRetry, error);
            this.reconnectTimerHook = setTimeout(async () => {
                await this.tryConnectNow(error);
            }, this.config.retryTimeout);
        }
    }

    private transitionState(state: ServiceManagerState, error: Error | null = null) {
        if (this.onStatus == null) {
            throw new ServiceManagerError(ServiceManagerErrorCode.NoEventHandlerRegistered);
        }

        // Cancel any pending action
        if (this.reconnectTimerHook) {
            clearTimeout(this.reconnectTimerHook);
            this.reconnectTimerHook = null;
        }

        switch (state) {
            // If we are disconnected, stop.
            case ServiceManagerState.Disconnected:
                this.state = ServiceManagerState.Disconnected;
                if (this.connection) {
                    this.connection.close();
                    this.connection = null;
                }
                this.onStatus({
                    context: this,
                    error,
                    status: ServiceManagerStatus.Disconnected,
                });
                break;

            // We are now busy trying to connect
            case ServiceManagerState.Connecting:
                console.log("Connecting");
                this.state = ServiceManagerState.Connecting;
                this.onStatus({
                    context: this,
                    error,
                    failedAttempts: this.failuresSinceLastConnection,
                    lastConnected: this.lastConnected,
                    maxAttempts: this.config.maxRetries,
                    status: ServiceManagerStatus.Connecting,
                });
                break;

            // We are now waiting for the callback to try to connect
            case ServiceManagerState.WaitRetry:
                console.log("WaitRetry");
                this.state = ServiceManagerState.WaitRetry;
                this.onStatus({
                    context: this,
                    error,
                    failedAttempts: this.failuresSinceLastConnection,
                    lastConnected: this.lastConnected,
                    maxAttempts: this.config.maxRetries,
                    status: ServiceManagerStatus.Connecting,
                });
                break;

            // We're connected now
            case ServiceManagerState.Connected:
                console.log("Connected");
                this.state = ServiceManagerState.Connected;
                this.failuresSinceLastConnection = 0;
                this.lastConnected = Date.now();
                this.onStatus({
                    context: this,
                    status: ServiceManagerStatus.Connected,
                });
                break;
        }
    }

    private dispatchMessage(messageEvent: TEvent) {
        if (this.onMessage == null) {
            throw new ServiceManagerError(ServiceManagerErrorCode.NoEventHandlerRegistered);
        }

        this.onMessage({
            context: this,
            message: messageEvent,
        });
    }
}
