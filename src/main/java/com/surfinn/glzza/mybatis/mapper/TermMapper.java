package com.surfinn.glzza.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.surfinn.glzza.vo.BaseVO;
import com.surfinn.glzza.vo.TermVO;

@Mapper
public interface TermMapper {
    Integer selectTotalCountTerm(TermVO termVO); //레코드의 토탈카운트를 설정

    List<TermVO> selectTermList(TermVO termVO, BaseVO baseVO); //검색 - 카테고리와 페이징기능

    List<TermVO> selectSearchType();  //카테고리 타입 검색 후 리스트로 반환

    int insertTerm(TermVO termVO); //용어 생성

    int duplicateCheck(TermVO termVO); //유효성 검사

    TermVO searchTermBySeq(TermVO termVO);  //테이블에 있는 데이터를 더블클릭 하였을때 실행되는 매소드, seq를 기준으로 데이터를 불러옴

    int deleteTerm(TermVO termVO);  //용어 삭제, 삭제버튼 클릭시

    int updateTerm(TermVO termVO);  //용어 업데이트, 수정버튼 클릭시

    int recycleTerm(TermVO termVO); //입력된 데이터를 기준으로 재활용(기존에 삭제됐던 용어 부활), select 성공시 1 return

    TermVO recycleCheck(TermVO termVO); //입력된 데이터가 기존에 작성되고 삭제된 적이 있는지 확인
}
