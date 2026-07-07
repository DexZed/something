import {
    ReasonPhrases,
    StatusCodes,
} from 'http-status-codes';

export class HttpException extends Error {
    public status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class BadRequestException extends HttpException {
    constructor(
        message = ReasonPhrases.BAD_REQUEST,
        public details?: any,
    ) {
        super(StatusCodes.BAD_REQUEST, message);
    }
}

export class NotFoundException extends HttpException {
    constructor(message = ReasonPhrases.NOT_FOUND) {
        super(StatusCodes.NOT_FOUND, message);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message = ReasonPhrases.UNAUTHORIZED) {
        super(StatusCodes.UNAUTHORIZED, message);
    }
}

export class ForbiddenException extends HttpException {
    constructor(message = ReasonPhrases.FORBIDDEN) {
        super(StatusCodes.FORBIDDEN, message);
    }
}

export class PaymentRequired extends HttpException {
    constructor(message = ReasonPhrases.PAYMENT_REQUIRED) {
        super(StatusCodes.PAYMENT_REQUIRED, message)
    }
}

export class Teapot extends HttpException {
    constructor(message = ReasonPhrases.IM_A_TEAPOT) {
        super(StatusCodes.IM_A_TEAPOT, message)
    }
}