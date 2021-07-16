package com.surfinn.glzza.vo;

import java.util.List;

import lombok.Data;

@Data
public class Paging {
    Integer recordsTotal; // 필터링 전 전체 데이터 수
	Integer recordsFiltered; // 필터링 후 전체 데이터 수
	List<?> data;
	
	public Integer getRecordsFiltered() {		
		return recordsTotal;
	}
}
