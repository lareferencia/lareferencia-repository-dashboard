package org.lareferencia.backend.metadata;

import org.apache.commons.codec.digest.Md5Crypt;

import lombok.Getter;
import lombok.Setter;


@Setter
public class OAIMetadataBitstream {

	public OAIMetadataBitstream() {
	}
	
	@Getter
	Integer sid;
	
	@Getter
	String type;
	
	@Getter
	String name;
	
	@Getter
	String format;
	
	@Getter
	String size;
	
	@Getter
	String url;

	String checksum;
	
	
	
	@Override
	public String toString() {
		return "OAIMetadataBundle [name=" + name + ", typet=" + type + ", url=" + url + "]";
	}



	public String getChecksum() {
		
		if ( checksum == null || checksum.equals("") ) {
			
		}
		
		return checksum;
	}
       
	
	
}
