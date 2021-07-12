package com.surfinn.glzza.mybatis.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.surfinn.glzza.vo.DomainVO;
import com.surfinn.glzza.vo.Paging;
import com.surfinn.glzza.vo.WordVO;

import java.util.List;

@Mapper
public interface WordMapper {
	
	Integer selectTotalCountWord(WordVO wordVO);
	
    List<WordVO> selectWordList(WordVO wordVO, Paging paging);

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

    // 중복체크
    int duplicationNameCheck(WordVO wordVO);            // 단어명
    int duplicationEngShortNameCheck(WordVO wordVO);    // 단어 영문 약어명
    int duplicationEngNameCheck(WordVO wordVO);         // 단어 영문명
    int duplicationSynmListCheck(WordVO wordVO);    // 이음동의어

    
	/* [하늘] 단어 등록 프로세스 */
    // 단어명 및 단어영문명 중복체크
    List<WordVO> selectWordDuplicationList(WordVO wordVO);
    // 단어영문약어명 중복체크
    List<WordVO> selectAbbrDuplicationList(WordVO wordVO);
    

}
