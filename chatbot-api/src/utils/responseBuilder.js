function successResponse(data, statusCode = 200) {
    return {
      statusCode,
      success: true,
      message: "OK",
      data,
    };
  }
  
  function badRequestResponse(data, statusCode = 400) {
    if (statusCode == 404) {
      return {
        statusCode,
        success: false,
        message: "Not Found",
        details: data,
      };
    } else
      return {
        statusCode,
        success: false,
        message: "Bad Request",
        details: data,
      };
  }
  
  module.exports = {
    successResponse,
    badRequestResponse,
  };
  