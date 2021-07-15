package com.surfinn.glzza.vo;

import lombok.Data;

@Data
public class TermVO {
    private int termSeq;
    private int domainSeq;
    private String termNm;
    private String termDscrpt;
    private String synmList;
    private String tag;
    private String summaryTermDscrpt;
    private String termAbbr;
    private String domainNm;
    private String regDt;
    private String regId;
    private String updDt;
    private String updId;
    private String useYn;
    private String columnName;
    private String columnComment;
    private String searchType;
    private String keyword;
}
