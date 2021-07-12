package com.surfinn.glzza.utility;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;

public class AESUtil {
	/* AES_128_CBC Key 생성 함수 */
	public static Key getAESKey() throws UnsupportedEncodingException {
		Key keySpec;

		String key = "3BBTV_za0728hu00";
		// iv = key.substring(0, 16);
		byte[] keyBytes = new byte[16];
		byte[] b = key.getBytes("UTF-8");

		int len = b.length;
		if (len > keyBytes.length) {
			len = keyBytes.length;
		}

		System.arraycopy(b, 0, keyBytes, 0, len);
		keySpec = new SecretKeySpec(keyBytes, "AES");

		return keySpec;
	}

	// 암호화
	public static String encAES(String systemCode, String id)
			throws IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException, InvalidKeyException,
			InvalidAlgorithmParameterException, NoSuchAlgorithmException, NoSuchPaddingException {

		String str = "id=" + id + "&pwd=" + systemCode;

		Key keySpec = getAESKey();
		String iv = "0987654321654321";
		Cipher c = Cipher.getInstance("AES/CBC/PKCS5Padding");
		c.init(Cipher.ENCRYPT_MODE, keySpec, new IvParameterSpec(iv.getBytes("UTF-8")));
		byte[] encrypted = c.doFinal(str.getBytes("UTF-8"));
		String enStr = new String(Base64.encodeBase64(encrypted));

		return enStr;
	}

	// 복호화
	public static String decAES(String enStr)
			throws InvalidKeyException, InvalidAlgorithmParameterException, UnsupportedEncodingException,
			IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, NoSuchPaddingException {
		Key keySpec = getAESKey();
		Cipher c = Cipher.getInstance("AES/CBC/PKCS5Padding");
		String iv = "0987654321654321";
		c.init(Cipher.DECRYPT_MODE, keySpec, new IvParameterSpec(iv.getBytes("UTF-8")));
		byte[] byteStr = Base64.decodeBase64(enStr.getBytes("UTF-8"));
		String decStr = new String(c.doFinal(byteStr), "UTF-8");

		return decStr;
	}
}
