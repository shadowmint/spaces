export class SocketService {
    public connect(): Promise<SocketService> {
        return new Promise((resolve, reject) => {
            // Create WebSocket connection.
            const socket = new WebSocket("ws://localhost:3012");

            // Connection opened
            socket.addEventListener("open", (event) => {
                console.log("Got open event", event);
                socket.send("Hello Server!");
                resolve(this);
            });

            // Listen for messages
            socket.addEventListener("message", (event) => {
                console.log("Message from server ", event.data);
            });

            // Listen for messages
            socket.addEventListener("error",  (event) => {
                console.log("Error", event);
                reject(event);
            });


            // Listen for messages
            socket.addEventListener("close", (event) => {
                console.log("close", event);
            });
        });

    }
}
