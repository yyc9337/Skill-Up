package com.surfinn.glzza.dao;

import com.surfinn.glzza.mybatis.mapper.WordMapper;
import com.surfinn.glzza.vo.BaseVO;

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

    public List<WordVO> selectWordList(WordVO wordVO, BaseVO base) {
        return wordMapper.selectWordList(wordVO, base);
    }

    public int selectWordListCount(WordVO wordVO){
        return wordMapper.selectWordListCount(wordVO);
    }

    public List<WordVO> searchType(){
        return wordMapper.searchType();
    }

    public int insertWord(WordVO wordVO){
        return wordMapper.insertWord(wordVO);
    }

    public int deleteWord(WordVO wordVO){
        return wordMapper.deleteWord(wordVO);
    }
    public int updateWord(WordVO wordVO){
        return wordMapper.updateWord(wordVO);
    }

    public WordVO selectWord(WordVO wordVO){
        return wordMapper.selectWord(wordVO);
    }  
	/* [하늘] 단어 입력 프로세스 */
    
    // 단어명 및 단어영문명 및 이음동의어 중복 체크
    public List<WordVO> nameDuplicationCheck(WordVO wordVO) {
        return wordMapper.selectWordDuplicationList(wordVO);
    }    
}
