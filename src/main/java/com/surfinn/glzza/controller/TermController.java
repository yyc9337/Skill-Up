package com.surfinn.glzza.controller;

import com.surfinn.glzza.service.TermService;
import com.surfinn.glzza.utility.SuccessResponse;
import com.surfinn.glzza.vo.BaseVO;
import com.surfinn.glzza.vo.Paging;
import com.surfinn.glzza.vo.TermVO;

import lombok.extern.slf4j.Slf4j;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/term")
public class TermController {

    @Autowired
    TermService termService;

  //검색 - 카테고리와 페이징기능
    @PostMapping("/list")
    public BaseVO selectTermList(TermVO termVO, BaseVO baseVO){
        return termService.selectTermList(termVO, baseVO);
  }

//    public SuccessResponse<List<TermVO>> selectTermList(@RequestBody TermVO termVO, Paging paging){
//        return new SuccessResponse<>(termService.selectTermList(termVO, paging));
//    }
    ///유영찬 커밋 테스트

    //카테고리 타입 검색 후 리스트로 반환
    @GetMapping("/searchType")
    public SuccessResponse<List<TermVO>> selectSearchType(){
        return new SuccessResponse<>(termService.selectSearchType());
    }

    //용어 생성
    @PostMapping("/create")
    public SuccessResponse<Boolean> insertTerm(@RequestBody TermVO termVO){
        return new SuccessResponse<>(termService.insertTerm(termVO));
    }

    //유효성 검사
    @PostMapping("/duplicateCheck")
    public SuccessResponse<Boolean> duplicateCheck(@RequestBody TermVO termVO){
        return new SuccessResponse<>(termService.duplicateCheck(termVO));
    }

    //검색
    @PostMapping("/search")
    public SuccessResponse<TermVO> searchTermBySeq(@RequestBody TermVO termVO){
        return new SuccessResponse<>(termService.searchTermBySeq(termVO));
    }

    //삭제
    @DeleteMapping("/delete")
    public SuccessResponse<Boolean> deleteTerm(@RequestBody TermVO termVO){
        return new SuccessResponse<>(termService.deleteTerm(termVO));
    }

    //업데이트
    @PutMapping("/update")
    public SuccessResponse<Boolean> updateTerm(@RequestBody TermVO termVO){
        return new SuccessResponse<>(termService.updateTerm(termVO));
    }


}
