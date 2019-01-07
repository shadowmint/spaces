export class ServiceManager<TEvent> {
    constructor(private url: string, private retryTimeout: number = 1000, private maxRetries = 10) {
    }

    public connect(): Promise<void> {
    }



}