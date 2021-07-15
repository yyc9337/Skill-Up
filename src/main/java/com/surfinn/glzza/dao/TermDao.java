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
    
   public Integer selectTotalCountTerm(TermVO termVO) {
	   return termMapper.selectTotalCountTerm(termVO);
   }

    public List<TermVO> selectTermList(TermVO termVO, BaseVO baseVO){
        return termMapper.selectTermList(termVO, baseVO);
    }

    public List<TermVO> selectSearchType(){
        return termMapper.selectSearchType();
    }

    public int insertTerm(TermVO termVO){
        return termMapper.insertTerm(termVO);
    }

    public int duplicateCheck(TermVO termVO){
        return termMapper.duplicateCheck(termVO);
    }

    public TermVO searchTermBySeq(TermVO termVO){
        return termMapper.searchTermBySeq(termVO);
    }

    public int deleteTerm(TermVO termVO){
        return termMapper.deleteTerm(termVO);
    }

    public int updateTerm(TermVO termVO) { return termMapper.updateTerm(termVO);}

    public int recycleTerm(TermVO termVO) { return termMapper.recycleTerm(termVO);}

    public TermVO recycleCheck(TermVO termVO) { return termMapper.recycleCheck(termVO);}
}
