package com.surfinn.glzza.utility;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;


public class CommonUtil {
	
	public static String System = "ADMIN"; 
	public static String loginKey = "3BBTV_za0728hu";
	
	public static List<String> langList = Arrays.asList("TH", "EN");
	public static String AprodInfoBasStr = "B";
	public static String AprodInfoDtlStr = "ODRF";
	
	public static boolean isEmpty(Object object) {
		if (object == null) {
			return true;
		} else if (object instanceof String) {
			return object.toString().length() == 0;
		} else if (object instanceof ArrayList<?>) {
			return ((ArrayList<?>) object).size() == 0;
		} else if (object instanceof List<?>) {
			return ((List<?>) object).size() == 0;
		} else {
			return false;
		}
	}
	
	public static boolean checkIp(String value) {
		String pattern = "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
		return Pattern.matches(pattern, value);		
	}
	
	public static boolean isJSONValid(String test) {
		Object json = new JSONTokener(test).nextValue();
	    if (json instanceof JSONObject || json instanceof JSONArray) {
	      return true;
	    } else {
	      return false;
	    }
	}
}
