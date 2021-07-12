package com.surfinn.glzza.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.surfinn.glzza.service.MenuService;
import com.surfinn.glzza.vo.MenuVO;

@RestController
@RequestMapping("/menu")
public class MenuController {
	
	@Autowired
	private MenuService menuService;
	
	
	@GetMapping("/list")
	@ResponseBody
	public List<MenuVO> selectMenuList() {
		return menuService.selectMenuList();
	}
	

}
