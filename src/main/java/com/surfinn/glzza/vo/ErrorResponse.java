package com.surfinn.glzza.vo;

import lombok.Data;

@Data
public class ErrorResponse {
    private String returnCode = "F";
    private String errorCode;
    private String errorMessage;
}
