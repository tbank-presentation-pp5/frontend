type MessageListener = (data: any) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private listeners = new Map<string, Set<MessageListener>>();
  private presentationId: number | null = null;
  private reconnectTimer: number | null = null;
  private manuallyClosed = false;

  connect(presentationId: number) {
    if (
      this.ws?.readyState === WebSocket.OPEN &&
      this.presentationId === presentationId
    ) {
      return;
    }

    this.manuallyClosed = false;
    this.presentationId = presentationId;

    if (this.ws) {
      this.ws.close();
    }

    const base = import.meta.env.VITE_WS_BASE_URL as string;
    const url = `${base}/ws/presentation/changes?presentationId=${presentationId}`;

    console.log("WS connecting:", url);

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("WS OPEN");
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      this.notifyListeners(message.type, message);

      if (message.fieldId) {
        this.notifyListeners(`field:${message.fieldId}`, message);
      }
    };

    this.ws.onerror = (err) => {
      console.error("WS ERROR", err);
    };

    this.ws.onclose = (event) => {
      console.log("WS CLOSED", event.code);

      this.ws = null;

      if (!this.manuallyClosed) {
        this.scheduleReconnect();
      }
    };
  }

  disconnect() {
    this.manuallyClosed = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.ws?.close();
    this.ws = null;
  }

  private scheduleReconnect() {
    if (this.reconnectTimer || !this.presentationId) return;

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      console.log("WS reconnecting...");
      this.connect(this.presentationId!);
    }, 2000);
  }

  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WS not connected");
    }
  }

  addListener(key: string, listener: MessageListener) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    this.listeners.get(key)!.add(listener);
  }

  removeListener(key: string, listener: MessageListener) {
    this.listeners.get(key)?.delete(listener);
  }

  private notifyListeners(key: string, data: any) {
    this.listeners.get(key)?.forEach((l) => l(data));
  }
}

export const wsManager = new WebSocketManager();