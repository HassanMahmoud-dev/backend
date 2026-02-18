import { testOracleConnection } from "@/config/database";

export class HealthService {
  private getTimestamp() {
    return new Date().toISOString();
  }

  public getSystemStatus() {
    return {
      service: "backend",
      status: "online",
      timestamp: this.getTimestamp(),
    };
  }

  public async getDatabaseStatus() {
    try {
      const isConnected = await testOracleConnection();

      return {
        ok: isConnected,
        database: "oracle",
        timestamp: this.getTimestamp(),
        ...(isConnected ? {} : { message: "Database connection failed" }),
      };
    } catch (error) {
      console.error("Health Check DB Error:", error);
      return {
        ok: false,
        database: "oracle",
        timestamp: this.getTimestamp(),
        message: "Database connection failed",
      };
    }
  }
}
