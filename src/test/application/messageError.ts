

const messageError = (error: string, timeout?: number, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log({
        error,
        timestamp,
        timeout,
        data,
    });
    throw error;
};

export { messageError };