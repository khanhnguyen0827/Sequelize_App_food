import { statusCodes } from "./status-code.helper";

// export class BadrequestException extends Error {}
export class BadrequestException extends Error {
   constructor(message = "Bad request") {
      super(message);//new Error(message);
      this.code = statusCodes.BAD_REQUEST;
   }
}
