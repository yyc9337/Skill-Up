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

    @PostMapping("/list")
    public BaseVO selectTermList(TermVO termVO, BaseVO baseVo){
        return termService.selectTermList(termVO, baseVo);
  }

//    public SuccessResponse<List<TermVO>> selectTermList(@RequestBody TermVO termVO, Paging paging){
//        return new SuccessResponse<>(termService.selectTermList(termVO, paging));
//    }

    @GetMapping("/searchType")
    public SuccessResponse<List<TermVO>> selectSearchType(){
        return new SuccessResponse<>(termService.selectSearchType());
    }

    @PostMapping("/create")
    public SuccessResponse<Boolean> insertTerm(@RequestBody TermVO termVO){
        return new SuccessResponse<>(termService.insertTerm(termVO));
    }

    @PostMapping("/duplicateCheck")
    public SuccessResponse<Boolean> duplicateCheck(@RequestBody TermVO termVO){
        return new SuccessResponse<>(termService.duplicateCheck(termVO));
    }

    @PostMapping("/search")
    public SuccessResponse<TermVO> searchTermBySeq(@RequestBody TermVO termVO){
        return new SuccessResponse<>(termService.searchTermBySeq(termVO));
    }

    @DeleteMapping("/delete")
    public SuccessResponse<Boolean> deleteTerm(@RequestBody TermVO termVO){
        return new SuccessResponse<>(termService.deleteTerm(termVO));
    }

    @PutMapping("/update")
    public SuccessResponse<Boolean> updateTerm(@RequestBody TermVO termVO){
        return new SuccessResponse<>(termService.updateTerm(termVO));
    }
    
    @PutMapping("/revival")
    public SuccessResponse<Integer> revivalTerm(@RequestBody TermVO termVO){
        return new SuccessResponse<>(termService.revivalTerm(termVO));
    }
    
    


}
