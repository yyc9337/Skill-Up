package com.surfinn.glzza.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class DataTableResponse {
    @JsonProperty
    private int draw;
    @JsonProperty
    private int recordsTotal;
    @JsonProperty
    private int recordsFiltered;
    @JsonProperty
    private String returnCode;
    @JsonProperty
    private String errorMsg;
    @JsonProperty
    private List data;

    public DataTableResponse(){}

    public DataTableResponse(List data, int recordsTotal, int recordsFiltered){
        this.data = data;
        this.recordsTotal = recordsTotal;
        this.recordsFiltered = recordsFiltered;
    }

}
