export default class CustomWebSocket {
  private socket: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private reconnectInterval: number = 3000; // 3 seconds
  private url: string;
  private pingInterval: number = 250000;
  private pingTimeout: number | null = null;

  constructor(path: string) {
    this.url = this.getWebSocketUrl(path);
  }

  private getWebSocketUrl(path: string): string {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    return `${protocol}//${host}${path}`;
  }

  connect(onMessage: (data: any) => void, onError?: (error: any) => void) {
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log("WebSocket connection established.");
        this.reconnectAttempts = 0;
        this.startPing();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (onError) onError(error);
        this.handleReconnect(onMessage, onError);
      };

      this.socket.onclose = () => {
        console.log("WebSocket connection closed.");
        this.stopPing();
        this.handleReconnect(onMessage, onError);
      };
    } catch (error) {
      if (onError) onError(error);
      this.handleReconnect(onMessage, onError);
    }
  }

  private handleReconnect(
    onMessage: (data: any) => void,
    onError?: (error: any) => void
  ) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.connect(onMessage, onError);
      }, this.reconnectInterval);
    } else {
      if (onError) onError(new Error("Max reconnection attempts reached"));
      this.close();
    }
  }

  private startPing() {
    this.pingTimeout = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: "ping" }));
      }
    }, this.pingInterval);
  }

  private stopPing() {
    if (this.pingTimeout) {
      clearInterval(this.pingTimeout);
      this.pingTimeout = null;
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.reconnectAttempts = 0;
    this.stopPing();
  }

  send(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open.");
    }
  }
}
