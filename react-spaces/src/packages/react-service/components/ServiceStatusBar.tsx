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
        return (
            <div className={styles.errorBar}>Unknown network status</div>
        );
    }
    const errMessage = (props.error || {message: "No error message"}).message;
    if (props.status === ServiceManagerStatus.Connecting) {
        return (
            <div className={styles.errorBar}>
                {errMessage}, {props.failedAttempts}/{props.maxAttempts} connection failures.
            </div>
        );
    }
    return (
        <div className={styles.errorBar}>{errMessage}</div>
    );
};

const ServiceStatusBarReconnectButton = (props: IServiceStatusBar) => (
    <div className={styles.reconnect}>
        <button className={styles.reconnect} onClick={props.onConnect}>Reconnect</button>
    </div>
);

const ServiceStatusBarReconnect = (props: IServiceStatusBar) => {
    const lastConnected = props.lastConnected ? new Date(props.lastConnected).toLocaleTimeString() : "never";
    return (
        <div className={styles.historyBar}>
            <span>Last connected: {lastConnected}</span>
            {props.idle ? <ServiceStatusBarReconnectButton {...props}/> : <React.Fragment/>}
        </div>
    );
};

export const ServiceStatusBar = (props: IServiceStatusBar) => {
    const isConnected = props.status === ServiceManagerStatus.Connected;
    return (
        <div className={styles.component} style={{display: isConnected ? "none" : "flex"}}>
            <ServiceStatusBarReconnect {...props}/>
            <ServiceStatusBarError {...props}/>
            <div className={styles.status}>Network status: {props.status}</div>
        </div>
    );
};
