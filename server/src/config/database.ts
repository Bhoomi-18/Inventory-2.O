import mongoose, { Connection } from 'mongoose';
import dotenv from 'dotenv';
import { ConnectionMap } from '../types';

dotenv.config();

class DatabaseManager {
  private connections: ConnectionMap = new Map();
  private mainConnection: Connection | null = null;
  private readonly baseUri: string;

  constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in environment variables");
    }
    this.baseUri = process.env.MONGODB_URI;
  }

  async getCompanyConnection(companyName: string): Promise<Connection> {
    const dbName = this.sanitizeDbName(companyName);
    
    const existing = this.connections.get(dbName);
    if (existing) {
      return existing;
    }

    try {
      const connectionUri = `${this.baseUri}/${dbName}?retryWrites=true&w=majority&appName=Inventory`;
      const connection = await mongoose.createConnection(connectionUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log(`Connected to database: ${dbName}`);
      this.connections.set(dbName, connection);
      return connection;
    } catch (error) {
      console.error(`Error connecting to database ${dbName}:`, error);
      throw new Error('Database connection failed');
    }
  }

  async getMainConnection(): Promise<Connection> {
    if (this.mainConnection && this.mainConnection.readyState === 1) {
      return this.mainConnection;
    }

    try {
      const connectionUri = `${this.baseUri}/empcare_main`;
      this.mainConnection = await mongoose.createConnection(connectionUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log('Connected to main database: empcare_main');
      return this.mainConnection;
    } catch (error) {
      console.error('Error connecting to main database:', error);
      throw new Error('Main database connection failed');
    }
  }

  sanitizeDbName(companyName: string): string {
    return companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 64) + '_empcare';
  }

  async closeConnection(companyName: string): Promise<void> {
    const dbName = this.sanitizeDbName(companyName);
    const connection = this.connections.get(dbName);
    
    if (connection) {
      await connection.close();
      this.connections.delete(dbName);
      console.log(`Closed database connection: ${dbName}`);
    }
  }

  async closeAllConnections(): Promise<void> {
    const closePromises: Promise<void>[] = [];

    for (const [dbName, connection] of this.connections) {
      closePromises.push(
        connection.close().then(() => {
          console.log(`Closed database connection: ${dbName}`);
        })
      );
    }
    
    if (this.mainConnection) {
      closePromises.push(
        this.mainConnection.close().then(() => {
          console.log('Closed main database connection');
        })
      );
    }
    
    await Promise.all(closePromises);
    this.connections.clear();
    this.mainConnection = null;
  }

  async checkHealth(): Promise<{ main: boolean; companies: string[] }> {
    const health = {
      main: false,
      companies: [] as string[]
    };

    try {
      if (this.mainConnection && this.mainConnection.readyState === 1) {
        health.main = true;
      }

      for (const [dbName, connection] of this.connections) {
        if (connection.readyState === 1) {
          health.companies.push(dbName);
        }
      }
    } catch (error) {
      console.error('Health check error:', error);
    }

    return health;
  }
}

const dbManager = new DatabaseManager();
export default dbManager;