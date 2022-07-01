import {CustomError} from "ts-custom-error"

class InnerError extends CustomError {
	constructor(message?: string) {
		super(message)
		this.message = "[marga]" + message
	}
}
export default InnerError
