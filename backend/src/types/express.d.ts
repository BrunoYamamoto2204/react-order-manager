declare namespace Express {
export interface Request {
        user?: {
            userId: string;
            username: string;
            role: string;
        };
        // REMOVA: testProperty: string;
    }
}

export {}