package com.surfinn.glzza.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.surfinn.glzza.dao.DomainDao;
import com.surfinn.glzza.dao.TermDao;
import com.surfinn.glzza.dao.WordDao;
import com.surfinn.glzza.utility.CommonUtil;
import com.surfinn.glzza.utility.MapToModelUtil;
import com.surfinn.glzza.vo.BaseVO;
import com.surfinn.glzza.vo.DomainVO;
import com.surfinn.glzza.vo.Paging;
import com.surfinn.glzza.vo.TermVO;
import com.surfinn.glzza.vo.WordVO;

@Service
public class ExcelService {
	
	@Autowired
	private DomainDao domainDao;
	
	@Autowired
	private TermDao termDao;
	
	@Autowired
	private WordDao wordDao;
	
	
	public void makeExcel(String serviceName, String fileName, Map<String, String> map, ExcelExporterService excelExporter) {
		
		switch (serviceName) {
		case "termListExcelDownload" :
			termListExcelDownload(map, fileName, excelExporter);
			break;
		case "domainListExcelDownload" :
			domainListExcelDownload(map, fileName, excelExporter);
			break;
		case "wordListExcelDownload" :
			wordListExcelDownload(map, fileName, excelExporter);
			break;
		}
	}
	
	public void termListExcelDownload(Map<String, String> map, String fileName, ExcelExporterService excelExporter) {
		
		String fileNameSplit [] = fileName.split("_");
		String fileType = fileNameSplit[2];
		
		BaseVO baseVO = new BaseVO();
		TermVO termVO = (TermVO) MapToModelUtil.convertMapToObject(map, new TermVO());
		
		baseVO.setIDisplayStart(null);
		baseVO.setIDisplayLength(null);
		termVO.setSearchType(null);
		termVO.setKeyword(null);
			
		List<TermVO> list = termDao.selectTermList(termVO, baseVO);
		
		for(int i = 0; i < list.size(); i++) {
			list.get(i).setTag("X");
		}
		
		StringBuffer sbData = new StringBuffer();
		StringBuffer sbHeader = new StringBuffer();
		
		if(fileType.equals("EXERD")) {
			sbHeader.append("용어명").append(";");
			sbHeader.append("용어 설명").append(";");
			sbHeader.append("용어 동의어").append(";");
			sbHeader.append("용어 영문 약어명").append(";");
			sbHeader.append("용어 설명").append(";");
			sbHeader.append("용어 동의어").append(";");
			sbHeader.append("태그").append(";");			
			sbData.append("basic@termNm;");
			sbData.append("basic@termDscrpt;");
			sbData.append("basic@synmList;");
			sbData.append("basic@termAbbr;");
			sbData.append("basic@termDscrpt;");
			sbData.append("basic@synmList;");
			sbData.append("basic@tag;");
		} else {
			sbHeader.append("용어명").append(";");
			sbHeader.append("용어 영문 약어명").append(";");
			sbHeader.append("도메인명").append(";");
			sbHeader.append("용어 설명").append(";");
			sbData.append("basic@termNm;");
			sbData.append("basic@termAbbr;");
			sbData.append("basic@domainNm;");
			sbData.append("basic@termDscrpt;");
		}
		
		excelExporter.writeHeaderRow(String.valueOf(sbHeader));
		excelExporter.writeDataRow(String.valueOf(sbData));
		excelExporter.writeData(list, fileType);
		
	}
	
	public void domainListExcelDownload(Map<String, String> map, String fileName, ExcelExporterService excelExporter) {
		
		String fileNameSplit [] = fileName.split("_");
		String fileType = fileNameSplit[2];
		
		Paging paging = new Paging();
		DomainVO domainVO = (DomainVO) MapToModelUtil.convertMapToObject(map, new DomainVO());
		
		domainVO.setIDisplayStart(null);
		domainVO.setIDisplayLength(null);
		domainVO.setSearchType(null);
		domainVO.setKeyword(null);
		
		
		List<DomainVO> list = domainDao.selectDomainList(domainVO, paging);
		StringBuffer sbData = new StringBuffer();
		StringBuffer sbHeader = new StringBuffer();
		
		if(list.size() > 0) {
			for(int i = 0; i < list.size(); i++) {
				
				StringBuilder sb = new StringBuilder();
					
				if(!CommonUtil.isEmpty(list.get(i).getDomainDscrpt())) {
					list.get(i).setDomainDscrpt(list.get(i).getDomainDscrpt().replace("<br>", " "));
				}
				
				if(CommonUtil.isEmpty(list.get(i).getDataLen())) {
					//DATATYPE
					sb.append(list.get(i).getDataType());
				} else {
					if(CommonUtil.isEmpty(list.get(i).getDcmlLen())) {
						//DATATYPE(A)
						sb.append(list.get(i).getDataType());
						sb.append("(");
						sb.append(list.get(i).getDataLen());
						sb.append(")");
					} else {
						//DATATYPE(A,B)
						sb.append(list.get(i).getDataType());
						sb.append("(");
						sb.append(list.get(i).getDataLen());
						sb.append(",");
						sb.append(list.get(i).getDcmlLen());
						sb.append(")");
					}
				}		
				list.get(i).setDataType(sb.toString());
			}
		}

		
		if(fileType.equals("EXERD")) {
			sbHeader.append("부모 도메인").append(";");
			sbHeader.append("도메인").append(";");
			sbHeader.append("데이터 타입").append(";");
			sbHeader.append("기본값").append(";");
			sbHeader.append("주석").append(";");
			sbData.append("basic@domainTypeNm;");
			sbData.append("basic@domainNm;");
			sbData.append("basic@dataType;");
			sbData.append("basic@defaultValue;");
			sbData.append("basic@remark;");
		} else {
			sbHeader.append("도메인명").append(";");
			sbHeader.append("도메인 분류명").append(";");
			sbHeader.append("데이터 타입").append(";");
			sbHeader.append("데이터 길이").append(";");
			sbHeader.append("소수점 길이").append(";");
			sbHeader.append("도메인 설명").append(";");
			sbData.append("basic@domainNm;");
			sbData.append("basic@domainTypeNm;");
			sbData.append("basic@dataType;");
			sbData.append("basic@dataLen;");
			sbData.append("basic@dcmlLen;");
			sbData.append("basic@domainDscrpt;");
		}

		
		excelExporter.writeHeaderRow(String.valueOf(sbHeader));
		excelExporter.writeDataRow(String.valueOf(sbData));
		excelExporter.writeData(list, fileType);
	
	}
	
	
	public void wordListExcelDownload(Map<String, String> map, String fileName, ExcelExporterService excelExporter) {
		
		String fileNameSplit [] = fileName.split("_");
		String fileType = fileNameSplit[2];
		
		WordVO wordVO = (WordVO) MapToModelUtil.convertMapToObject(map, new WordVO());
		
		wordVO.setIDisplayStart(null);
		wordVO.setIDisplayLength(null);
		wordVO.setSearchType(null);
		wordVO.setKeyword(null);
		BaseVO base = null;
		
		List<WordVO> list = wordDao.selectWordList(wordVO, base);
		StringBuffer sbData = new StringBuffer();
		StringBuffer sbHeader = new StringBuffer();
		
		if(list.size() > 0) {
			for(int i = 0; i < list.size(); i++) {
				if(!CommonUtil.isEmpty(list.get(i).getWordDscrpt())) {
	    			list.get(i).setWordDscrpt(list.get(i).getWordDscrpt().replace("<br>", " "));
	    		}
				
				list.get(i).setTag("X");
			}
		}
		
		if(fileType.equals("EXERD")) {
			sbHeader.append("논리명").append(";");
			sbHeader.append("논리명 설명").append(";");
			sbHeader.append("논리 동의어").append(";");
			sbHeader.append("물리명").append(";");
			sbHeader.append("물리명 설명").append(";");
			sbHeader.append("물리 동의어").append(";");
			sbHeader.append("태그").append(";");
			sbData.append("basic@wordNm;");
			sbData.append("basic@wordDscrpt;");
			sbData.append("basic@synmList;");
			sbData.append("basic@wordAbbr;");
			sbData.append("basic@wordDscrpt;");
			sbData.append("basic@synmList;");
			sbData.append("basic@tag;");
		} else {
			sbHeader.append("단어명").append(";");
			sbHeader.append("단어 영문 약어명").append(";");
			sbHeader.append("단어 영문명").append(";");
			sbHeader.append("단어 설명").append(";");
			sbHeader.append("이음동의어").append(";");
			sbData.append("basic@wordNm;");
			sbData.append("basic@wordAbbr;");
			sbData.append("basic@wordEngNm;");
			sbData.append("basic@wordDscrpt;");
			sbData.append("basic@synmList;");
		}
		
	
		excelExporter.writeHeaderRow(String.valueOf(sbHeader));
		excelExporter.writeDataRow(String.valueOf(sbData));
		excelExporter.writeData(list, fileType);
		
	}
	
	

}
