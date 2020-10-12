package org.lareferencia.core.dashboard.service;

import java.util.Map;

public interface IValidationResult {

	Integer getSize();

	void setSize(Integer size);

	Integer getTransformedSize();

	void setTransformedSize(Integer transformedSize);

	Integer getValidSize();

	void setValidSize(Integer validSize);

	Map<String, ValidationRule> getRulesByID();

	void setRulesByID(Map<String, ValidationRule> rulesByID);

}