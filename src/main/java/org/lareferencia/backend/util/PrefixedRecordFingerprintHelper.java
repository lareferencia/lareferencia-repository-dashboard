package org.lareferencia.backend.util;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;
import org.lareferencia.backend.domain.OAIRecord;

import lombok.Getter;
import lombok.Setter;

public class PrefixedRecordFingerprintHelper implements IRecordFingerprintHelper {

	@Getter
	@Setter
	private String prefix="";
	
	@Getter
	@Setter
	private Map<String,String> translateMap = new HashMap<String,String>();
	
	
	public PrefixedRecordFingerprintHelper() {
		this.prefix = "";
		translateMap = new HashMap<String,String>();
	}

	@Override
	public String getFingerprint(OAIRecord record) {
		

//oai:repositorio.bc.ufg.br:ri/7176 foi transformado em:
//oai:agregador.ibict.br.RI_UFG:oai:repositorio.bc.ufg.br:ri/7176
		
		
		if (record.getSnapshot() != null) {
			
			String networkAcronym = record.getSnapshot().getNetwork().getAcronym();
			
			String new_identifier = prefix + record.getIdentifier();
			
			if ( translateMap != null && translateMap.containsKey(networkAcronym) ) 	
				new_identifier = prefix + "." + translateMap.get(networkAcronym) + ":" + record.getIdentifier() ;
				
				
			return  networkAcronym + "_" + DigestUtils.md5Hex(new_identifier);
			
		}
		
		else
			return "00" + "_" + DigestUtils.md5Hex(prefix + record.getIdentifier());

	
	}

}
