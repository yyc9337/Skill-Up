package com.surfinn.glzza.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surfinn.glzza.core.CommonConst;
import com.surfinn.glzza.dao.WordDao;
import com.surfinn.glzza.utility.CommonUtil;
import com.surfinn.glzza.vo.Paging;
import com.surfinn.glzza.vo.WordVO;

import io.micrometer.core.instrument.util.StringUtils;

@Service
public class WordService {
    @Autowired
    private WordDao wordDao;

    // 단어 리스트
    public Paging selectWordList(WordVO wordVO, Paging paging){
        if (wordVO.getColumns() != null){
            wordVO.setSorting(wordVO.getColumns()[wordVO.getISortCol_0()]);
        }

    	paging.setRecordsTotal(wordDao.selectTotalCountWord(wordVO));	
        List<WordVO> list = wordDao.selectWordList(wordVO, paging); // 리스트 생성
        
        
        if(list.size() > 0) {
        	for(int i = 0; i < list.size(); i++) {
        		if(!StringUtils.isEmpty(list.get(i).getWordDscrpt())) {
        			list.get(i).setSummaryWordDscrpt(list.get(i).getWordDscrpt().replace("<br>", "  "));
        		}
        	}
        }

        paging.setRecordsFiltered(list.size());
		paging.setData(list);
		return paging;
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

        return wordDao.insertWord(wordVO);
    }

    // 단어 삭제
    public int deleteWord(WordVO wordVO) {
        wordVO.setUpdId(CommonConst.UPD_ID);
        return wordDao.deleteWord(wordVO);
    }
    
    public int updateWord(WordVO wordVO){
        wordVO.setUpdId(CommonConst.UPD_ID);
        return wordDao.updateWord(wordVO);
    }
    
    public WordVO selectWord(WordVO wordVO){
        return wordDao.selectWord(wordVO);
    }

    // 중복 체크
    public int duplicationCheck(WordVO wordVO){
        if (wordVO.getWordNm().equals("") || wordVO.getWordAbbr().equals("")){
            return -1;
        } else {
            if(wordDao.duplicationNameCheck(wordVO) >= 1){
                return 1;
            }
            if(wordDao.duplicationEngShortNameCheck(wordVO) >= 1){
                return 2;
            }
            if(wordDao.duplicationEngNameCheck(wordVO) >= 1){
                return 3;
            }

            return 0;

        }
    }
    
    // [하늘] 단어명 및 단어영문명 중복조회
    public List<WordVO> nameDuplicationCheck(WordVO wordVO){
        List<WordVO> list = wordDao.nameDuplicationCheck(wordVO); // 리스트 생성
        
        if(list.size() > 0) {
        	for(int i = 0; i < list.size(); i++) {
        		if(!StringUtils.isEmpty(list.get(i).getWordDscrpt())) {
        			list.get(i).setSummaryWordDscrpt(list.get(i).getWordDscrpt().replace("<br>", "  "));
        		}
        	}
        }

        return list;
    }
    
    // [하늘] 단어명 및 단어영문명 중복조회
    public List<WordVO> abbrDuplicationCheck(WordVO wordVO){
        List<WordVO> list = wordDao.abbrDuplicationCheck(wordVO); // 리스트 생성
        
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
