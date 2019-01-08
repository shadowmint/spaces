import * as React from "react";
import {ServiceManagerStatus} from "../ServiceManagerEvents";
import styles from "./ServiceStatusBar.module.scss";

interface IServiceStatusBar {
    status: ServiceManagerStatus;
    error: Error | null;
    lastConnected?: number | null;
    failedAttempts?: number;
    maxAttempts?: number;
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

export const ServiceStatusBar = (props: IServiceStatusBar) => {
    const isConnected = props.status === ServiceManagerStatus.Connected;

    const status = props.status === ServiceManagerStatus.Connecting
        ? `${props.status}, attempt ${props.failedAttempts}/${props.maxAttempts}...`
        : props.status;

    const lastConnected = props.lastConnected ? new Date(props.lastConnected).toString() : "";

    return (
        <div className={styles.ServiceStatusBar} style={{display: isConnected ? "none" : "block"}}>
            <div className="status">{status}</div>
            <div className="last">{lastConnected}</div>
            <ServiceStatusBarError {...props}/>
        </div>
    );
};
