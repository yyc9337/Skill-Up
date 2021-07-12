package com.surfinn.glzza.vo;

import java.util.List;

import lombok.Data;

@Data
public class Paging {
	Integer draw;// Cross Site Scripting 공격을 방지하기 위한 파라미터	
    Integer recordsTotal; // 필터링 전 전체 데이터 수
	Integer recordsFiltered; // 필터링 후 전체 데이터 수
	Integer start; //현재 페이지 첫번째 데이터 값
	Integer length; //현재 페이지에 그려질 데이터 수 설정
	List<?> data;
	
	public Integer getRecordsFiltered() {		
		return recordsTotal;
	}
}
