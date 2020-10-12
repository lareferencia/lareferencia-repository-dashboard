package org.lareferencia.backend.metadata;

import java.util.ArrayList;
import java.util.List;

import org.lareferencia.backend.metadata.OAIMetadataElement.Type;

public class XOAIXPATHHelper {

	private static String XPATH_XOAI_RECORD_ROOT = "/*[local-name()='metadata']";
	private static String ELEMENT_SEPARATOR = "\\.";
	private static String FIELD_SEPARATOR = ":";

	
	public static String getRootXPATH() {
		return XPATH_XOAI_RECORD_ROOT;
	}
	
	
	public static String getXPATH(String fieldName) {
		return getXPATH(fieldName,true,true);
	}

	public static String getXPATH(String fieldName, Boolean includeFieldNodes, Boolean includeDocumentRoot) {
		
		List<OAIMetadataElement> elements = getXPATHList(fieldName, false, includeDocumentRoot );
		
		StringBuffer stringBuffer = new StringBuffer();
		
		for (OAIMetadataElement elem:elements) {
			
			if ( elem.type != Type.field || includeFieldNodes )
				stringBuffer.append( elem.getXpath() );
		}
		
		return stringBuffer.toString();
	}
	
	
	
	public static List<OAIMetadataElement> getXPATHList(String fieldName) {
		return getXPATHList(fieldName,true,true);
	}
	
	private static List<OAIMetadataElement> getXPATHList(String fieldName, boolean fullXPATHForEachElement, boolean includeDocumentRoot) {
		
		
		String[] elementParts = fieldName.split(ELEMENT_SEPARATOR);
		int lastElementIndex = elementParts.length-1;
		String field = null;
		
		String xpath = "/";
		
		if ( includeDocumentRoot )
			xpath = XPATH_XOAI_RECORD_ROOT;
		
		
		List<OAIMetadataElement> result = new ArrayList<>(elementParts.length + 1);
		
		
		if ( !fieldName.equals("") ) { // only if fieldName != ""
		
			/// Parsing of the field expression: dc.type:field
			if ( elementParts[lastElementIndex].contains(FIELD_SEPARATOR) ) {
				
					String[] fieldParts = elementParts[lastElementIndex].split(FIELD_SEPARATOR);
					elementParts[lastElementIndex] = fieldParts[0];
					field = fieldParts[1];
			}
			
			for (int i=0; i<elementParts.length; i++) {
	
				OAIMetadataElement elem = new OAIMetadataElement();
				String name = elem.name = elementParts[i];
				
				elem.type = OAIMetadataElement.Type.element;
			
				if ( elem.name.equals("*") )
					elem.xpath = xpath += "//*[local-name()='element']";
				
				// en caso de terminar con $ trunca el proceso y devuelve el xpath de esos elementos sin fields
				else if ( elem.name.equals("$") ) {
					elem.xpath = xpath; //+= "/*";
					result.add(elem);
					return result;
				}	
				else
					elem.xpath = xpath += "/*[local-name()='element' and @name='" + name  +"']";
	
				result.add( elem );
				
				// reset xpath if not full xpath is true
				if (!fullXPATHForEachElement)
					xpath = "";
	
			}
		} // end of if fieldName != ""
		
		OAIMetadataElement elem = new OAIMetadataElement();
		elem.type = OAIMetadataElement.Type.field;
		
		if ( field != null ) {
			// case -- dc.type:value	
			elem.name = field;
			elem.xpath =  xpath + "/*[local-name()='field' and @name='" + field  +"']";
		}
		else {
			// case -- dc.type
			elem.name = "value";
			elem.xpath =  xpath + "/*[local-name()='field' and @name='value']";	
		}
			
		result.add(elem);
			 
		return result;
	}
	
	
	
	
	

}
