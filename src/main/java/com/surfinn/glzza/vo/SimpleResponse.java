package com.surfinn.glzza.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.commons.lang3.StringUtils;

/**
 * 간단하게 쓸만한 response.
 */
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class SimpleResponse
{
    private String returnCode;
    @JsonInclude(Include.NON_NULL)
    private String resultCode;
    @JsonInclude(Include.NON_NULL)
    private String errorCode;
    @JsonInclude(Include.NON_NULL)
    private String errorMessage;
    @JsonInclude(Include.NON_NULL)
    private JsonNode data;

    public SimpleResponse()
    {
    }

    public SimpleResponse(String returnCode)
    {
        this.returnCode = returnCode;
    }

    public String getReturnCode()
    {
        return returnCode;
    }

    public void setReturnCode(String returnCode)
    {
        this.returnCode = returnCode;
    }

    public String getResultCode()
    {
        return resultCode;
    }

    public void setResultCode(String resultCode)
    {
        this.resultCode = resultCode;
    }

    public String getErrorCode()
    {
        return errorCode;
    }

    public void setErrorCode(String errorCode)
    {
        this.errorCode = errorCode;
    }

    public String getErrorMessage()
    {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage)
    {
        this.errorMessage = errorMessage;
    }

    public JsonNode getData()
    {
        return data;
    }

    public void setData(JsonNode data)
    {
        this.data = data;
    }

    @JsonIgnore
    public boolean isSuccess()
    {
        return StringUtils.equalsIgnoreCase("S", returnCode) || StringUtils
            .equalsIgnoreCase("S", resultCode);
    }
}
