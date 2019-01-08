export enum ServiceConnectionErrorCode {
    NotConnected = "No active connection",
    ConnectionFailed = "Unable to connect",
}

export class ServiceConnectionError extends Error {
    constructor(public code: ServiceConnectionErrorCode, public innerError: any = null) {
        super(code);
    }
}