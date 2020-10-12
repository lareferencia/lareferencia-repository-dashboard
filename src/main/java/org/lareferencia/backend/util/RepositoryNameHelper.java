package org.lareferencia.backend.util;

import java.util.ArrayList;
import java.util.List;

import org.lareferencia.backend.metadata.OAIRecordMetadata;
import org.springframework.stereotype.Component;
import org.w3c.dom.Node;

@Component
public class RepositoryNameHelper {

	
	
	public RepositoryNameHelper() {
		
		/*
		try {
			pattern = Pattern.compile(DOMAIN_NAME_PATTERN_STR);
		} catch (PatternSyntaxException e) {
			logger.error("RepositoryNameHelper::Error en el patron: " +DOMAIN_NAME_PATTERN_STR);

		}*/

	}
/*
	public void setDetectREPattern(String patternString) {

		try {
			pattern = Pattern.compile(patternString);
		} catch (PatternSyntaxException e) {
			logger.error("RepositoryNameHelper::Error en el patron: " +patternString);

		}
	}


	public static final String DOMAIN_NAME_PATTERN_STR = "[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z-]{2,})";
	private static final String NAME_PATTERN_STR = "[A-Za-z0-9-]{4,}";

	public String detectRepositoryDomain(String identifier) {

		String result = UNKNOWN;

		Matcher matcher = pattern.matcher(identifier);

		if (matcher.find())
			result = matcher.group();

		return result;
	}
*/
	public static String UNKNOWN = "No clasificados";
	
	
	

	public void appendNameToMetadata(OAIRecordMetadata metadata, String fieldname, String prefix, String value, Boolean replaceExisting) {

		Node existingNode = null;

		for (Node node : metadata.getFieldNodes(fieldname)) {

			String occr = node.getFirstChild().getNodeValue();

			if (occr.startsWith(prefix))
				existingNode = node;
		}

		if (existingNode != null) {
			if (replaceExisting) {
				Node fieldNode = existingNode.getParentNode();
				fieldNode.removeChild(existingNode);
				metadata.addFieldOcurrence(fieldname, prefix + value);
			}

		} else {
			metadata.addFieldOcurrence(fieldname, prefix + value);
		}
	}
	
	public static boolean removeDuplicates(OAIRecordMetadata metadata, String fieldname, String prefix) {
		
		List<Node> matchingNodeList = new ArrayList<Node>();
		
		for (Node node : metadata.getFieldNodes(fieldname)) {

			String occr = node.getFirstChild().getNodeValue();

			if ( occr.startsWith(prefix) )
				matchingNodeList.add(node);
		}
		
		if ( matchingNodeList.size() > 1 ) {
			matchingNodeList.remove(0);
			
			for (Node node : matchingNodeList) {
				metadata.removeNode(node);
			}
			
			return true;
		} else 
			return false;

	}

}
