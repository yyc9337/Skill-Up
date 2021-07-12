package com.surfinn.glzza.utility;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

public class SuccessResponse<T> {

    private static final String returnCode = "S";
    @JsonInclude(Include.NON_NULL)
	private PaginationResponse pagination;
    private T data;

    public SuccessResponse()
    {
    }

    public SuccessResponse(T data)
    {
        if (data != null)
        {
            this.data = data;
        } else
        {
            this.data = null;
        }
    }

    public SuccessResponse(T data, PaginationResponse pagination)
    {
//        this.data = new Data<>(data, pagination);
    	this.data = data;
    	this.pagination = pagination;
    }

    public String getReturnCode()
    {
        return returnCode;
    }

    public T getData()
    {
        return data;
    }

    public void setData(T data)
    {
        this.data = data;
    }

	public PaginationResponse getPagination()
	{
		return pagination;
	}
	
	public void setPagination(PaginationResponse pagination)
	{
		this.pagination = pagination;
	}
}
