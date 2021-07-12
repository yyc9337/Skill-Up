package com.surfinn.glzza.service;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surfinn.glzza.controller.ConnectionController;
import com.surfinn.glzza.core.CommonConst;
import com.surfinn.glzza.dao.CodeDao;
import com.surfinn.glzza.utility.CommonUtil;
import com.surfinn.glzza.vo.DomainCodeVO;
import com.surfinn.glzza.vo.Paging;

@Service
public class CodeService {
	
	@Autowired
	private CodeDao codeDao;

	public Paging selectDomainCodeList(DomainCodeVO domainCodeVO, Paging paging) {
		
		if(domainCodeVO.getColumns() != null) {
			domainCodeVO.setSorting(domainCodeVO.getColumns()[domainCodeVO.getISortCol_0()]);
		}
		
		List<DomainCodeVO> list = codeDao.selectDomainCodeList(domainCodeVO, paging);
		
		for(int i = 0; i < list.size(); i++) {
			if(!StringUtils.isEmpty(list.get(i).getCdDscrpt())) {
				list.get(i).setSummaryCdDscrpt(list.get(i).getCdDscrpt().replace("<br>", "  "));
			} else {
				list.get(i).setSummaryCdDscrpt("-");
			}
		}
		paging.setRecordsTotal(codeDao.selectDomainCodeListCount(domainCodeVO));
		paging.setRecordsFiltered(list.size());
		paging.setData(list);
		return paging;
	}

	public List<DomainCodeVO> searchTypeDomainCode() {
		return codeDao.searchTypeDomainCode();
	}

	public int insertDomainCode(DomainCodeVO domainCodeVO) {
		domainCodeVO.setRegId(CommonConst.REG_ID);
		domainCodeVO.setUpdId(CommonConst.UPD_ID);
		if(StringUtils.isEmpty(domainCodeVO.getDcmlLenYn())) {
			domainCodeVO.setDcmlLenYn("N");
		}
		
		if(!StringUtils.isEmpty(domainCodeVO.getCdDscrpt())) {
			domainCodeVO.setCdDscrpt(domainCodeVO.getCdDscrpt().trim().replace("\r\n", "<br>"));
		}
		
		
		int result = 0;
		DomainCodeVO checkData = new DomainCodeVO();
		checkData = codeDao.selectDomainCode(domainCodeVO);
		
		if(!CommonUtil.isEmpty(checkData)) {
			if(checkData.getUseYn().equals("N")) {
				domainCodeVO.setCdSeq(checkData.getCdSeq());
				result = codeDao.updateUseYn(domainCodeVO);
			}
		} else {
			result = codeDao.insertDomainCode(domainCodeVO);
		}
		
		return result;
	}
	
	public int duplicateCheckDomainCode(DomainCodeVO domainCodeVO) {
		int result = 0;
		
		DomainCodeVO checkData = new DomainCodeVO();
		checkData = codeDao.selectDomainCode(domainCodeVO);
		
		if(!CommonUtil.isEmpty(checkData)) {
			if(checkData.getUseYn().equals("Y")) {
				result = 2;
			}
		}
		
		return result;
	}

	public DomainCodeVO selectDomainCode(DomainCodeVO domainCodeVO) {
		return codeDao.selectDomainCode(domainCodeVO);
	}

	public int deleteDomainCode(DomainCodeVO domainCodeVO) {
		domainCodeVO.setUpdId(CommonConst.UPD_ID);
		return codeDao.deleteDomainCode(domainCodeVO);
	}

}
