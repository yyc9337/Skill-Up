package com.surfinn.glzza.vo;

import java.util.List;

import lombok.Data;

@Data
public class DomainVO extends BaseVO{
	
	private String domainSeq;
	private String domainGrpNm;
	private String domainTypeNm;
	private String domainNm;
	private String domainDscrpt;
	private String summaryDomainDscrpt;
	private String dataType;
	private String dataTypeCd;
	private String dataLen;
	private String dcmlLen;
	private String saveType;
	private String exprsType;
	private String unit;
	private String validValue;
	private String useYn;
	private String regDt;
	private String regId;
	private String updDt;
	private String updId;
	private String columnName;
	private String columnComment;
	private String searchType;
	private String keyword;
	private String defaultValue;
	private String remark;
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
