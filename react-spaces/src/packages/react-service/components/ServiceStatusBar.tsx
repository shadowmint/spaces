import * as React from "react";
import {ServiceManagerStatus} from "../ServiceManagerEvents";
import styles from "./ServiceStatusBar.module.scss";

interface IServiceStatusBar {
    status: ServiceManagerStatus;
    error: Error | null;
    idle: boolean;
    lastConnected?: number | null;
    failedAttempts?: number;
    maxAttempts?: number;
    onConnect: () => Promise<void>;
}

const ServiceStatusBarError = (props: IServiceStatusBar) => {
    if (!props.error) {
        return <React.Fragment/>;
    }
    return (
        <div className="errorBar">
            <span>Error: </span>
            <span>
                {(props.error || {message: "No error message"}).message}
            </span>
        </div>
    );
};

const ServiceStatusBarReconnectButton = (props: IServiceStatusBar) => (
    <div className="reconnect">
        <button onClick={props.onConnect}>Reconnect</button>
    </div>
);

const ServiceStatusBarReconnect = (props: IServiceStatusBar) => {
    const lastConnected = props.lastConnected ? new Date(props.lastConnected).toString() : "never";
    return (
        <div className="historyBar">
            <div className="last">Last connected: {lastConnected}</div>
            {props.idle ? <ServiceStatusBarReconnectButton {...props}/> : <React.Fragment/>}
        </div>
    );
};


export const ServiceStatusBar = (props: IServiceStatusBar) => {
    const isConnected = props.status === ServiceManagerStatus.Connected;

    const status = props.status === ServiceManagerStatus.Connecting
        ? `${props.status}, attempt ${props.failedAttempts}/${props.maxAttempts}...`
        : props.status;

    return (
        <div className={styles.ServiceStatusBar} style={{display: isConnected ? "none" : "block"}}>
            <div className="status">{status}</div>
            Idle {props.idle ? "TRUE" : "FALSE"}
            <ServiceStatusBarError {...props}/>
            <ServiceStatusBarReconnect {...props}/>
        </div>
    );
};
