import React, {Component} from "react";
import {IServiceManagerConfigPartial, ServiceManager} from "../ServiceManager";
import {ServiceManagerStatus} from "../ServiceManagerEvents";
import {ServiceStatusBar} from "./ServiceStatusBar";

interface IServerEvent {
    data: any;
}

interface IService {
    /** The service url */
    url: string;

    /** Draw a status bar? */
    useStatusBar: boolean;

    /** Render the application content with this */
    render: ServiceRenderProp;

    /** Any addition service config */
    config: IServiceManagerConfigPartial;
}

// tslint:disable-next-line:max-line-length
export type ServiceRenderProp = (status: ServiceManagerStatus, connection: ServiceManager<IServerEvent>, error: Error | null, failedAttempts: number, maxAttempts: number, lastConnected: number | null) => React.ReactNode;

export interface IServiceState {
    connection: ServiceManager<IServerEvent>;
    status: ServiceManagerStatus;
    failedAttempts?: number;
    maxAttempts?: number;
    lastConnected?: number | null;
    idle: boolean;
    error: Error | null;
}

export class Service extends Component<IService, IServiceState> {
    constructor(props: any) {
        super(props);
        const manager = new ServiceManager<IServerEvent>(this.props.url);
        this.state = {
            connection: manager,
            error: null,
            failedAttempts: 0,
            idle: true,
            lastConnected: null,
            maxAttempts: 0,
            status: ServiceManagerStatus.Disconnected,
        };
    }

    public componentDidMount(): void {
        this.setState({
            connection: new ServiceManager<IServerEvent>(this.props.url, this.props.config),
        }, () => {
            this.state.connection.events.status.subscribe((status) => {
                console.log("Event", status, this.state.connection.idle);
                this.setState({
                    error: status.error || null,
                    failedAttempts: status.failedAttempts,
                    idle: this.state.connection.idle,
                    lastConnected: status.lastConnected,
                    maxAttempts: status.maxAttempts,
                    status: status.status,
                });
            });
            this.state.connection.connect().then(null, (error) => {
                this.setState({error});
            }).catch((error) => {
                this.setState({error});
            });
        });
    }

    public componentWillUnmount(): void {
        if (!this.state.connection) {
            return;
        }
        this.state.connection.close();
    }

    public render() {
        return (
            <>
                {this.props.useStatusBar
                    ? <ServiceStatusBar idle={this.state.idle} onConnect={this.onConnect} {...this.state}/>
                    : <React.Fragment/>}
                {this.props.render(
                    this.state.status,
                    this.state.connection,
                    this.state.error,
                    !!this.state.failedAttempts ? this.state.failedAttempts : 0,
                    !!this.state.maxAttempts ? this.state.maxAttempts : 0,
                    !!this.state.lastConnected ? this.state.lastConnected : null,
                )}
            </>
        );
    }

    /** Attempt to reconnect to the server */
    private onConnect = () => {
        return this.state.connection.connect();
    }
}