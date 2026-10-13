export declare function signJwt(payload: any): string;
export declare function verifyJwt(token: string): any | null;
export interface DeviceSession {
    token: string;
    sessionId: string;
    deviceId: string;
    deviceName: string;
    ipAddress: string;
    userAgent: string;
    createdAt: string;
    lastActiveAt: string;
}
export declare function resolveUserAccessibleOrgIds(userId?: string, userOrgId?: string, roleId?: string): Promise<string[]>;
