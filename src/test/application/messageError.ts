import { logger } from "../../logger";


const messageError = (error: string, timeout?: number, data?: any) => {
    const timestamp = new Date().toISOString();
    logger.error(error, { timestamp, timeout, data });
    throw error;
};

export { messageError };