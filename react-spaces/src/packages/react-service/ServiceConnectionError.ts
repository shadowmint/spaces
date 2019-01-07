export enum ServiceConnectionErrorCode {
    NotConnected = "No active connection"
}

export class ServiceConnectionError extends Error {
    constructor(public code: ServiceConnectionErrorCode) {
        super(code);
    }
}