package com.surfinn.glzza.exception;



/**
 * Top level exception for coupon system.
 *
 * @author Gwanggeun Yoo
 */
public class GlzzaRuntimeException extends RuntimeException
{
    private static final long serialVersionUID = 1225781951232953362L;

    public GlzzaRuntimeException()
    {
    }

    public GlzzaRuntimeException(String message)
    {
        super(message);
    }

    public GlzzaRuntimeException(Throwable cause)
    {
        super(cause);
    }

    public GlzzaRuntimeException(String message, Throwable cause)
    {
        super(message, cause);
    }

    public GlzzaRuntimeException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace)
    {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
