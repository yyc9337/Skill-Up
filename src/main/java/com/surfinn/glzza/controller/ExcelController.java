package com.surfinn.glzza.controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.surfinn.glzza.service.ExcelExporterService;
import com.surfinn.glzza.service.ExcelService;


@Controller
@RequestMapping("excel")
public class ExcelController {

	@Autowired
	private ExcelService excelService;

	@RequestMapping(value = "/serviceName/{serviceName}/fileName/{fileName}", produces = "application/vnd.ms-excel", method = RequestMethod.GET)
	@ResponseStatus(HttpStatus.OK)
	public void getCodeGroupItem(@PathVariable(value = "serviceName") String serviceName, @PathVariable(value = "fileName") String fileName, 
	HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String, String> map) throws IOException {

		SimpleDateFormat DateFormat = new SimpleDateFormat("yyyyMMddHHmmss");

		String nowDateStr = DateFormat.format(new Date());

		String headerKey = "Content-Disposition";
		String headerValue = "attachment; filename=".concat(fileName).concat("_").concat(nowDateStr).concat(".xlsx");

		response.setContentType("application/octet-stream");
		response.setHeader(headerKey, headerValue);

		ExcelExporterService excelExporter = new ExcelExporterService(fileName);
		excelService.makeExcel(serviceName, fileName, map, excelExporter);
		excelExporter.export(response);
		
	}
	
}
