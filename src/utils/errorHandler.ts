interface ErrorResponse {
    status: number;
    message: ERROR_MESSAGE;
}
export enum ERROR_MESSAGE {
    ShortUrlNotFound = 'Short URL not found',
    UrlExpired = 'URL has expired',
    InvalidUrl = 'Invalid URL',
    ServerError = 'Server error'
}

const errorMap: Record<ERROR_MESSAGE, ErrorResponse> = {
    [ERROR_MESSAGE.ShortUrlNotFound]: { status: 404, message: ERROR_MESSAGE.ShortUrlNotFound },
    [ERROR_MESSAGE.UrlExpired]: { status: 410, message: ERROR_MESSAGE.UrlExpired },
    [ERROR_MESSAGE.InvalidUrl]: { status: 400, message: ERROR_MESSAGE.InvalidUrl },
    [ERROR_MESSAGE.ServerError]: { status: 500, message: ERROR_MESSAGE.ServerError }
};



export const handleError = (err: Error) => {
    const error = errorMap[err.message as ERROR_MESSAGE];

    if (error) {
        return error;
    }

    return { status: 500, message: ERROR_MESSAGE.ServerError };
};

