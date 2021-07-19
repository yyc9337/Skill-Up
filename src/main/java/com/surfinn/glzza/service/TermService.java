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
import com.surfinn.glzza.vo.BaseVO;
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

    //검색 - 카테고리와 페이징기능
    public BaseVO selectTermList(TermVO termVO, BaseVO baseVO){    	
    	//레코드의 토탈카운트를 설정
    	baseVO.setRecordsTotal(termDao.selectTotalCountTerm(termVO));
        String[] columns = new String[]{"TERM_SEQ","TERM_NM","TERM_ABBR","DOMAIN_SEQ","TERM_DSCRPT","UPD_DT"};
        //컬럼의 정렬
        baseVO.setSorting(columns[baseVO.getISortCol_0()]);
        //정렬의 기준이 업데이트 타임이라면 내림차순으로 정렬, 용어 새로 생성시에 해당함
        if(baseVO.getISortCol_0()==5){
        	baseVO.setSSortDir_0("DESC");
        }else{//아니라면 오름차순
        	baseVO.setSSortDir_0(baseVO.getSSortDir_0().toUpperCase());
        }
        //termVO와 baseVO를 매개변수로 검색한 단어와 일치하는 단어 검색
        List<TermVO> list = termDao.selectTermList(termVO, baseVO);
        
        //리턴 받은 리스트 사이즈가 0보다 크다면, 값이 들어있다면
        if(list.size() > 0) {
        	for(int i = 0; i < list.size(); i++) {//리스트 사이즈만큼 반복
        		//비어있으면 true 아니면 false를 반환 ->StringUtils, 리스트의 Dscrpt값(설명)이 들어있다면
        		if(!StringUtils.isEmpty(list.get(i).getTermDscrpt())) {
        			//리스트의 설명부분 <br>을 "  "로 바꿔라
        			list.get(i).setSummaryTermDscrpt(list.get(i).getTermDscrpt().replace("<br>", "  "));
        		}
        	}
        }

        //레코드 필터, 테이블 왼쪽 아래에 리스트 사이즈만큼 개수를 표시해줌
        baseVO.setRecordsFiltered(list.size());
        //baseVO의 Data라는 List 형식을 가진 어트리뷰트에 불러온 list를 전달
        baseVO.setData(list);
		return baseVO;
    }

    //저장된 카테고리 불러오는 기능
    public List<TermVO> selectSearchType(){
        return termDao.selectSearchType();
    }

    //용어 생성
    public boolean insertTerm(TermVO termVO){
    	//유효성 검사 값이 비어있는지 확인 비어있다면 throw 시킴
        validationTermObject(termVO);
        //신규등록할 데이터가 기존의 DB에 존재하나 사용하지 않는 경우 부활 시켜준다.
        //기존의 DB에 존재하나 사용되지 않는(UseYN = N) 데이터가 있는지 체크. 
        termVO.setUseYn("N");
        //입력된 데이터가 기존에 작성되고 삭제된 데이터가 있는지 확인
        TermVO temp = termDao.recycleCheck(termVO);   
        //기존 데이터 부활
        if(temp != null && !CommonUtil.isEmpty(temp.getTermSeq())){
            return termDao.recycleTerm(temp) == 1 ? true : false;
        }
        //UseYn을 Y로 바꿔줌(다시 테이블에 조회가능)
        termVO.setUseYn("Y");
        //insert에 성공했다면 true 아니라면 false
        return termDao.insertTerm(termVO) == 1 ? true : false;
    }

    //유효성 검사
    public boolean duplicateCheck(TermVO termVO){
    	//0이 반환됐다면 중복이 없음으로 true 반환
        return termDao.duplicateCheck(termVO) == 0 ? true : false;
    }

    //테이블에 있는 데이터를 더블클릭 하였을때 실행되는 매소드, seq를 기준으로 데이터를 불러옴
    public TermVO searchTermBySeq(TermVO termVO){
        if(CommonUtil.isEmpty(termVO.getTermSeq())){
            throw new GlzzaBadRequestException("Term Seq is Empty");
        }

        return termDao.searchTermBySeq(termVO);
    }

    //용어 삭제, 삭제버튼 클릭시
    public boolean deleteTerm(TermVO termVO){
        if(CommonUtil.isEmpty(termVO.getTermSeq())){//시퀀스가 비어있다면
            throw new GlzzaBadRequestException("Term Seq is Empty");
        }
        if(termVO.getTermSeq() == 0){
            throw new GlzzaBadRequestException("Term Seq is Valid");
        } 

        //삭제가 성공되면 true 아니라면 false반환ㅇ
        return termDao.deleteTerm(termVO) == 1 ? true : false;
    }

    //용어 업데이트, 수정버튼 클릭시
    public boolean updateTerm(TermVO termVO){
        if(CommonUtil.isEmpty(termVO.getTermSeq())){//비어있다면
            throw new GlzzaBadRequestException("Term Seq is Empty");
        }
        return termDao.updateTerm(termVO) == 1 ? true : false;
    }

    //유효성 검사
    private void validationTermObject(TermVO termVO){
        if(CommonUtil.isEmpty(termVO.getTermNm()))//용어명이 비어있다면
            throw new GlzzaBadRequestException("Term Name is Empty");
        if(CommonUtil.isEmpty(termVO.getTermAbbr()))//용어영문약어명이 비어있다면
            throw new GlzzaBadRequestException("Term English Short Name is Empty");
        if(CommonUtil.isEmpty(termVO.getDomainSeq()))//도메인 시퀀셜이 비어있다면
            throw new GlzzaBadRequestException("Doamin Seq is Empty");
    }


}
