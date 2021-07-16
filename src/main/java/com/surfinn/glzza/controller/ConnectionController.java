package com.surfinn.glzza.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

//페이지 연결 컨트롤러 
@Controller
public class ConnectionController {

    @RequestMapping("/domain/info")
    public String connectionMailInfoView(){
        return "domainView/domain";
    }

    @RequestMapping("/word/info")
    public String connectionWordInfo(){
	    return "wordView/word";
    }

    @RequestMapping("/word/info2")
    public String connectionWordInfo2() { return "wordView/word2"; }
	
    @RequestMapping("/term/info")
    public String connectionTermView(){
        return "termView/term";
    }
    
    @RequestMapping("/code/domainCodeinfo")
    public String connectionDataView(){
        return "codeView/domainCode";
    }
    
}
