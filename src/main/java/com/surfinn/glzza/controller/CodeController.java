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
import com.surfinn.glzza.vo.DomainCodeVO;
import com.surfinn.glzza.vo.Paging;

@RestController
@RequestMapping("/code")
public class CodeController {
	
	@Autowired
	private CodeService codeService;
		
	@PostMapping("/domainCodeList")
	@ResponseBody
	public Paging selectCodeList(DomainCodeVO domainCodeVO, Paging paging) {
		return codeService.selectDomainCodeList(domainCodeVO, paging);
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
