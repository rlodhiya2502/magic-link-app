export interface JwtPayload {
    email: string;
    iat?: number; // Issued at
    exp?: number; // Expiration time
}