package com.surfinn.glzza.service;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surfinn.glzza.core.CommonConst;
import com.surfinn.glzza.dao.DomainDao;
import com.surfinn.glzza.utility.CommonUtil;
import com.surfinn.glzza.vo.DomainVO;
import com.surfinn.glzza.vo.BaseVO;

@Service
public class DomainService {
	
	@Autowired
	private DomainDao domainDao;

	public BaseVO selectDomainList(DomainVO domainVO, BaseVO baseVO) {
		
		if(!CommonUtil.isEmpty(domainVO.getColumns())) {
			domainVO.setSorting(domainVO.getColumns()[domainVO.getISortCol_0()]);
		}
		
		List<DomainVO> list = domainDao.selectDomainList(domainVO, baseVO);
		
		if(list.size() > 0) {
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
		
		baseVO.setRecordsTotal(domainDao.selectTotalCountDomain(domainVO));				
		baseVO.setRecordsFiltered(list.size());
		baseVO.setData(list);
		return baseVO;
	}
	
	public List<DomainVO> searchType() {
		return domainDao.searchType();
	}

	public int insertDomain(DomainVO domainVO) {		
		domainVO.setRegId(CommonConst.REG_ID);
		domainVO.setUpdId(CommonConst.UPD_ID);
		if(!StringUtils.isEmpty(domainVO.getDomainDscrpt())) {
			domainVO.setDomainDscrpt(domainVO.getDomainDscrpt().trim().replace("\r\n","<br>"));
		}
		
		int result = 0;
		
		DomainVO checkData = domainDao.selectDomain(domainVO);
		
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

	public int deleteDomain(DomainVO domainVO) {
		domainVO.setUpdId(CommonConst.UPD_ID);
		return domainDao.deleteDomain(domainVO);
	}

	public DomainVO selectDomain(DomainVO domainVO) {
		return domainDao.selectDomain(domainVO);
	}

	public int duplicationNameCheck(DomainVO domainVO) {
		
		int result = 0;
		DomainVO checkData = domainDao.selectDomainDomainName(domainVO);
		
		if(!CommonUtil.isEmpty(checkData)) {					
			if(!checkData.getDomainSeq().equals(domainVO.getDomainSeq())) {
				if(checkData.getDomainNm().equals(domainVO.getDomainNm())) {
					result = 1;
				}
			}
		}

		return result;
	}

	public List<DomainVO> duplicateDomainTypeName(DomainVO domainVO) {
		return domainDao.duplicateDomainTypeName(domainVO);
	}

	public List<DomainVO> selectAll(){
		return domainDao.selectAll();
	}

}
