package org.lareferencia.core.dashboard.service;

import java.util.List;
import java.util.Map;

public interface IRecordValidationResult {
	
	String getId();
	String getIdentifier();
	
	Long getSnapshotID();
	
	String getOrigin();
	String getSetSpec();
	String getMetadataPrefix();
	
	Boolean getIsValid();
	Boolean getIsTransformed();
	
	Map<String, List<String>> getValidOccurrencesByRuleID();
	Map<String, List<String>> getInvalidOccurrencesByRuleID();

	List<String> getValidRulesID();
	List<String> getInvalidRulesID();
}