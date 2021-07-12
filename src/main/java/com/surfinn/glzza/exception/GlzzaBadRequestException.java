package com.surfinn.glzza.exception;


import org.springframework.http.HttpStatus;

/**
 * @author Gwanggeun Yoo
 */
public class GlzzaBadRequestException extends GlzzaHttpException
{
    private static final long serialVersionUID = -2235869320525832134L;

    public GlzzaBadRequestException()
    {
        super(HttpStatus.BAD_REQUEST);
    }

    public GlzzaBadRequestException(String message)
    {
        super(HttpStatus.BAD_REQUEST, message);
    }

    public GlzzaBadRequestException(Throwable cause)
    {
        super(HttpStatus.BAD_REQUEST, cause);
    }

    public GlzzaBadRequestException(String message, Throwable cause)
    {
        super(HttpStatus.BAD_REQUEST, message, cause);
    }
}
