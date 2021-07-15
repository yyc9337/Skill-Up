package com.surfinn.glzza.mybatis.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.surfinn.glzza.vo.BaseVO;
import com.surfinn.glzza.vo.WordVO;

import java.util.List;

@Mapper
public interface WordMapper {
	
	Integer selectTotalCountWord(WordVO wordVO);
	
    List<WordVO> selectWordList(WordVO wordVO, BaseVO base);

    int selectWordListCount(WordVO wordVO);

    // 검색 타입
    List<WordVO> searchType();

    // 단어 추가
    int insertWord(WordVO wordVO);

    // 단어 삭제
    int deleteWord(WordVO wordVO);
    
    // 단어 업데이트
    int updateWord(WordVO wordVO);

    // 상세보기 찾기
    WordVO selectWord(WordVO wordVO);
	/* [하늘] 단어 등록 프로세스 */
    // 단어명 및 단어영문명 및 이음동의어 중복체크
    List<WordVO> selectWordDuplicationList(WordVO wordVO);


}
