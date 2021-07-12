package com.surfinn.glzza.service;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service

public class ExcelExporterService {
	private static final Logger LOGGER = LoggerFactory.getLogger(ExcelExporterService.class);

	private XSSFWorkbook workbook;
	//private XSSFWorkbook workbook; //Excel 2007 이전 버전
	private XSSFSheet sheet;
	
	
	
	CellStyle headerStyle;
	CellStyle bodyStyleBasic;
	CellStyle bodyStylePrice;
	CellStyle bodyStyleNumber;
	CellStyle bodyStyleDateTime;
	CellStyle bodyStyleDate;
	
	// commit test
	private List<Object> list;
	
	List<String> dataList = new ArrayList<String>();
	

	public XSSFWorkbook getWorkbook() {
		return workbook;
	}


	public void setWorkbook(XSSFWorkbook workbook) {
		this.workbook = workbook;
	}


	public XSSFSheet getSheet() {
		return sheet;
	}


	public void setSheet(XSSFSheet sheet) {
		this.sheet = sheet;
	}

	public ExcelExporterService() {
	}
	
	public ExcelExporterService(String sheetName) {
		workbook = new XSSFWorkbook();
		//workbook = new XSSFWorkbook(); //Excel 2007 이전 버전
		
		sheet = workbook.createSheet(sheetName);
		
		setStyle(workbook);
	}
	
	public void writeDataRow(String subjectRow) {
		
		if(StringUtils.isNotEmpty(subjectRow)){
			dataList = Arrays.asList(subjectRow.split(";"));
		}
	}
	
	public void writeData(List<?> list, String fileType) {
		Method runMethod = null;
		String data = null;
		String type = null;
		int rowCount = 0;
		
		if(fileType.equals("EXERD")) {
			rowCount = 0;
		} else {
			rowCount = 1;
		}
		
		for(Object o : list) {
			Row row = sheet.createRow(rowCount);
			
			int dataSubjectCnt = 0;
			for(String i : dataList) {
				
				Cell cell = row.createCell(dataSubjectCnt);
				
				try {
					// (분리) 스타일 / 컬럼 이름 
					if(i.indexOf("@")!=-1) { 
						type = i.substring(0,i.indexOf("@"));
						i = i.substring(i.indexOf("@")+1);
					}
					
					if(i.indexOf(".")!=-1) { // return Type이 객체면,
						
						String prefix = i.substring(0,i.indexOf("."));
						String suffix = i.substring(i.indexOf(".")+1);
						
						Method outerMethod = o.getClass().getMethod(transGetColName(prefix));
						
						Object outerObject = outerMethod.invoke(o);
						Object innerObject;
						
						if(ObjectUtils.isEmpty(outerObject)) data = ""; // 값이 null 일 경우 처리
						else {
							Method innerMethod = outerObject.getClass().getMethod(transGetColName(suffix));
							innerObject = innerMethod.invoke(outerObject);
							
							data = String.valueOf(innerObject);
							
							data = (data.equals("null")) ? "" : data; // 값이 null 일 경우 처리
						}
						
						cell.setCellStyle(bodyStyleBasic); //(SET) STYLE 
						cell.setCellValue(data); //(SET) VALUE
						
					}else { // 일반
					
						runMethod = o.getClass().getMethod(transGetColName(i));
						
						//returnType=Date
						if(java.util.Date.class.equals(o.getClass().getMethod(transGetColName(i)).getReturnType())) { 
							SimpleDateFormat dateFormat;
							if(type.equals("time")) {
								dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
								cell.setCellStyle(bodyStyleDateTime);
							}else {
								dateFormat = new SimpleDateFormat("yyyy-MM-dd");
								cell.setCellStyle(bodyStyleDate);
							}
							cell.setCellValue((runMethod.invoke(o)!=null) ? dateFormat.format(Date.class.cast((Date)runMethod.invoke(o))) : ""); 
						}
						//returnType=Sting && type=time && type=date
						else if((java.lang.String.class.equals(o.getClass().getMethod(transGetColName(i)).getReturnType()) && (type.equals("time") || type.equals("date")))) {
							SimpleDateFormat dateFormat;
							if(type.equals("time")) {
								dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
								cell.setCellStyle(bodyStyleDateTime);
							}else {
								dateFormat = new SimpleDateFormat("yyyy-MM-dd");
								cell.setCellStyle(bodyStyleDate);
							}
							cell.setCellValue((runMethod.invoke(o)!=null) ? dateFormat.format(dateFormat.parse(String.valueOf(runMethod.invoke(o)))) : ""); 
						}
						//type=price
						else if("price".equals(type)) {
							if(java.lang.Integer.class.equals(o.getClass().getMethod(transGetColName(i)).getReturnType())) {
								cell.setCellValue((runMethod.invoke(o)!=null) ? (int)runMethod.invoke(o) : 0); 
							}else if((java.lang.Long.class.equals(o.getClass().getMethod(transGetColName(i)).getReturnType()))) {
								cell.setCellValue((runMethod.invoke(o)!=null) ? (Long)runMethod.invoke(o) : 0);
							}else if((java.lang.Double.class.equals(o.getClass().getMethod(transGetColName(i)).getReturnType()))) {
								cell.setCellValue((runMethod.invoke(o)!=null) ? (Double)runMethod.invoke(o) : 0);
							}
							cell.setCellStyle(bodyStylePrice);
						}
						//type=number
						else if("number".equals(type)) {
							cell.setCellStyle(bodyStyleNumber);
							cell.setCellValue((runMethod.invoke(o)!=null) ? (int)runMethod.invoke(o) : 0); 
						}
						//type=basic
						else {
							if((java.lang.String.class.equals(o.getClass().getMethod(transGetColName(i)).getReturnType()))){
								cell.setCellValue((runMethod.invoke(o)!=null) ? String.valueOf(runMethod.invoke(o)) : "");
							}else if((java.lang.Long.class.equals(o.getClass().getMethod(transGetColName(i)).getReturnType()))) {
								cell.setCellValue((runMethod.invoke(o)!=null) ? (Long)runMethod.invoke(o) : 0); 
							}else if((java.lang.Integer.class.equals(o.getClass().getMethod(transGetColName(i)).getReturnType()))) {
								cell.setCellValue((runMethod.invoke(o)!=null) ? (int)runMethod.invoke(o) : 0); 
							}else if((java.lang.Boolean.class.equals(o.getClass().getMethod(transGetColName(i)).getReturnType()))) {
								if(runMethod.invoke(o)!=null) {
									cell.setCellValue(((Boolean)runMethod.invoke(o)==true) ? "Y" : "N");
								}
							}
							else {
								cell.setCellValue((runMethod.invoke(o)!=null) ? String.valueOf(runMethod.invoke(o)) : ""); 
							}
							cell.setCellStyle(bodyStyleBasic);

						}
						
					}
					
					
				} catch (IllegalAccessException e) {
					LOGGER.error(e.getMessage(),e);
				} catch (IllegalArgumentException e) {
					LOGGER.error(e.getMessage(),e);
				} catch (InvocationTargetException e) {
					LOGGER.error(e.getMessage(),e);
				} catch (NoSuchMethodException e) {
					LOGGER.error(e.getMessage(),e);
				} catch (SecurityException e) {
					LOGGER.error(e.getMessage(),e);
				} catch (ParseException e) {
					LOGGER.error(e.getMessage(),e);
				}
				
				dataSubjectCnt++;

			}
			
			rowCount++;
		}

	}
	
	private String transGetColName(String inStr) {
		
		return "get"+inStr.substring(0, 1).toUpperCase() + inStr.substring(1);
	}

	
	
	public void setStyle(XSSFWorkbook workbook) {
		//1.셀 스타일 및 폰트 설정
		headerStyle = workbook.createCellStyle();
		//정렬
		headerStyle.setAlignment(HorizontalAlignment.CENTER); //가운데 정렬
		headerStyle.setVerticalAlignment(VerticalAlignment.CENTER); //높이 가운데 정렬

		//배경
		headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.index); //색 설정 
		headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND); //색 패턴 설정

		//테두리 선 (우,좌,위,아래)
		headerStyle.setBorderRight(BorderStyle.THIN);
		headerStyle.setBorderLeft(BorderStyle.THIN);
		headerStyle.setBorderTop(BorderStyle.THIN);
		headerStyle.setBorderBottom(BorderStyle.THIN);
		//폰트 설정
		// XSSFFont headerFont = workbook.createFont();
		Font headerFont = workbook.createFont();
		headerFont.setFontName("Verdana"); //글씨체
		headerFont.setFontHeightInPoints((short)10); //사이즈
		headerFont.setBold(true); //볼드 (굵게)
		headerStyle.setWrapText(true);
		headerStyle.setFont(headerFont);
		
		//1.셀 스타일 및 폰트 설정
		bodyStyleBasic = workbook.createCellStyle();
		//정렬
		bodyStyleBasic.setAlignment(HorizontalAlignment.LEFT); //가운데 정렬
		bodyStyleBasic.setVerticalAlignment(VerticalAlignment.CENTER); //높이 가운데 정렬

		//테두리 선 (우,좌,위,아래)
		bodyStyleBasic.setBorderRight(BorderStyle.THIN);
		bodyStyleBasic.setBorderLeft(BorderStyle.THIN);
		bodyStyleBasic.setBorderTop(BorderStyle.THIN);
		bodyStyleBasic.setBorderBottom(BorderStyle.THIN);
		//폰트 설정
		// XSSFFont bodyBasicFont = workbook.createFont();
		Font bodyBasicFont = workbook.createFont();
		bodyBasicFont.setFontName("Verdana"); //글씨체
		bodyBasicFont.setFontHeightInPoints((short)9); //사이즈
		bodyStyleBasic.setWrapText(true);
		bodyStyleBasic.setFont(bodyBasicFont);
		
		//1.셀 스타일 및 폰트 설정
		bodyStylePrice = workbook.createCellStyle();
		//정렬
		bodyStylePrice.setAlignment(HorizontalAlignment.RIGHT); //가운데 정렬
		bodyStylePrice.setVerticalAlignment(VerticalAlignment.CENTER); //높이 가운데 정렬

		//테두리 선 (우,좌,위,아래)
		bodyStylePrice.setBorderRight(BorderStyle.THIN);
		bodyStylePrice.setBorderLeft(BorderStyle.THIN);
		bodyStylePrice.setBorderTop(BorderStyle.THIN);
		bodyStylePrice.setBorderBottom(BorderStyle.THIN);
		//폰트 설정
		// XSSFFont bodyPriceFont = workbook.createFont();
		Font bodyPriceFont = workbook.createFont();
		bodyPriceFont.setFontName("Verdana"); //글씨체
		bodyPriceFont.setFontHeightInPoints((short)9); //사이즈
		bodyStylePrice.setWrapText(true);
		bodyStylePrice.setFont(bodyPriceFont);
		
		bodyStylePrice.setDataFormat(HSSFDataFormat.getBuiltinFormat("#,##0"));
		
		//1.셀 스타일 및 폰트 설정
		bodyStyleNumber = workbook.createCellStyle();
		//정렬
		bodyStyleNumber.setAlignment(HorizontalAlignment.RIGHT); //가운데 정렬
		bodyStyleNumber.setVerticalAlignment(VerticalAlignment.CENTER); //높이 가운데 정렬

		//테두리 선 (우,좌,위,아래)
		bodyStyleNumber.setBorderRight(BorderStyle.THIN);
		bodyStyleNumber.setBorderLeft(BorderStyle.THIN);
		bodyStyleNumber.setBorderTop(BorderStyle.THIN);
		bodyStyleNumber.setBorderBottom(BorderStyle.THIN);
		//폰트 설정
		// XSSFFont bodyNumberFont = workbook.createFont();
		Font bodyNumberFont = workbook.createFont();
		bodyNumberFont.setFontName("Verdana"); //글씨체
		bodyNumberFont.setFontHeightInPoints((short)9); //사이즈
		bodyStyleNumber.setWrapText(true);
		bodyStyleNumber.setFont(bodyNumberFont);
		
		//1.셀 스타일 및 폰트 설정
		bodyStyleDateTime = workbook.createCellStyle();
		//정렬
		bodyStyleDateTime.setAlignment(HorizontalAlignment.RIGHT); //가운데 정렬
		bodyStyleDateTime.setVerticalAlignment(VerticalAlignment.CENTER); //높이 가운데 정렬

		//테두리 선 (우,좌,위,아래)
		bodyStyleDateTime.setBorderRight(BorderStyle.THIN);
		bodyStyleDateTime.setBorderLeft(BorderStyle.THIN);
		bodyStyleDateTime.setBorderTop(BorderStyle.THIN);
		bodyStyleDateTime.setBorderBottom(BorderStyle.THIN);
		//폰트 설정
		// XSSFFont bodyDateTimeFont = workbook.createFont();
		Font bodyDateTimeFont = workbook.createFont();
		bodyDateTimeFont.setFontName("Verdana"); //글씨체
		bodyDateTimeFont.setFontHeightInPoints((short)9); //사이즈
		bodyStyleDateTime.setWrapText(true);
		bodyStyleDateTime.setFont(bodyDateTimeFont);
		
		CreationHelper creationHelper = workbook.getCreationHelper();
		
		bodyStyleDateTime.setDataFormat(creationHelper.createDataFormat().getFormat(
				"yyyy-mm-dd hh:mm:ss"));
		
		
		//1.셀 스타일 및 폰트 설정
		bodyStyleDate = workbook.createCellStyle();
		//정렬
		bodyStyleDate.setAlignment(HorizontalAlignment.RIGHT); //가운데 정렬
		bodyStyleDate.setVerticalAlignment(VerticalAlignment.CENTER); //높이 가운데 정렬

		//테두리 선 (우,좌,위,아래)
		bodyStyleDate.setBorderRight(BorderStyle.THIN);
		bodyStyleDate.setBorderLeft(BorderStyle.THIN);
		bodyStyleDate.setBorderTop(BorderStyle.THIN);
		bodyStyleDate.setBorderBottom(BorderStyle.THIN);
		//폰트 설정
		// XSSFFont bodyDateFont = workbook.createFont();
		Font bodyDateFont = workbook.createFont();
		bodyDateFont.setFontName("Verdana"); //글씨체
		bodyDateFont.setFontHeightInPoints((short)9); //사이즈
		bodyStyleDate.setWrapText(true);
		bodyStyleDate.setFont(bodyDateFont);
		
		bodyStyleDate.setDataFormat(creationHelper.createDataFormat().getFormat(
				"yyyy-mm-dd"));
	}
	

	public void writeHeaderRow(String subjectRow) {
		
		int colIndex = 0;
		List<String> list = new ArrayList<String>();
		
		if(StringUtils.isNotEmpty(subjectRow)){
			list = Arrays.asList(subjectRow.split(";"));
			
			Row row = sheet.createRow(0);
			Cell cell = null;

			for(String i : list){
				cell = row.createCell(colIndex);
				cell.setCellValue(i);
				cell.setCellStyle(headerStyle);
				
				sheet.autoSizeColumn(colIndex);
				sheet.setColumnWidth(colIndex, (sheet.getColumnWidth(colIndex)) + 700); //임의로 세팅
					
				colIndex++;
			}
		}
	}
	
	public void export(HttpServletResponse response) throws IOException {

		ServletOutputStream outputStream = response.getOutputStream();
		
		workbook.write(outputStream);
		workbook.close();
		outputStream.close();
	}


	public List<Object> getList() {
		return list;
	}


	public void setList(List<Object> list) {
		this.list = list;
	}
	
}
