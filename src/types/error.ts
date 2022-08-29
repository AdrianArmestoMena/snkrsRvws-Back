interface CustomError extends Error {
  statusCode: number;
  publicMessage?: string;
  privateMessage?: string;
}

export default CustomError;
