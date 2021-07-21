package com.surfinn.glzza.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.surfinn.glzza.vo.BaseVO;
import com.surfinn.glzza.service.DomainService;
import com.surfinn.glzza.utility.SuccessResponse;
import com.surfinn.glzza.vo.DomainVO;


import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/domain")
public class DomainController {
	
	@Autowired
	private DomainService domainService;
	
	// 도메인 검색시 사용할 카테고리 목록(셀렉트 박스) 불러오기
	@GetMapping("/searchType")
    @ResponseBody
    public SuccessResponse<List<DomainVO>> searchType(){
        return new SuccessResponse<>(domainService.searchType());
    }

	
	// 도메인 목록 조회 (검색)
	@PostMapping("/list")
    @ResponseBody
    public BaseVO selectDomainList(DomainVO domainVO, BaseVO baseVO) { 
        return domainService.selectDomainList(domainVO, baseVO); 
    }
	
	// 수정, 저장 기능
    @PostMapping("/insert")
    @ResponseBody
    public SuccessResponse<Integer> insertDomain(@RequestBody DomainVO domainVO) {
    	return new SuccessResponse<>(domainService.insertDomain(domainVO));
    }

    
    // 삭제 기능
    @PostMapping("/delete")
    @ResponseBody
    public SuccessResponse<Integer> deleteDomain(@RequestBody DomainVO domainVO) {
    	return new SuccessResponse<>(domainService.deleteDomain(domainVO));
    }

    
    // 조회 기능
    @GetMapping("/select")
    @ResponseBody
    public SuccessResponse<DomainVO> selectDomain(DomainVO domainVO) {
    	return new SuccessResponse<>(domainService.selectDomain(domainVO));
    }

    
    // 도메인 명 중복 검사
    @GetMapping("/duplicationNameCheck")
    @ResponseBody
    public SuccessResponse<Integer> duplicationNameCheck(DomainVO domainVO) {
    	return new SuccessResponse<>(domainService.duplicationNameCheck(domainVO));
    }

    
    // 도메인분류명 중복 검사
    @GetMapping("/duplicateDomainTypeName")
    @ResponseBody
    public SuccessResponse<List<DomainVO>> duplicateDomainTypeName(DomainVO domainVO) {
    	return new SuccessResponse<>(domainService.duplicateDomainTypeName(domainVO));
    }

    
    // 도메인 명, 설명, USE_YN='Y' 로 수정해주는 기능 
    @PostMapping("/updateUseYn")
    @ResponseBody
    public SuccessResponse<Integer> updateUseYn(@RequestBody DomainVO domainVO) {
    	return new SuccessResponse<>(domainService.insertDomain(domainVO));
    }

    
    // 현재 사용중인(USE_YN='Y') 도메인 전체 선택
    @GetMapping("/selectall")
    @ResponseBody
    public SuccessResponse<List<DomainVO>> selectAll() {
	    return new SuccessResponse<>(domainService.selectAll());
    }
    
    // 단어 복원
    @PostMapping("/revival")
    @ResponseBody
    public SuccessResponse<Integer> revivalDomain(@RequestBody DomainVO domainVO) {
    	return new SuccessResponse<>(domainService.revivalDomain(domainVO));
    }
    
   
}
