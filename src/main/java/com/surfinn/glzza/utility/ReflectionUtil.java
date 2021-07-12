package com.surfinn.glzza.utility;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.*;

public class ReflectionUtil
{
    private static final Logger LOGGER = LoggerFactory.getLogger(ReflectionUtil.class);
    private static final Class<?>[] EMPTY_CLAZZ = new Class<?>[] {};

    public static boolean isPrimitive(Object obj)
    {
        if (obj == null)
        {
            return false;
        }
        Class<?> clazz = obj.getClass();
        return isPrimitive(clazz);
    }

    /**
     * String class도 primitive 타입으로 처리한다.
     * 
     * @param clz
     * @return
     */
    public static boolean isPrimitive(Class<?> clz)
    {
        if (clz.isPrimitive())
            return true;
        return clz == Integer.class || clz == Byte.class || clz == Short.class || clz == Double.class
            || clz == Float.class || clz == Long.class || clz == Boolean.class || clz == String.class;
    }

    public static boolean isStringType(Class<?> clz)
    {
        if (clz == null)
        {
            return false;
        }
        return clz == String.class || clz == StringBuffer.class || clz == StringBuilder.class;
    }

    public static int getArraySize(Object arrobj)
    {
        if (arrobj == null)
        {
            return -1;
        }
        return Array.getLength(arrobj);
    }

    public static Field findField(Class<?> clz, String fieldName) throws NoSuchFieldException
    {
        Class<?> current = clz;
        while (current != null && current != Object.class)
        {
            Field[] fs = current.getDeclaredFields();
            for (Field f : fs)
            {
                if (f.getName().equals(fieldName))
                {
                    f.setAccessible(true);
                    return f;
                }
            }
            current = current.getSuperclass();
        }
        throw new NoSuchFieldException("Not found field. fieldName:" + fieldName + " in class:" + clz.getName());
    }

    

    public static Class<?>[] getParameterizedTypes(Field f)
    {
        Type type = f.getGenericType();
        return getParameterizedTypes(type);
    }

    public static Class<?>[] getParameterizedTypes(Type type)
    {
        if (type instanceof ParameterizedType)
        {
            Type[] pTypes = ((ParameterizedType) type).getActualTypeArguments();
            Class<?>[] arr = new Class<?>[pTypes.length];
            int i = 0;
            for (Type pType : pTypes)
            {
                arr[i++] = (Class<?>) pType;
                // System.out.println(pType);
            }
            return arr;
        }
        return EMPTY_CLAZZ;
    }

    public static List<Field> getNonStaticFields(Class<?> tclz)
    {
        List<Field> fields = new LinkedList<>();
        Class<?> current = tclz;
        while (current != Object.class)
        {
            Field[] fs = current.getDeclaredFields();
            for (Field f : fs)
            {
                if (java.lang.reflect.Modifier.isStatic(f.getModifiers()))
                {
                    continue;
                }
                fields.add(f);
            }
            if (current.getSuperclass() == null)
            {
                LOGGER.debug("Super class is null for class > {}", current.getName());
                break;
            }
            current = current.getSuperclass();
        }
        return fields;
    }

    public static boolean isBooleanClass(Class<?> clz)
    {
        return clz == boolean.class || clz == Boolean.class;
    }

    public static boolean isDateClass(Class<?> clz)
    {
        return clz == Date.class || clz == java.sql.Date.class || Calendar.class.isAssignableFrom(clz);
    }

    public static boolean isArrayOrListClass(Class<?> clz)
    {
        return List.class.isAssignableFrom(clz) || clz.isArray();
    }

    public static boolean isStringTypeClass(Class<?> clz)
    {
        return clz == String.class || clz == StringBuffer.class || clz == StringBuilder.class;
    }

    public static Object convertString2PrimitiveTypeValue(Class<?> clz, String value)
    {
        if (value == null)
            return value;
        if (clz == String.class)
        {
            return value;
        } else if (clz == int.class || clz == Integer.class)
        {
            return Integer.parseInt(value.trim());
        } else if (clz == byte.class || clz == Byte.class)
        {
            return Byte.parseByte(value.trim());
        } else if (clz == short.class || clz == Short.class)
        {
            return Short.parseShort(value.trim());
        } else if (clz == double.class || clz == Double.class)
        {
            return Double.parseDouble(value.trim());
        } else if (clz == float.class || clz == Float.class)
        {
            return Float.parseFloat(value.trim());
        } else if (clz == long.class || clz == Long.class)
        {
            return Long.parseLong(value.trim());
        } else if (clz == boolean.class || clz == Boolean.class)
        {
            return Boolean.valueOf(value.trim());
        }
        if (LOGGER.isDebugEnabled())
        {
            LOGGER.debug("type:{} is not primitive type", clz.getName());
        }
        return null;
    }

    public static boolean isIncludedInType(Class<?> pType, Class<?> checkType)
    {
        BeanInfo beanInfo;
        try
        {
            beanInfo = Introspector.getBeanInfo(pType);
            if (beanInfo != null)
            {
                PropertyDescriptor[] pds = beanInfo.getPropertyDescriptors();
                if (pds != null)
                {
                    for (PropertyDescriptor pd : pds)
                    {
                        if (pd.getPropertyType() == checkType)
                        {
                            return true;
                        }
                    }
                }
            }
        } catch (IntrospectionException e)
        {
            if (LOGGER.isWarnEnabled())
            {
                LOGGER.warn(e.getMessage(), e);
            }
        }
        return false;
    }

    public static List<PropertyDescriptor> getPropertyDescriptors(Class<?> clazz)
    {
        if (clazz == null)
        {
            return null;
        }

        if (ReflectionUtil.isPrimitive(clazz))
        {
            return null;
        }

        List<PropertyDescriptor> propertyList = new ArrayList<>();

        try
        {
            BeanInfo beanInfo = Introspector.getBeanInfo(clazz);
            if (beanInfo != null)
            {
                PropertyDescriptor[] descriptors = beanInfo.getPropertyDescriptors();
                if (descriptors != null)
                {
                    for (PropertyDescriptor descriptor : descriptors)
                    {
                        if (descriptor.getPropertyType() == Class.class)
                        {
                            continue;
                        }
                        propertyList.add(descriptor);
                    }
                }
            }
        } catch (IntrospectionException e)
        {
            if (LOGGER.isWarnEnabled())
            {
                LOGGER.warn(e.getMessage(), e);
            }
        }

        return propertyList;
    }
}
