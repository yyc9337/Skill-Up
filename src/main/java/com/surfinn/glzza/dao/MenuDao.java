package com.surfinn.glzza.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.surfinn.glzza.mybatis.mapper.MenuMapper;
import com.surfinn.glzza.vo.MenuVO;

@Repository
public class MenuDao {
	
	@Autowired
	private MenuMapper menuMapper;

	public List<MenuVO> selectMenuList() {
		return menuMapper.selectMenuList();
	}

}
