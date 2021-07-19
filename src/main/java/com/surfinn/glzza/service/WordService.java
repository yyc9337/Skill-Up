package com.surfinn.glzza.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surfinn.glzza.core.CommonConst;
import com.surfinn.glzza.dao.WordDao;
import com.surfinn.glzza.utility.CommonUtil;
import com.surfinn.glzza.vo.BaseVO;
import com.surfinn.glzza.vo.WordVO;

import io.micrometer.core.instrument.util.StringUtils;

@Service
public class WordService {
    @Autowired
    private WordDao wordDao;

    // 단어 리스트
    public BaseVO selectWordList(WordVO wordVO, BaseVO base){
        if (wordVO.getColumns() != null){
            wordVO.setSorting(wordVO.getColumns()[wordVO.getISortCol_0()]);
        }

    	base.setRecordsTotal(wordDao.selectTotalCountWord(wordVO));	
        List<WordVO> list = wordDao.selectWordList(wordVO, base); // 리스트 생성
        
        
        if(list.size() > 0) {
        	for(int i = 0; i < list.size(); i++) {
        		if(!StringUtils.isEmpty(list.get(i).getWordDscrpt())) {
        			list.get(i).setSummaryWordDscrpt(list.get(i).getWordDscrpt().replace("<br>", "  "));
        		}
        	}
        }

        base.setRecordsFiltered(list.size());
        base.setData(list);
		return base;
    }

    // 단어 리스트 카운트
    public int selectWordListCount(WordVO wordVO) {
        return wordDao.selectWordListCount(wordVO);
    }

    // 단어 타입 검색
    public List<WordVO> searchType() {
        return wordDao.searchType();
    }

    // 단어 등록
    public int insertWord(WordVO wordVO) {
        wordVO.setRegId(CommonConst.REG_ID);
        wordVO.setUpdId(CommonConst.UPD_ID);
        if(!CommonUtil.isEmpty(wordVO.getWordDscrpt())) {
        	wordVO.setWordDscrpt(wordVO.getWordDscrpt().trim().replace("\r\n","<br>"));
        }

        if (wordVO.getSynmList() == null){
            wordVO.setSynmList("");
        }

        return wordDao.insertWord(wordVO); //Dao에 요청
    }

    // 단어 삭제
    public int deleteWord(WordVO wordVO) {
        wordVO.setUpdId(CommonConst.UPD_ID);
        return wordDao.deleteWord(wordVO); //Dao에 요청(wordVO반환)
    }
    
    public int updateWord(WordVO wordVO){
        wordVO.setUpdId(CommonConst.UPD_ID);
        return wordDao.updateWord(wordVO);//Dao에 요청(wordVO반환)
    }
    
    public int revivalWord(WordVO wordVO){
        wordVO.setUpdId(CommonConst.UPD_ID);
        return wordDao.revivalWord(wordVO);
    }
    
    public WordVO selectWord(WordVO wordVO){
        return wordDao.selectWord(wordVO); //Dao에 요청(wordVO반환)
    }

    
    // [하늘] 단어명 및 단어영문명 및 이음동의어 중복조회
    public List<WordVO> nameDuplicationCheck(WordVO wordVO){
        List<WordVO> list = wordDao.nameDuplicationCheck(wordVO); // 리스트 생성(Dao에 요청)
        
        if(list.size() > 0) {
        	for(int i = 0; i < list.size(); i++) {
        		if(!StringUtils.isEmpty(list.get(i).getWordDscrpt())) {
        			list.get(i).setSummaryWordDscrpt(list.get(i).getWordDscrpt().replace("<br>", "  "));
        		}
        	}
        }

        return list;
    }
    
   
}
