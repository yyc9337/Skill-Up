package com.surfinn.glzza.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.surfinn.glzza.service.DomainService;
import com.surfinn.glzza.utility.SuccessResponse;
import com.surfinn.glzza.vo.DomainVO;
import com.surfinn.glzza.vo.Paging;


@RestController
@RequestMapping("/domain")
public class DomainController {
	
	@Autowired
	private DomainService domainService;
	
	@GetMapping("/searchType")
//    @ResponseBody
//    public List<DomainVO> searchType() {
//        List<DomainVO> list = domainService.searchType();   
//        return list;
//    }
    public SuccessResponse<List<DomainVO>> searchType(){
        return new SuccessResponse<>(domainService.searchType());
    }
	
	@PostMapping("/list")
    @ResponseBody
    public Paging selectDomainList(DomainVO domainVO, Paging paging) { 
        return domainService.selectDomainList(domainVO, paging); 
    }
    
    @PostMapping("/insert")
    @ResponseBody
    public SuccessResponse<Integer> insertDomain(@RequestBody DomainVO domainVO) {
    	return new SuccessResponse<>(domainService.insertDomain(domainVO));
    }
    
    @PostMapping("/delete")
    @ResponseBody
    public SuccessResponse<Integer> deleteDomain(@RequestBody DomainVO domainVO) {
    	return new SuccessResponse<>(domainService.deleteDomain(domainVO));
    }
    
    @GetMapping("/select")
    @ResponseBody
    public SuccessResponse<DomainVO> selectDomain(DomainVO domainVO) {
    	return new SuccessResponse<>(domainService.selectDomain(domainVO));
    }
    
    @GetMapping("/duplicationNameCheck")
    @ResponseBody
    public SuccessResponse<Integer> duplicationNameCheck(DomainVO domainVO) {
    	return new SuccessResponse<>(domainService.duplicationNameCheck(domainVO));
    }
    
    @GetMapping("/duplicateDomainTypeName")
    @ResponseBody
    public SuccessResponse<List<DomainVO>> duplicateDomainTypeName(DomainVO domainVO) {
    	return new SuccessResponse<>(domainService.duplicateDomainTypeName(domainVO));
    }
    
    @PostMapping("/updateUseYn")
    @ResponseBody
    public SuccessResponse<Integer> updateUseYn(@RequestBody DomainVO domainVO) {
    	return new SuccessResponse<>(domainService.insertDomain(domainVO));
    }

    @GetMapping("/selectall")
    @ResponseBody
    public SuccessResponse<List<DomainVO>> selectAll() {
	    return new SuccessResponse<>(domainService.selectAll());
    }
   
}
