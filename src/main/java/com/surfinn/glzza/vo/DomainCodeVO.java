package com.surfinn.glzza.vo;

import lombok.Data;

@Data
public class DomainCodeVO extends BaseVO {
	
	private String cdSeq;
	private String cdNm;
	private String cdDscrpt;
	private String summaryCdDscrpt;
	private String dbCd;
	private String dataLenYn;
	private String dcmlLenYn;
	private String keyword;
	private String searchType;
	private String useYn;
	private String regId;
	private String regDt;
	private String updId;
	private String updDt;
	private String columnName;
	private String columnComment;
	
	//////////////////sAjaxSource 로 가지고 오는 것들
	//////////////////해당 옵션들은 공식 문서에 있으니 확인 바람.
	private int iColumns;
	private int iSortingCols;
	private int iSortCol_0;
	private String sSortDir_0;
	private String[] columns;
	private String sorting;
	private String iDisplayStart;
	private String iDisplayLength;

}
