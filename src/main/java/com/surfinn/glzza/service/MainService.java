package com.surfinn.glzza.service;

import java.security.NoSuchAlgorithmException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surfinn.glzza.core.CommonConst;
import com.surfinn.glzza.dao.MainDao;
import com.surfinn.glzza.utility.SHA256;
import com.surfinn.glzza.vo.UserVO;

@Service
public class MainService {
	
	@Autowired
	private MainDao mainDao;

	public int duplicationIdCheck(UserVO userVO) {
		return mainDao.duplicationIdCheck(userVO);
	}

	public int signupId(UserVO userVO) throws NoSuchAlgorithmException {
		
		String encryptedPassword = SHA256.encryptSHA256(userVO.getPwd());	
		userVO.setPwd(encryptedPassword);
		userVO.setRegId(CommonConst.REG_ID);
		userVO.setUpdId(CommonConst.UPD_ID);
		
		return mainDao.signupId(userVO);
	}

	public int loginWeb(UserVO userVO) throws NoSuchAlgorithmException {
		
		String encryptedPassword = SHA256.encryptSHA256(userVO.getPwd());	
		userVO.setPwd(encryptedPassword);
		
		return mainDao.loginWeb(userVO);
		// 최성욱 commit test
	}

}
