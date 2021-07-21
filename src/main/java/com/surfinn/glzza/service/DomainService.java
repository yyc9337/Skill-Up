package com.surfinn.glzza.service;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surfinn.glzza.core.CommonConst;
import com.surfinn.glzza.dao.DomainDao;
import com.surfinn.glzza.utility.CommonUtil;
import com.surfinn.glzza.vo.DomainVO;
import com.surfinn.glzza.vo.WordVO;
import com.surfinn.glzza.vo.BaseVO;

@Service
public class DomainService {
	
	@Autowired
	private DomainDao domainDao;
	
	// 도메인 목록 조회 (검색)
	public BaseVO selectDomainList(DomainVO domainVO, BaseVO baseVO) {
		// 컬럼 정렬
		if(!CommonUtil.isEmpty(domainVO.getColumns())) {
			domainVO.setSorting(domainVO.getColumns()[domainVO.getISortCol_0()]);
		}
		// domainVO와 baseVO를 매개변수로 검색한 단어와 일치하는 단어 검색
		List<DomainVO> list = domainDao.selectDomainList(domainVO, baseVO);
		
		// 검색 결과가 있다면
		if(list.size() > 0) {
			// DataLen, DcmlLen, DomainDscrpt 중 빈 값에 - 를 넣어준다
			for(int i = 0; i < list.size(); i++) {
				if(StringUtils.isEmpty(list.get(i).getDataLen())) {
					list.get(i).setDataLen("-");
				}

				if(StringUtils.isEmpty(list.get(i).getDcmlLen())) {
					list.get(i).setDcmlLen("-");
				}
				
				if(StringUtils.isEmpty(list.get(i).getDomainDscrpt())) {
					list.get(i).setDomainDscrpt("-");
				} else {
					list.get(i).setSummaryDomainDscrpt(list.get(i).getDomainDscrpt().replace("<br>", "  "));
				}

			}
		}
		
		// 총 결과 갯수를 표시해줌
		baseVO.setRecordsTotal(domainDao.selectTotalCountDomain(domainVO));				
		// 페이징 처리에 따라 필터링된 갯수를 표시해줌
		baseVO.setRecordsFiltered(list.size());
		// baseVO에 Data attribute에 불러온 list 전달
		baseVO.setData(list);
		return baseVO;
	}
	
	// 도메인 검색시 사용할 카테고리 목록(셀렉트 박스) 불러오기
	public List<DomainVO> searchType() {
		return domainDao.searchType();
	}

	// 수정, 저장 기능
	public int insertDomain(DomainVO domainVO) {	
		// 등록한사람, 수정한사람을 ADMIN으로 설정
		domainVO.setRegId(CommonConst.REG_ID);
		domainVO.setUpdId(CommonConst.UPD_ID);
		
		// DomainDscrpt가 있다면 좌우공백 제거 및 \r\n을 <br>태그로 변경해준다
		if(!StringUtils.isEmpty(domainVO.getDomainDscrpt())) {
			domainVO.setDomainDscrpt(domainVO.getDomainDscrpt().trim().replace("\r\n","<br>"));
		}
		
		int result = 0;
		
		DomainVO checkData = domainDao.selectDomain(domainVO);
		
		// DB에 USEYN = N으로 되어있는 데이터가 있다면 해당 데이터를 수정하고,
		// 기존에 DB에 없었다면 데이터를 생성함
		if(!CommonUtil.isEmpty(checkData)) {
			if(checkData.getUseYn().equals("N")) {
				result = domainDao.updateUseYn(domainVO);
			} else {
				result = domainDao.insertDomain(domainVO);
			}
		} else {
			result = domainDao.insertDomain(domainVO);
		}
		
		return result;
	}
	
	// 삭제 기능
	public int deleteDomain(DomainVO domainVO) {
		domainVO.setUpdId(CommonConst.UPD_ID);
		return domainDao.deleteDomain(domainVO);
	}
	
	// 조회 기능
	public DomainVO selectDomain(DomainVO domainVO) {
		return domainDao.selectDomain(domainVO);
	}
	
	// 도메인 명 중복 검사
	public int duplicationNameCheck(DomainVO domainVO) {
		
		int result = 0;
		DomainVO checkData = domainDao.selectDomainDomainName(domainVO);
		
		// 도메인 명이 중복이면 result = 1 을 반환함
		if(!CommonUtil.isEmpty(checkData)) {					
			if(!checkData.getDomainSeq().equals(domainVO.getDomainSeq())) {
				if(checkData.getDomainNm().equals(domainVO.getDomainNm())) {
					result = 1;
				}
			}
		}

		return result;
	}
	
	// 도메인분류명 중복 검사
	public List<DomainVO> duplicateDomainTypeName(DomainVO domainVO) {
		return domainDao.duplicateDomainTypeName(domainVO);
	}
	
	// 현재 사용중인(USE_YN='Y') 도메인 전체 선택
	public List<DomainVO> selectAll(){
		return domainDao.selectAll();
	}
	
	// 도메인 복원
    public int revivalDomain(DomainVO domainVO){
    	domainVO.setUpdId(CommonConst.UPD_ID);
        return domainDao.revivalDomain(domainVO);
    }

}
