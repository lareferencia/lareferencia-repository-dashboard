package org.lareferencia.backend.metadata;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Arrays;
import java.util.List;

public class MDTransformerParameterSetter {

	public static void setParametersFromObject(IMDFormatTransformer transformer, String parameterNamePrefix, Object obj) {

		if ( obj != null && parameterNamePrefix != null ) {
		
			Class<?> objClass = obj.getClass();
			Method[] methods = objClass.getDeclaredMethods();
	
	
			// for each field in class obtained by reflection
			for(Method method:methods) { 
	
				// if field is a public instance field
				if ( !Modifier.isStatic(method.getModifiers()) && method.getName().startsWith("get")  ) {
	
					try {
	
						// obtain the value of the field for object obj
						Object valueOfResult = method.invoke(obj);
	
						if ( valueOfResult != null ) { // if value is not null
							// set the parameter using the prefixed name of field and the string value of the field 
							String fieldName = parameterNamePrefix + method.getName().substring(3).toLowerCase(); 
							if (valueOfResult instanceof String[]) {
								List<String> items = Arrays.asList((String[])valueOfResult);
								transformer.setParameter(fieldName, items);
							} else {
								transformer.setParameter(fieldName, valueOfResult.toString() );
							}
						}
	
					} catch (IllegalArgumentException | IllegalAccessException e) {
						e.printStackTrace();
					} catch (InvocationTargetException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			} 
		}
	}
}
