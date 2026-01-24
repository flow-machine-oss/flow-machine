export const errDetails = {
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

  pgIntegrityConstraintViolation: {
    message: "Database integrity constraint violation",
    status: 409,
  },
  pgRestrictViolation: {
    message: "Database restrict violation",
    status: 409,
  },
  pgNotNullViolation: {
    message: "Required field cannot be null",
    status: 400,
  },
  pgForeignKeyViolation: {
    message: "Referenced record does not exist",
    status: 409,
  },
  pgUniqueViolation: {
    message: "Record with this value already exists",
    status: 409,
  },
  pgCheckViolation: {
    message: "Value does not meet validation requirements",
    status: 400,
  },
  pgExclusionViolation: {
    message: "Exclusion constraint violation",
    status: 409,
  },
  pgUnknown: {
    message: "Unknown database error",
    status: 500,
  },
} as const satisfies Record<string, { status: number; message: string }>;

export type ErrDetails = typeof errDetails;
export type ErrCode = keyof ErrDetails;

export const pgCodeToErrCode: Record<string, ErrCode> = {
  "23000": "pgIntegrityConstraintViolation",
  "23001": "pgRestrictViolation",
  "23502": "pgNotNullViolation",
  "23503": "pgForeignKeyViolation",
  "23505": "pgUniqueViolation",
  "23514": "pgCheckViolation",
  "23P01": "pgExclusionViolation",
} as const;
