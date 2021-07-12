package com.surfinn.glzza.utility;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

@Slf4j
public class DBEncryptionUtil {
//    final static String secretKey = "jmlim12345bbbbbaaaaa123456789066"; //32bit
//	"38c19f8a-e95d-499c-9510-db77f5d93c47";
	static String key = "38c19f8a-e95d-499c-9510-db77f5d9";
	static String secretKey = key.substring(0, 32); // 32bit
	static String IV = secretKey.substring(0, 16); // 16bit

//	private static volatile DBEncryptionUtil INSTANCE;
//	public static DBEncryptionUtil getInstance() {
//		if (INSTANCE == null) {
//			synchronized (DBEncryptionUtil.class) {
//				if (INSTANCE == null)
//					INSTANCE = new DBEncryptionUtil();
//			}
//		}
//		return INSTANCE;
//	}
//
//	private DBEncryptionUtil() {
//	}

	public static void setKey(String pKey) {
		key = pKey;
		secretKey = key.substring(0, 32); // 32bit
		IV = secretKey.substring(0, 16); // 16bit
	}
	
	public static String getKey() {
		return key;
	}
	
	// 암호화
	public static String encode(String str) {
		if(str == null) {
			return null;
		}
		else if(StringUtils.isEmpty(str)) {
			return "";
		}
		String enStr = "";
		try {
			byte[] keyData = secretKey.getBytes();

			SecretKey secureKey = new SecretKeySpec(keyData, "AES");

			Cipher c = Cipher.getInstance("AES/CBC/PKCS5Padding");
			c.init(Cipher.ENCRYPT_MODE, secureKey, new IvParameterSpec(IV.getBytes()));

			byte[] encrypted = c.doFinal(str.getBytes("UTF-8"));
			enStr = new String(Base64.encodeBase64(encrypted));
		} catch (Exception e) {
			enStr = "";
			log.error(e.toString(), e);
		}

		return enStr;
	}

	// 복호화
	public static String decode(String str) {
		if(str == null) {
			return null;
		}
		else if(StringUtils.isEmpty(str)) {
			return "";
		}
		String deStr = "";
		try {
			byte[] keyData = secretKey.getBytes();
			SecretKey secureKey = new SecretKeySpec(keyData, "AES");
			Cipher c = Cipher.getInstance("AES/CBC/PKCS5Padding");
			c.init(Cipher.DECRYPT_MODE, secureKey, new IvParameterSpec(IV.getBytes("UTF-8")));

			byte[] byteStr = Base64.decodeBase64(str.getBytes());

			deStr = new String(c.doFinal(byteStr), "UTF-8");
		} catch (Exception e) {
			deStr = "";
			log.error(e.toString(), e);
		}

		return deStr;
	}

	
	
	
	// 암호화
	public static String keyEncode(String key, String str) {
		if(str == null) {
			return null;
		}
		else if(StringUtils.isEmpty(str)) {
			return "";
		}
		else if(StringUtils.isEmpty(key)) {
			return str;
		}
		String enStr = "";
		
		String renewalSecretKey = key.substring(0, 32);
		String renewalIV = renewalSecretKey.substring(0, 16);
		
		try {
			byte[] keyData = renewalSecretKey.getBytes();

			SecretKey secureKey = new SecretKeySpec(keyData, "AES");

			Cipher c = Cipher.getInstance("AES/CBC/PKCS5Padding");
			c.init(Cipher.ENCRYPT_MODE, secureKey, new IvParameterSpec(renewalIV.getBytes()));

			byte[] encrypted = c.doFinal(str.getBytes("UTF-8"));
			enStr = new String(Base64.encodeBase64(encrypted));
		} catch (Exception e) {
			enStr = "";
			log.error(e.toString(), e);
		}

		return enStr;
	}

	// 복호화
	public static String keyDecode(String key, String str) {
		if(str == null) {
			return null;
		}
		else if(StringUtils.isEmpty(str)) {
			return "";
		}
		else if(StringUtils.isEmpty(key)) {
			return str;
		}
		String deStr = "";
		
		String renewalSecretKey = key.substring(0, 32);
		String renewalIV = renewalSecretKey.substring(0, 16);
		try {
			byte[] keyData = renewalSecretKey.getBytes();
			SecretKey secureKey = new SecretKeySpec(keyData, "AES");
			Cipher c = Cipher.getInstance("AES/CBC/PKCS5Padding");
			c.init(Cipher.DECRYPT_MODE, secureKey, new IvParameterSpec(renewalIV.getBytes("UTF-8")));

			byte[] byteStr = Base64.decodeBase64(str.getBytes());

			deStr = new String(c.doFinal(byteStr), "UTF-8");
		} catch (Exception e) {
			deStr = "";
			log.error(e.toString(), e);
		}

		return deStr;
	}
	
	
//	public static void main(String[] args) {
//		
//		String str = "ABCD";
//		String enc = encode(str);
//		System.out.println(encode(str));
//
//		System.out.println(decode(enc));
//	}
}
