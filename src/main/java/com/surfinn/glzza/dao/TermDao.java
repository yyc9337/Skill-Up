package com.surfinn.glzza.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.surfinn.glzza.mybatis.mapper.TermMapper;
import com.surfinn.glzza.vo.BaseVO;
import com.surfinn.glzza.vo.Paging;
import com.surfinn.glzza.vo.TermVO;

@Repository("termDao")
public class TermDao {

    @Autowired
    TermMapper termMapper;
   //레코드의 토탈카운트를 설정
   public Integer selectTotalCountTerm(TermVO termVO) {
	   return termMapper.selectTotalCountTerm(termVO);
   }
    //검색 - 카테고리와 페이징기능
    public List<TermVO> selectTermList(TermVO termVO, BaseVO baseVO){
        return termMapper.selectTermList(termVO, baseVO);
    }
    //카테고리 타입 검색 후 리스트로 반환
    public List<TermVO> selectSearchType(){
        return termMapper.selectSearchType();
    }

    //용어 생성
    public int insertTerm(TermVO termVO){
        return termMapper.insertTerm(termVO);
    }

    //유효성 검사
    public int duplicateCheck(TermVO termVO){
        return termMapper.duplicateCheck(termVO);
    }

    //테이블에 있는 데이터를 더블클릭 하였을때 실행되는 매소드, seq를 기준으로 데이터를 불러옴
    public TermVO searchTermBySeq(TermVO termVO){
        return termMapper.searchTermBySeq(termVO);
    }

    //용어 삭제, 삭제버튼 클릭시
    public int deleteTerm(TermVO termVO){
        return termMapper.deleteTerm(termVO);
    }

    //용어 업데이트, 수정버튼 클릭시
    public int updateTerm(TermVO termVO) { return termMapper.updateTerm(termVO);}

    //입력된 데이터를 기준으로 재활용(기존에 삭제됐던 용어 부활), select 성공시 1 return
    public int recycleTerm(TermVO termVO) { return termMapper.recycleTerm(termVO);}

    //입력된 데이터가 기존에 작성되고 삭제된 적이 있는지 확인
    public TermVO recycleCheck(TermVO termVO) { return termMapper.recycleCheck(termVO);}
}
