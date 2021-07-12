package com.surfinn.glzza.mybatis.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.surfinn.glzza.vo.UserVO;

@Mapper
public interface MainMapper {

	int duplicationIdCheck(UserVO userVO);

	int signupId(UserVO userVO);

	int loginWeb(UserVO userVO);

}
