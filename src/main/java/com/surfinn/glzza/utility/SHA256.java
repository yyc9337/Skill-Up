package com.surfinn.glzza.utility;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class SHA256 {
	public static String encryptSHA256(String value) throws NoSuchAlgorithmException{
	     StringBuffer encryptData = new StringBuffer();
	     MessageDigest sha = MessageDigest.getInstance("SHA-256");
	     
	     sha.update(value.getBytes());
	     
	     byte[] digest = sha.digest();
	     
	     for (int i=0; i<digest.length; i++) {
	    	 encryptData.append(String.format("%02x", digest[i] & 0xFF));
	     }
	     
	     return encryptData.toString();
	 }
}
