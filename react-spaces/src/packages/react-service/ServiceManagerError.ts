export enum ServiceManagerErrorCode {
    AlreadyConnected = "Invalid action; the manager is already connected",
    NoEventHandlerRegistered = "No event handler was registered to the service manager",
}

export class ServiceManagerError extends Error {
    constructor(public code: ServiceManagerErrorCode) {
        super(code);
    }
}