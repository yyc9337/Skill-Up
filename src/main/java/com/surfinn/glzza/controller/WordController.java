package com.surfinn.glzza.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.surfinn.glzza.service.WordService;
import com.surfinn.glzza.vo.BaseVO;
import com.surfinn.glzza.vo.WordVO;

@Controller
@RequestMapping("/word")
public class WordController {
    @Autowired
    private WordService wordService;

    // 단어 리스트
    @PostMapping("/list")
    @ResponseBody
    public BaseVO selectWordList(WordVO wordVO, BaseVO base){
        return wordService.selectWordList(wordVO, base);
    }

    // 단어 타입 검색
    @GetMapping("/searchType")
    @ResponseBody
    public List<WordVO> searchType(){
        List<WordVO> list = wordService.searchType();
        return list;
    }

    // 단어 상세보기
    @GetMapping("/select")
    @ResponseBody
    public WordVO selectWord(WordVO wordVO) {
        return wordService.selectWord(wordVO);
    }

    // 단어 등록
    @PostMapping("/insert")
    @ResponseBody
    public int insertWord(@RequestBody WordVO wordVO){
        return wordService.insertWord(wordVO);
    }

    // 단어 삭제
    @PostMapping("/delete")
    @ResponseBody
    public int deleteWord(@RequestBody WordVO wordVO){
        return wordService.deleteWord(wordVO);
    }
    
    @PostMapping("/update")
    @ResponseBody
    public int updateWord(@RequestBody WordVO wordVO) {
    	return wordService.updateWord(wordVO);
    }

    // 단어(단어명, 단어영문약어명, 단어영문명, 이음동의어) 중복체크
    @GetMapping("/duplicationCheck")
    @ResponseBody
    public int duplicationCheck(WordVO wordVO) {
        return wordService.duplicationCheck(wordVO);
    }
    
    // [하늘] 단어 입력 프로세스 1 : 단어명/단어영문명 중복체크
    @PostMapping("/nameDuplicationCheck")
    @ResponseBody
    public List<WordVO> nameDuplicationCheck(@RequestBody WordVO wordVO){
        List<WordVO> list = wordService.nameDuplicationCheck(wordVO);
        return list;
    } 
    
    // [하늘] 단어 입력 프로세스 2 : 단어영문약어명 중복체크
    @PostMapping("/abbrDuplicationCheck")
    @ResponseBody
    public List<WordVO> abbrDuplicationCheck(@RequestBody WordVO wordVO){
        List<WordVO> list = wordService.abbrDuplicationCheck(wordVO);
        return list;
    }
}
