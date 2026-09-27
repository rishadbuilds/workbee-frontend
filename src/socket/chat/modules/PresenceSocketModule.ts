import { Socket } from 'socket.io-client';
import { ChatSocketConnection } from '../connection/ChatSocketConnection';

export interface UserStatusEvent {
  userId: string;
  status: 'online' | 'offline';
}

export class PresenceSocketModule {
  private statusCallbacks: Set<(data: UserStatusEvent) => void> = new Set();
  private bulkCallbacks: Set<(data: UserStatusEvent[]) => void> = new Set();
  private connection: ChatSocketConnection;

  constructor(connection: ChatSocketConnection) {
    this.connection = connection;
    this.connection.registerAttacher((socket) => this.reattach(socket));
  }

  private reattach(socket: Socket): void {
    this.statusCallbacks.forEach(cb => {
      socket.off('user_status_changed', cb);
      socket.on('user_status_changed', cb);
    });
    this.bulkCallbacks.forEach(cb => {
      socket.off('online_status_bulk', cb);
      socket.on('online_status_bulk', cb);
    });
  }

  async requestBulkStatus(userIds: string[]): Promise<void> {
    const ids = Array.from(new Set(userIds.filter(Boolean)));
    if (ids.length === 0) return;
    try {
      await this.connection.emitEnsured('get_online_status', ids);
    } catch (err) {
      console.error('[Socket] requestBulkStatus failed:', err);
    }
  }

  onStatusChanged(callback: (data: UserStatusEvent) => void): void {
    this.statusCallbacks.add(callback);
    const socket = this.connection.getSocket();
    if (socket) {
      socket.off('user_status_changed', callback);
      socket.on('user_status_changed', callback);
    }
  }

  offStatusChanged(callback?: (data: UserStatusEvent) => void): void {
    const socket = this.connection.getSocket();
    if (callback) {
      this.statusCallbacks.delete(callback);
      socket?.off('user_status_changed', callback);
    } else {
      this.statusCallbacks.forEach(cb => socket?.off('user_status_changed', cb));
      this.statusCallbacks.clear();
    }
  }

  onBulkStatus(callback: (data: UserStatusEvent[]) => void): void {
    this.bulkCallbacks.add(callback);
    const socket = this.connection.getSocket();
    if (socket) {
      socket.off('online_status_bulk', callback);
      socket.on('online_status_bulk', callback);
    }
  }

  offBulkStatus(callback?: (data: UserStatusEvent[]) => void): void {
    const socket = this.connection.getSocket();
    if (callback) {
      this.bulkCallbacks.delete(callback);
      socket?.off('online_status_bulk', callback);
    } else {
      this.bulkCallbacks.forEach(cb => socket?.off('online_status_bulk', cb));
      this.bulkCallbacks.clear();
    }
  }

  clear(): void {
    this.statusCallbacks.clear();
    this.bulkCallbacks.clear();
  }
}