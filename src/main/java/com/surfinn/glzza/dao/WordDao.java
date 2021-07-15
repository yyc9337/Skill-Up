package com.surfinn.glzza.dao;

import com.surfinn.glzza.mybatis.mapper.WordMapper;
import com.surfinn.glzza.vo.DomainVO;
import com.surfinn.glzza.vo.Paging;
import com.surfinn.glzza.vo.WordVO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class WordDao {
    @Autowired
    private WordMapper wordMapper;
    
    public Integer selectTotalCountWord(WordVO wordVO) {
    	  return wordMapper.selectTotalCountWord(wordVO);
    }

    public List<WordVO> selectWordList(WordVO wordVO, Paging paging) {
        return wordMapper.selectWordList(wordVO, paging); //wordMappr에 요청
    }

    public int selectWordListCount(WordVO wordVO){
        return wordMapper.selectWordListCount(wordVO); //wordMappr에 요청
    }

    public List<WordVO> searchType(){
        return wordMapper.searchType(); //wordMappr에 요청
    }

    public int insertWord(WordVO wordVO){
        return wordMapper.insertWord(wordVO); //wordMappr에 요청
    }

    public int deleteWord(WordVO wordVO){
        return wordMapper.deleteWord(wordVO); //wordMappr에 요청
    }
    public int updateWord(WordVO wordVO){
        return wordMapper.updateWord(wordVO); //wordMappr에 요청
    }

    public WordVO selectWord(WordVO wordVO){
        return wordMapper.selectWord(wordVO); //wordMappr에 요청
    }

    // 단어 중복 체크
    public int duplicationNameCheck(WordVO wordVO) {
        return wordMapper.duplicationNameCheck(wordVO); //wordMappr에 요청
    }
    public int duplicationEngShortNameCheck(WordVO wordVO) {
        return wordMapper.duplicationEngShortNameCheck(wordVO); //wordMappr에 요청
    }
    public int duplicationEngNameCheck(WordVO wordVO) {
        return wordMapper.duplicationEngNameCheck(wordVO); //wordMappr에 요청
    }
    public int duplicationCheck(WordVO wordVO){
        return wordMapper.duplicationSynmListCheck(wordVO); //wordMappr에 요청
    }
    
	/* [하늘] 단어 입력 프로세스 */
    
    // 단어명 및 단어영문명 중복 체크
    public List<WordVO> nameDuplicationCheck(WordVO wordVO) {
        return wordMapper.selectWordDuplicationList(wordVO); //wordMappr에 요청
    }
    // 단어영문약어명 중복 체크
    public List<WordVO> abbrDuplicationCheck(WordVO wordVO) {
        return wordMapper.selectAbbrDuplicationList(wordVO); //wordMappr에 요청
    }
    
}
