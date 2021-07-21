package com.surfinn.glzza.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.surfinn.glzza.mybatis.mapper.DomainMapper;
import com.surfinn.glzza.vo.DomainVO;
import com.surfinn.glzza.vo.BaseVO;

@Repository
public class DomainDao {
	
	@Autowired
	private DomainMapper domainMapper;
	
	// 도메인 검색시 카테고리 별 검색결과 갯수 반환
	public Integer selectTotalCountDomain(DomainVO domainVO) {
		return domainMapper.selectTotalCountDomain(domainVO);
	}
	
	// 도메인 검색시 카테고리 별 검색결과를 List로 반환
	public List<DomainVO> selectDomainList(DomainVO domainVO, BaseVO baseVO) {
		return domainMapper.selectDomainList(domainVO, baseVO);
	}
	
	// 도메인 검색시 사용할 카테고리를 List로 반환
	public List<DomainVO> searchType() {
		return domainMapper.searchType();
	}

	// 도메인 생성
	public int insertDomain(DomainVO domainVO) {
		return domainMapper.insertDomain(domainVO);
	}
	
	// 도메인 삭제
	public int deleteDomain(DomainVO domainVO) {
		return domainMapper.deleteDomain(domainVO);
	}
	
	// 도메인 개별 조회
	public DomainVO selectDomain(DomainVO domainVO) {
		return domainMapper.selectDomain(domainVO);
	}
	
	// 도메인분류명 중복검사
	public List<DomainVO> duplicateDomainTypeName(DomainVO domainVO) {
		return domainMapper.duplicateDomainTypeName(domainVO);
	}
	
	// 도메인명 중복 검사 시 사용
	// 현재 사용중인(USE_YN='Y')인 도메인 중 이름이 중복되는 도메인을 List로 반환
	public DomainVO selectDomainDomainName(DomainVO domainVO) {
		return domainMapper.selectDomainDomainName(domainVO);
	}
	
	// 저장 및 수정시 DB에 있으나 사용중이지 않던 도메인을 사용중 상태로 바꿔줌
	public int updateUseYn(DomainVO domainVO) {
		return domainMapper.updateUseYn(domainVO);
	}
	
	// 현재 사용중인 도메인 전체를 List로 반환 
	public List<DomainVO> selectAll(){
		return domainMapper.selectAll();
	}
	
	// 도메인 복원
	public int revivalDomain(DomainVO domainVO) {
		return domainMapper.revivalDomain(domainVO);
	}
}
