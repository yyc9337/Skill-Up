package com.surfinn.glzza.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.surfinn.glzza.vo.DomainCodeVO;
import com.surfinn.glzza.vo.Paging;

@Mapper
public interface CodeMapper {

	List<DomainCodeVO> selectDomainCodeList(DomainCodeVO domainCodeVO, Paging paging);

	Integer selectDomainCodeListCount(DomainCodeVO domainCodeVO);

	List<DomainCodeVO> searchTypeDomainCode();

	int insertDomainCode(DomainCodeVO domainCodeVO);

	DomainCodeVO selectDomainCode(DomainCodeVO domainCodeVO);

	int updateUseYn(DomainCodeVO domainCodeVO);

	int deleteDomainCode(DomainCodeVO domainCodeVO);

}
