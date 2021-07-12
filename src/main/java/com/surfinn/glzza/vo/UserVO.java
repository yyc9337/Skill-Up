package com.surfinn.glzza.vo;

import lombok.Data;

@Data
public class UserVO extends BaseVO {
	private String userSeq;
	private String loginId;
	private String pwd;
	private String userNm;
	private String regId;
	private String updId;
	private String regDt;
	private String updDt;
}
