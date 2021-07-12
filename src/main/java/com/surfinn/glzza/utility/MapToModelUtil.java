package com.surfinn.glzza.utility;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.surfinn.glzza.core.CommonConst;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//import com.kt.tbb.iptv.coupon.framework.CpnCodes;
//import com.kt.tbb.iptv.coupon.framework.CpnCodes.Common;
//import com.kt.tbb.iptv.coupon.framework.CommonConst;
//import com.kt.tbb.iptv.coupon.framework.log.CpnLoggers;

public class MapToModelUtil {
	private static final Logger LOGGER = LoggerFactory.getLogger(MapToModelUtil.class);


    
	private static void invokeMethodSiently(Object obj, Method m, Object val) {
		try
		{
			m.invoke(obj, val);
		} catch (Exception ex)
		{
			LOGGER.error(ex.getMessage(), ex);
		}
	}
	private static Object invokeGetMethod(Object o, Method m) {
		Object obj = new Object();
		try
		{
			obj = m.invoke(o);
			if(ObjectUtils.isEmpty(obj)) {
				obj = StringUtils.EMPTY;
			}
		}catch (Exception e)
		{
			LOGGER.error(e.getMessage(), e);
			return StringUtils.EMPTY;
		}
		
		return obj;
	}

	public static Object convertMapToObject(Map<String, String> map, Object objClass) {
		List<PropertyDescriptor> propertyDescriptors = ReflectionUtil.getPropertyDescriptors(objClass.getClass());
		Map<String, PropertyDescriptor> namePdMap = new HashMap<>();

		if(map == null) {
			return objClass;
		}
		
		for (PropertyDescriptor pd : propertyDescriptors) {
			String pdName = pd.getName();
			namePdMap.put(pdName, pd);
		}

		for (Map.Entry<String, String> entry : map.entrySet()) {
			String key = entry.getKey();
			String val = entry.getValue();

			if (StringUtils.isEmpty(val )) {
				continue;
			}

			PropertyDescriptor pd = namePdMap.get(key);
			
			if (pd == null) {
				LOGGER.debug(" There is no key. >> " + key);
				continue;
			}
			Class<?> propertyType = pd.getPropertyType();
			
			Object resultValue = null;

			if (ReflectionUtil.isPrimitive(propertyType)) {
				if(propertyType == Boolean.class) {
					if(val.equals("true") || val.equals("1")) {
						val = "true";
					}else {
						val = "false";
					}
				}
				resultValue = ReflectionUtil.convertString2PrimitiveTypeValue(propertyType, val);
			} 
//			else if (CpnCodes.Common.class.isAssignableFrom(propertyType)) {
//				Class clz = propertyType;
//				resultValue = CpnCodes.enumByValue(clz, val);
//				if (resultValue == null) {
//					resultValue = CpnCodes.enumByCode(clz, NumberUtils.toLong(val, 0));
//				}
//			} 
			else if (Date.class.isAssignableFrom(propertyType))
			{
//				if(val.matches(CommonConst.REX_DATE)) {					
//					resultValue = DateUtil.parseDate(val, CommonConst.PTN_DATE);
//				}else if (val.matches(CommonConst.REX_TIMESTAMP)){
//					resultValue = DateUtil.parseDate(val, CommonConst.PTN_TIMESTAMP);
//				}
			}
			
			if (resultValue != null) {
				invokeMethodSiently(objClass, pd.getWriteMethod(), resultValue);
			}
		}

		LOGGER.debug("Map To Model result >> " + objClass);
		return objClass;
	}
	public static Map<String, String> converObjectToMap(Object obj){
		try {
			List<PropertyDescriptor> propertyDescriptors = ReflectionUtil.getPropertyDescriptors(obj.getClass());
			Map<String, String> resultMap = new HashMap<String, String>();
			for(PropertyDescriptor pd : propertyDescriptors) {
				resultMap.put(pd.getName(), invokeGetMethod(obj, pd.getReadMethod()).toString());
			}
			
			return resultMap;
		} catch (IllegalArgumentException e) {
			return null;
		}
			 
	}
	
	private static void classInvoke(Method method, Object objClass, Class cls, String param)
	{
		try
		{
			LOGGER.info(method.getName());
			LOGGER.info("{}", cls);
			LOGGER.info("---------------------------------------");
			if (cls == Integer.class || cls == int.class)
			{
				method.invoke(objClass, Integer.valueOf(param));
			} else if (cls == Long.class)
			{
				method.invoke(objClass, Long.valueOf(param));
			} else if (cls == String.class)
			{
				method.invoke(objClass, param);
			} 
//			else if (Common.class.isAssignableFrom(cls))
//			{
//				method.invoke(objClass, CpnCodes.enumByValue(cls, param));
//			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}
	}
}
