package com.surfinn.glzza.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CommonResponse {
    private String returnCode;
    @JsonInclude(Include.NON_NULL)
    private String resultCode;
    @JsonInclude(Include.NON_NULL)
    private String errorCode;
    @JsonInclude(Include.NON_NULL)
    private String errorMessage;

    @JsonIgnore
    public boolean isSuccess()
    {
        return StringUtils.equalsIgnoreCase("S", returnCode) || StringUtils
                .equalsIgnoreCase("S", resultCode);
    }
}
