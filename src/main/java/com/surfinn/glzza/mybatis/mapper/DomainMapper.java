package com.surfinn.glzza.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.surfinn.glzza.vo.DomainVO;
import com.surfinn.glzza.vo.Paging;

@Mapper
public interface DomainMapper {
	
	Integer selectTotalCountDomain(DomainVO domainVO);

	List<DomainVO> selectDomainList(DomainVO domainVO, Paging paging);

	List<DomainVO> searchType();

	int insertDomain(DomainVO domainVO);

	int deleteDomain(DomainVO domainVO);

	DomainVO selectDomain(DomainVO domainVO);

	List<DomainVO> duplicateDomainTypeName(DomainVO domainVO);

	DomainVO selectDomainDomainName(DomainVO domainVO);

	int updateUseYn(DomainVO domainVO);

	List<DomainVO> selectAll();
}
