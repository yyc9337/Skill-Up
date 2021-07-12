package com.surfinn.glzza.controller;

import java.security.NoSuchAlgorithmException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.surfinn.glzza.service.MainService;
import com.surfinn.glzza.utility.JsonUtil;
import com.surfinn.glzza.utility.SuccessResponse;
import com.surfinn.glzza.vo.SessionVO;
import com.surfinn.glzza.vo.UserVO;

@Controller
public class MainController {
	
	
	@Autowired
	private MainService mainService;
	
	@RequestMapping("/")
    public String open(){
        return "redirect:/login";
    }

    @RequestMapping("/openGlzza")
    public String openGlzza(HttpServletRequest request){
        HttpSession session = request.getSession(false);
        if(session != null){
            SessionVO sesionVO = (SessionVO) session.getAttribute("SessionVO");
            if(sesionVO == null ){
                return "loginView/login";
            }else{
                return "content";
            }
        }else{
            return "loginView/login";
        }
    }
    
    @RequestMapping("/login")
    public ModelAndView loginCheck(HttpServletRequest request, UserVO vo){
        HttpSession session = request.getSession(false);
        ModelAndView mv = new ModelAndView();
        mv.setViewName("loginView/login");
        if(session != null){
            SessionVO sessionVO = (SessionVO) session.getAttribute("SessionVO");
            if(sessionVO == null) {
                mv.addObject("userId", vo.getLoginId());
                return mv;
            }else {
                mv.setViewName("content");
                return mv;
            } //commit test
        }else{
            mv.addObject("userId",vo.getLoginId());
            return mv;
        }

    }
    
    @RequestMapping("/signup")
    public String signUp(){
        return "loginView/signup";
    }
    
    @GetMapping("/duplicationIdCheck")
    @ResponseBody
	public SuccessResponse<Integer> duplicationIdCheck(UserVO userVO){  	
		int result = mainService.duplicationIdCheck(userVO);
		return new SuccessResponse<>(result);
	}
    
    @PostMapping("/signupId")
    @ResponseBody
    public SuccessResponse<Integer> signupId(@RequestBody UserVO userVO) throws NoSuchAlgorithmException{
    	int result = mainService.signupId(userVO);
    	return new SuccessResponse<>(result);
    }
    
    
    @GetMapping("/loginWeb")
    @ResponseBody
	public String loginWeb(HttpServletRequest request, UserVO userVO) throws NoSuchAlgorithmException, JsonProcessingException{  	
    	int result = mainService.loginWeb(userVO);
    	
    	if(result >= 1) {
            HttpSession session = request.getSession(false);
            if(session != null) {
                session.invalidate();
            }

            session = request.getSession(true);
            SessionVO sessionVO = new SessionVO();
            sessionVO.setUserId(userVO.getLoginId());
            sessionVO.setUserNm(userVO.getUserNm());
            session.setAttribute("SessionVO", sessionVO);

            return JsonUtil.parseJsonObject(result);
        } else {
            return JsonUtil.parseJsonObject("0");
        }

	}
    
    @RequestMapping(value = "/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response){
        HttpSession session = request.getSession();

        if(session != null) {
            session.invalidate();
        }

        return "redirect:/login";
    }
    
}
