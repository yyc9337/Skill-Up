package com.surfinn.glzza.vo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class BaseVO {

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	protected Integer totalCount = 0;
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	protected Integer listCount = 100;
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	protected Integer pageCount = 10;
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	protected Integer startIdx = 0;
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	protected Integer endIdx = 0;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	protected Integer currentPage = 1;
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	protected Integer pageElementCount = 1;
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	protected String searchText;
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	protected String startDate;
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	protected String endDate;
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	protected String selectOption = "false";
	
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	protected Integer limitStart;
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	protected Integer limit;

	private int iColumns;
	private int iSortingCols;
	private int iSortCol_0;
	private String sSortDir_0;
	private String[] columns;
	private String sorting;
	private String iDisplayStart;
	private String iDisplayLength;
    Integer recordsTotal; // 필터링 전 전체 데이터 수
	Integer recordsFiltered; // 필터링 후 전체 데이터 수
	List<?> data;
	
	public Integer getRecordsFiltered() {		
		return recordsTotal;
	}
	}
