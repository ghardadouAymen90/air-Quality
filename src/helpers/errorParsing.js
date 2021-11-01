
module.exports = (composedError) => {
    let { ...error } = composedError;
    switch (typeof error) {
        case 'object': return errorHandlingResult(error);
        case 'string':
            return { error_code: 500, error_message: error };
        case 'undefined':
        default:
            return { error_code: 500, error_message: 'Unknown Error' };
    }
};


function errorHandlingResult(error) {
    let result = {};

    typeof error.error_code === 'undefined' ? result.error_code = 500 : result.error_code = error.error_code;

    if (typeof error.message === 'undefined') {
        result.error_message = parseMessage(result.error_code);
    } else {
        error.error_code === 500 && error.message === "Error establishing a database connection" ?
            result.error_message = {
                code: 500,
                reason: "Internal Server Error",
                message: error.message + "."
            } :
            result.error_message = error.error_message;
    }

    result.error_message = { "status": "fail", data: { ...result.error_message } };
    return result;
}


function parseMessage(code) {
    switch (code) {
        case 20:
            return {
                code: 20,
                reason: "Invalid URL parameter value",
                message: "Invalid URL parameter value."
            };
        case 27:
            return {
                code: 27,
                reason: "Missing query-string parameter",
                message: "One or more query-string parameters are missing."
            };
        case 28:
            return {
                code: 28,
                reason: "Invalid query-string parameter value",
                message: "One or more query-string parameters contain invalid values."
            };
        case 60:
            return {
                code: 60,
                reason: "Resource not found",
                message: "The requested URI or the requested resource does not exist."
            };
        case 500:
            return {
                code: 500,
                reason: "Internal server",
                message: "Internal server error."
            };

        default:
            return 'Unknown Error';
    }
}


