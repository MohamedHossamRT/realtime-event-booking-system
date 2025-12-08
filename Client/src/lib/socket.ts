import { io, Socket } from "socket.io-client";
import { SOCKET_URL, STORAGE_KEY } from "@/config/env";

// Singleton Socket
class SocketService {
  private static instance: Socket | null = null;

  public static connect(): Socket {
    const token = localStorage.getItem(STORAGE_KEY);

    if (!token) {
      throw new Error(
        "Cannot connect to socket: No authentication token found."
      );
    }

    if (!this.instance) {
      this.instance = io(SOCKET_URL, {
        auth: {
          token: `Bearer ${token}`,
        },
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
      });

      this.instance.on("connect", () => {
        console.log("Socket connected:", this.instance?.id);
      });

      this.instance.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });
    }

    return this.instance;
  }

  public static get(): Socket | null {
    return this.instance;
  }

  // Disconnect (Cleanup)
  public static disconnect(): void {
    if (this.instance) {
      this.instance.disconnect();
      this.instance = null;
      console.log("Socket disconnected");
    }
  }
}

export default SocketService;
