package com.surfinn.glzza.exception;

import org.springframework.http.HttpStatus;


/**
 * Base Exception for Http Response.
 *
 * @author Gwanggeun Yoo
 */
public class GlzzaHttpException extends GlzzaRuntimeException
{
    private static final long serialVersionUID = -6456996071029279866L;

    private final HttpStatus statusCode;
    private String errorCode;
    private String title;
    private final String message;
//    private String tiMessage;
//    private String enMessage;
//    private final String[] details;


    public GlzzaHttpException(HttpStatus statusCode)
    {
        this(statusCode, statusCode.getReasonPhrase());
    }

    public GlzzaHttpException(HttpStatus statusCode, String errorCode, String message, Throwable cause)
    {
    	super(message, cause);
        
        this.statusCode = statusCode;
        this.message = message;
//        this.details = details != null ? CommonUtils.toArray(details, String.class) : null;
        this.errorCode = errorCode;
    }
    
//    public AdminHttpException(HttpStatus statusCode, String errorCode, MessageProvider mp, String... keyParams)
//    {
//        this(statusCode, errorCode, mp.getMessage(errorCode, keyParams), null, null);
//        //this.tiMessage = mp.getMessageWithKeyParams(errorCode, AdminConstants.THAI_LOCALE, keyParams);
//        //this.enMessage = mp.getMessageWithKeyParams(errorCode, Locale.ENGLISH, keyParams);
//    }

    public GlzzaHttpException(HttpStatus statusCode, String message)
    {
        this(statusCode, null, message, null);
    }

    public GlzzaHttpException(HttpStatus statusCode, String errorCode, String message)
    {
        this(statusCode, errorCode, message, null);
    }

    public GlzzaHttpException(HttpStatus statusCode, Throwable cause)
    {
        this(statusCode, null, null, cause);
    }

    public GlzzaHttpException(HttpStatus statusCode, String message, Throwable cause)
    {
        this(statusCode, null, message, cause);
    }

    public String getErrorCode()
    {
        return errorCode;
    }

    public void setErrorCode(String errorCode)
    {
        this.errorCode = errorCode;
    }

    public HttpStatus getStatusCode()
    {
        return statusCode;
    }

    public String getMessage()
    {
        return message;
    }

//    public String getTiMessage()
//    {
//        return tiMessage;
//    }
//
//    public String getEnMessage()
//    {
//        return enMessage;
//    }

//    public String[] getDetails()
//    {
//        return details;
//    }

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }
}
