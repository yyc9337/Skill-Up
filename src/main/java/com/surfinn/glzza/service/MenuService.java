package com.surfinn.glzza.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surfinn.glzza.dao.MenuDao;
import com.surfinn.glzza.vo.MenuVO;

@Service
public class MenuService {
	
	@Autowired
	private MenuDao menuDao;

	public List<MenuVO> selectMenuList() {
		return menuDao.selectMenuList();
	}

}
