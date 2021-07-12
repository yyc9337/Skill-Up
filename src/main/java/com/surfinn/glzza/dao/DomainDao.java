package com.surfinn.glzza.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.surfinn.glzza.mybatis.mapper.DomainMapper;
import com.surfinn.glzza.vo.DomainVO;
import com.surfinn.glzza.vo.Paging;

@Repository
public class DomainDao {
	
	@Autowired
	private DomainMapper domainMapper;
	
	public Integer selectTotalCountDomain(DomainVO domainVO) {
		return domainMapper.selectTotalCountDomain(domainVO);
	}

	public List<DomainVO> selectDomainList(DomainVO domainVO, Paging paging) {
		return domainMapper.selectDomainList(domainVO, paging);
	}

	public List<DomainVO> searchType() {
		return domainMapper.searchType();
	}

	public int insertDomain(DomainVO domainVO) {
		return domainMapper.insertDomain(domainVO);
	}

	public int deleteDomain(DomainVO domainVO) {
		return domainMapper.deleteDomain(domainVO);
	}

	public DomainVO selectDomain(DomainVO domainVO) {
		return domainMapper.selectDomain(domainVO);
	}

	public List<DomainVO> duplicateDomainTypeName(DomainVO domainVO) {
		return domainMapper.duplicateDomainTypeName(domainVO);
	}

	public DomainVO selectDomainDomainName(DomainVO domainVO) {
		return domainMapper.selectDomainDomainName(domainVO);
	}

	public int updateUseYn(DomainVO domainVO) {
		return domainMapper.updateUseYn(domainVO);
	}

	public List<DomainVO> selectAll(){
		return domainMapper.selectAll();
	}
}
