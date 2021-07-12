package com.surfinn.glzza.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.surfinn.glzza.vo.MenuVO;

@Mapper
public interface MenuMapper {

	List<MenuVO> selectMenuList();

}
