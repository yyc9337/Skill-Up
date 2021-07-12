package com.surfinn.glzza.config;

import com.surfinn.glzza.exception.GlzzaBadRequestException;
import com.surfinn.glzza.exception.GlzzaRuntimeException;
import com.surfinn.glzza.vo.ErrorResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(GlzzaBadRequestException.class)
    public ResponseEntity<ErrorResponse> badRequestExceptionHandler(HttpServletRequest req, HttpServletResponse res, Exception ex)
    {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setErrorCode(Integer.toString(HttpStatus.BAD_REQUEST.value()));
        errorResponse.setErrorMessage(ex.getMessage());

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(GlzzaRuntimeException.class)
    public ResponseEntity<ErrorResponse> runtimeExceptionHandler(HttpServletRequest req, HttpServletResponse res, Exception ex){
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setErrorCode(Integer.toString(HttpStatus.INTERNAL_SERVER_ERROR.value()));
        errorResponse.setErrorMessage(ex.getMessage());

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
