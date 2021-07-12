package com.surfinn.glzza.utility;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.ser.DefaultSerializerProvider;
import com.surfinn.glzza.vo.CommonResponse;

import org.json.JSONObject;
import org.json.XML;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

public class JsonUtil {
	public static String parseJsonObject(Object obj) throws JsonProcessingException {
		Object object = obj;
		try{
			ObjectMapper mapper = new ObjectMapper();
			DefaultSerializerProvider sp = new DefaultSerializerProvider.Impl();
			sp.setNullValueSerializer(new NullSerializer());
			mapper.setSerializerProvider(sp);
			
			return mapper.writeValueAsString(object);
		}finally{
			object = null;
		}
	}
	
	public static String parseJsonObjectNull(Object obj) throws JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		DefaultSerializerProvider sp = new DefaultSerializerProvider.Impl();
		mapper.setSerializerProvider(sp);
		return mapper.writeValueAsString(obj);
	}
	
	public static List<Map<String, Object>> parseStringAsList(String str) throws JsonParseException, JsonMappingException, IOException{
		ObjectMapper mapper = new ObjectMapper();
		List<Map<String, Object>> dtlList = null;
		dtlList = mapper.readValue(str, new TypeReference<List<Map<String, Object>>>(){});
		return dtlList;
	}
	
	public static JsonNode parseString(String str) throws JsonParseException, JsonMappingException, IOException{
		ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(str, JsonNode.class);
	}
	
	public static JsonNode parseObject(Object obj) throws JsonParseException, JsonMappingException, IOException{
		ObjectMapper mapper = new ObjectMapper();
		return mapper.valueToTree(obj);
	}
	
	public static <T> T checkJsonParseString(String str, Class<T> classType) throws JsonParseException, JsonMappingException, IOException{
		if(!CommonUtil.isJSONValid(str)) {
			T result = null;
			try {
				result = classType.newInstance();
				if (result instanceof CommonResponse) {
					Method setMethod = classType.getMethod("setReturnCode", String.class);
					setMethod.invoke(result, "F");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			return result;
		}
		return parseString(str, classType, true);
	}
	   
	public static <T> T parseString(String str, Class<T> classType) throws JsonParseException, JsonMappingException, IOException{
		return parseString(str, classType, true);
	}
	
	public static <T> T parseString(String str, Class<T> classType, boolean unKnownProperties) throws JsonParseException, JsonMappingException, IOException{
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, unKnownProperties);
		return mapper.readValue(str, classType);
	}
	
	public static <T> List<T> parseStringAsList(String str, Class<T> classType) throws JsonParseException, JsonMappingException, IOException{
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		List<T> dtlList = mapper.readValue(str, 
				mapper.getTypeFactory().constructCollectionType(List.class, classType));
		return dtlList;
	}
	
	public static <T> T parseString(JsonNode jsonNode, Class<T> classType) throws JsonParseException, JsonMappingException, IOException{
		ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(parseJsonObject(jsonNode), classType);
	}
	
	public static JsonNode parseXml(String xml) throws JsonParseException, JsonMappingException, IOException{
		JSONObject jObject = XML.toJSONObject(xml);
		ObjectMapper objMapper = new ObjectMapper();
		objMapper.enable(SerializationFeature.INDENT_OUTPUT);
		return objMapper.readValue(jObject.toString(), JsonNode.class);
	}
	
	public static class NullSerializer extends JsonSerializer<Object> {
        public void serialize(Object value, JsonGenerator jgen, SerializerProvider provider) throws IOException {
            jgen.writeString("");
        }
    }
}
