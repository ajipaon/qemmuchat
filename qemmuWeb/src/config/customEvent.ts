export default class CustomEventSource {
  private eventSource: EventSource | null = null;

  constructor(private url: string, private headers: Record<string, string>) {}

  // Connects to the EventSource and handles messages and errors.
  connect(onMessage: (data: any) => void, onError?: (error: any) => void) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", this.url, true);

    // Set request headers
    for (const [key, value] of Object.entries(this.headers)) {
      xhr.setRequestHeader(key, value);
    }

    // Handle ready state changes
    xhr.onreadystatechange = () => {
      if (
        xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED &&
        xhr.status === 200
      ) {
        this.eventSource = new EventSource(this.url);

        // Handle incoming messages
        this.eventSource.onmessage = (event) => {
          onMessage(event.data);
        };

        // Handle errors if provided
        if (onError) {
          this.eventSource.onerror = (error) => {
            onError(error);
            this.close();
          };
        }

        // Abort the XMLHttpRequest as we have switched to EventSource
        xhr.abort();
      }
    };

    // Handle errors
    xhr.onerror = (error) => {
      if (onError) onError(error);
    };

    // Send the request
    xhr.send();
  }

  // Closes the EventSource connection
  close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
