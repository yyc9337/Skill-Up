package com.surfinn.glzza.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.surfinn.glzza.mybatis.mapper.CodeMapper;
import com.surfinn.glzza.vo.BaseVO;
import com.surfinn.glzza.vo.DomainCodeVO;

@Repository
public class CodeDao {
	
	@Autowired
	private CodeMapper codeMapper;

	public List<DomainCodeVO> selectDomainCodeList(DomainCodeVO domainCodeVO, BaseVO baseVO) {
		return codeMapper.selectDomainCodeList(domainCodeVO, baseVO);
	}

	public Integer selectDomainCodeListCount(DomainCodeVO domainCodeVO) {
		return codeMapper.selectDomainCodeListCount(domainCodeVO);
	}

	public List<DomainCodeVO> searchTypeDomainCode() {
		return codeMapper.searchTypeDomainCode();
	}

	public int insertDomainCode(DomainCodeVO domainCodeVO) {
		return codeMapper.insertDomainCode(domainCodeVO);
	}

	public DomainCodeVO selectDomainCode(DomainCodeVO domainCodeVO) {
		return codeMapper.selectDomainCode(domainCodeVO);
	}

	public int updateUseYn(DomainCodeVO domainCodeVO) {
		return codeMapper.updateUseYn(domainCodeVO);
	}

	public int deleteDomainCode(DomainCodeVO domainCodeVO) {
		return codeMapper.deleteDomainCode(domainCodeVO);
	}

}
