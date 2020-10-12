package org.lareferencia.backend.metadata;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OAIMetadataElement {
	
	String name;
	Type type;
	String xpath;
	
	
	public enum Type {
		element, field
	}

}


