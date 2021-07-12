package com.surfinn.glzza.vo;

import java.io.Serializable;

import lombok.Data;

@Data
public class SessionVO implements Serializable {
	private static final long serialVersionUID = -3503911390839839970L;
	
	private String userId;
	private String userNm;
		
}
