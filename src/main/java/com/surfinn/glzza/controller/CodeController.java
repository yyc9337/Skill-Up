package com.surfinn.glzza.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.surfinn.glzza.service.CodeService;
import com.surfinn.glzza.vo.BaseVO;
import com.surfinn.glzza.vo.DomainCodeVO;

@RestController
@RequestMapping("/code")
//코드테이블 데이터 통신 컨트롤러 
public class CodeController {
	
	@Autowired
	private CodeService codeService;
		
	@PostMapping("/domainCodeList")
	@ResponseBody
	public BaseVO selectCodeList(DomainCodeVO domainCodeVO, BaseVO baseVO) {
		return codeService.selectDomainCodeList(domainCodeVO, baseVO);
	}
	
    @ResponseBody
    public List<DomainCodeVO> searchType() {
		return codeService.searchTypeDomainCode();   
    }
	
    @PostMapping("/insertDomainCode")
    @ResponseBody
    public int insertDomain(@RequestBody DomainCodeVO domainCodeVO) {
    	return codeService.insertDomainCode(domainCodeVO);
    }
    
    @PostMapping("/duplicateCheckDomainCode")
    @ResponseBody
    public int duplicateCheckDomainCode(@RequestBody DomainCodeVO domainCodeVO) {
    	return codeService.duplicateCheckDomainCode(domainCodeVO);
    }
    
    @GetMapping("/selectDomainCode")
    @ResponseBody
    public DomainCodeVO selectDomainCode(DomainCodeVO domainCodeVO) {
    	return codeService.selectDomainCode(domainCodeVO);
    }
    
    @PostMapping("/deleteDomainCode")
    @ResponseBody
    public int deleteDomainCode(@RequestBody DomainCodeVO domainCodeVO) {
    	return codeService.deleteDomainCode(domainCodeVO);
    }
}
