export default class CustomWebSocket {
  private socket: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private reconnectInterval: number = 3000; // 3 seconds
  private url: string;

  constructor(private path: string, private headers: Record<string, string>) {
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
      };

      this.socket.onmessage = (event) => {
        onMessage(event.data);
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (onError) onError(error);
        this.handleReconnect(onMessage, onError);
      };

      this.socket.onclose = () => {
        console.log("WebSocket connection closed.");
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

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.reconnectAttempts = 0;
  }

  send(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open.");
    }
  }
}
