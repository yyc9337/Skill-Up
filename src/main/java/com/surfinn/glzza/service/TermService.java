package com.surfinn.glzza.service;

import java.io.IOException;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import com.surfinn.glzza.dao.TermDao;
import com.surfinn.glzza.exception.GlzzaBadRequestException;
import com.surfinn.glzza.utility.CommonUtil;
import com.surfinn.glzza.vo.Paging;
import com.surfinn.glzza.vo.TermVO;

import io.micrometer.core.instrument.util.StringUtils;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("termService")
public class TermService {
    @Autowired
    TermDao termDao;
    
    @Autowired
	private ResourceLoader resourceLoader;

    public Paging selectTermList(TermVO termVO, Paging paging){    	
    	paging.setRecordsTotal(termDao.selectTotalCountTerm(termVO));
        String[] columns = new String[]{"TERM_SEQ","TERM_NM","TERM_ABBR","DOMAIN_SEQ","TERM_DSCRPT","UPD_DT"};
        termVO.setSorting(columns[termVO.getISortCol_0()]);
        if(termVO.getISortCol_0()==5){
            termVO.setSSortDir_0("DESC");
        }else{
            termVO.setSSortDir_0(termVO.getSSortDir_0().toUpperCase());
        }

        List<TermVO> list = termDao.selectTermList(termVO, paging);
        
        if(list.size() > 0) {
        	for(int i = 0; i < list.size(); i++) {
        		if(!StringUtils.isEmpty(list.get(i).getTermDscrpt())) {
        			list.get(i).setSummaryTermDscrpt(list.get(i).getTermDscrpt().replace("<br>", "  "));
        		}
        	}
        }

        paging.setRecordsFiltered(list.size());
		paging.setData(list);
		return paging;
    }

    public List<TermVO> selectSearchType(){
        return termDao.selectSearchType();
    }

    public boolean insertTerm(TermVO termVO){
    	//유효성 체크
        validationTermObject(termVO);
        //신규등록할 데이터가 기존의 DB에 존재하나 사용하지 않는 경우 부활 시켜준다.
        //기존의 DB에 존재하나 사용되지 않는(UseYN = N) 데이터가 있는지 체크. 
        termVO.setUseYn("N");
        TermVO temp = termDao.recycleCheck(termVO);   
        //기존 데이터 부활
        if(temp != null && !CommonUtil.isEmpty(temp.getTermSeq())){
            return termDao.recycleTerm(temp) == 1 ? true : false;
        }     
        //기존데이터가 없으므로 신규등록 
        termVO.setUseYn("Y");
            return termDao.insertTerm(termVO) == 1 ? true : false;
    }

    public boolean duplicateCheck(TermVO termVO){
        return termDao.duplicateCheck(termVO) == 0 ? true : false;
    }

    public TermVO searchTermBySeq(TermVO termVO){
        if(CommonUtil.isEmpty(termVO.getTermSeq())){
            throw new GlzzaBadRequestException("Term Seq is Empty");
        }

        return termDao.searchTermBySeq(termVO);
    }

    public boolean deleteTerm(TermVO termVO){
        if(CommonUtil.isEmpty(termVO.getTermSeq())){
            throw new GlzzaBadRequestException("Term Seq is Empty");
        }
        if(termVO.getTermSeq() == 0){
            throw new GlzzaBadRequestException("Term Seq is Valid");
        } 

        return termDao.deleteTerm(termVO) == 1 ? true : false;
    }

    public boolean updateTerm(TermVO termVO){
        if(CommonUtil.isEmpty(termVO.getTermSeq())){
            throw new GlzzaBadRequestException("Term Seq is Empty");
        }
        return termDao.updateTerm(termVO) == 1 ? true : false;
    }

    private void validationTermObject(TermVO termVO){
        if(CommonUtil.isEmpty(termVO.getTermNm()))
            throw new GlzzaBadRequestException("Term Name is Empty");
        if(CommonUtil.isEmpty(termVO.getTermAbbr()))
            throw new GlzzaBadRequestException("Term English Short Name is Empty");
        if(CommonUtil.isEmpty(termVO.getDomainSeq()))
            throw new GlzzaBadRequestException("Doamin Seq is Empty");
    }


}
