import type { Response, Request, NextFunction } from 'express';
export declare const logger: (req: Request, res: Response, next: NextFunction) => void;
export declare const colors: {
    reset: string;
    red: string;
    yellow: string;
    green: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
};
