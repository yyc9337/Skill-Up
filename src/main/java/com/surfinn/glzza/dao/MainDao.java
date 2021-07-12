package com.surfinn.glzza.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.surfinn.glzza.mybatis.mapper.MainMapper;
import com.surfinn.glzza.vo.UserVO;

@Repository
public class MainDao {
	
	@Autowired
	private MainMapper mainMapper;

	public int duplicationIdCheck(UserVO userVO) {
		return mainMapper.duplicationIdCheck(userVO);
	}

	public int signupId(UserVO userVO) {
		return mainMapper.signupId(userVO);
	}

	public int loginWeb(UserVO userVO) {
		return mainMapper.loginWeb(userVO);
	}
	
	

}
