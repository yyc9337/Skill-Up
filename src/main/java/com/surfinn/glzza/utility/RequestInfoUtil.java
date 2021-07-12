package com.surfinn.glzza.utility;

import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.surfinn.glzza.vo.SessionVO;

import javax.servlet.http.HttpServletRequest;


public class RequestInfoUtil {
	
	/**
	 * 인증된 사용자객체를 VO형식으로 가져온다.
	 * @return Object - 사용자 ValueObject
	 */
	public static SessionVO getAuthenticatedUser() {
		return (SessionVO)RequestContextHolder.getRequestAttributes().getAttribute("SessionVO", RequestAttributes.SCOPE_SESSION)==null ? 
				new SessionVO() : (SessionVO) RequestContextHolder.getRequestAttributes().getAttribute("SessionVO", RequestAttributes.SCOPE_SESSION);

	}
	
	public static HttpServletRequest getHttpServletRequest() {
		return ((ServletRequestAttributes) RequestContextHolder .getRequestAttributes()).getRequest();
	}


}
