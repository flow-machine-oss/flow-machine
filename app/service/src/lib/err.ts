import { isString } from "es-toolkit";

const errDetails = {
  unknown: {
    message: "Internal server error",
    status: 500,
  },
  unauthorized: {
    message: "Unauthorized",
    status: 401,
  },
  forbidden: {
    message: "Forbidden",
    status: 403,
  },
  notFound: {
    message: "Resource not found",
    status: 404,
  },
  conflict: {
    message: "Resource conflict",
    status: 409,
  },
  badRequest: {
    message: "Bad request",
    status: 400,
  },
  selfVote: {
    message: "Cannot vote on own prompt",
    status: 400,
  },
  promptArchived: {
    message: "Action not allowed on archived prompt",
    status: 400,
  },
} as const satisfies Record<string, { status: number; message: string }>;

type ErrDetails = typeof errDetails;
type ErrCode = keyof ErrDetails;

export class Err extends Error {
  code: ErrCode;

  private constructor(code: ErrCode, message: string, cause: unknown) {
    super(message, { cause });
    this.code = code;
  }

  static code(
    code: ErrCode,
    options: { cause?: unknown; message?: string } = {},
  ) {
    return Err.from(code, options);
  }

  static from(
    error: unknown,
    options: { cause?: unknown; message?: string } = {},
  ) {
    if (isString(error) && Object.hasOwn(errDetails, error)) {
      const code = error as ErrCode;
      const details = errDetails[code];

      return new Err(code, options.message ?? details.message, options.cause);
    }

    if (error instanceof Err) {
      return error;
    }

    const fallbackCode = "unknown" as const;
    const details = errDetails[fallbackCode];
    return new Err(
      fallbackCode,
      options.message ?? details.message,
      options.cause,
    );
  }

  get status() {
    return errDetails[this.code].status;
  }
}
