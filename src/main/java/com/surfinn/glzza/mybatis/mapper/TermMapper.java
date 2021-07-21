package com.surfinn.glzza.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.surfinn.glzza.vo.BaseVO;
import com.surfinn.glzza.vo.Paging;
import com.surfinn.glzza.vo.TermVO;

@Mapper
public interface TermMapper {
    Integer selectTotalCountTerm(TermVO termVO);

    List<TermVO> selectTermList(TermVO termVO, BaseVO baseVO);

    List<TermVO> selectSearchType();

    int insertTerm(TermVO termVO);

    int duplicateCheck(TermVO termVO);

    TermVO searchTermBySeq(TermVO termVO);

    int deleteTerm(TermVO termVO);

    int updateTerm(TermVO termVO);
    
    int revivalTerm(TermVO termVO);

    int recycleTerm(TermVO termVO);

    TermVO recycleCheck(TermVO termVO);
}
