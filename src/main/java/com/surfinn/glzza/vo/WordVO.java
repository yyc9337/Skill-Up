package com.surfinn.glzza.vo;

import lombok.Data;

@Data
public class WordVO extends BaseVO{
    private int wordSeq;
    private String wordNm;
    private String wordAbbr; //wordEngShortNm
    private String wordEngNm;
    private String wordDscrpt;
    private String summaryWordDscrpt;   // 설명이 길 때, 짧게 보여주는 설명
    private String synmList;        // 이음동의어
    private String banList;
    private String regDt;
    private String regId;
    private String updDt;
    private String updId;

    private String useYN;

    private String columnName;
    private String columnComment;
    private String searchType;
    private String keyword;
    
    // 단어 중복조회 시 flag 컬럼들
    private String fatalExist;
    private String abbrExist;
    
    private String tag;

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
