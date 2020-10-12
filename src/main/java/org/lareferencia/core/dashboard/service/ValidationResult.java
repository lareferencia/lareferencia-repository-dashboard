package org.lareferencia.core.dashboard.service;

import java.util.HashMap;
import java.util.Map;


public class ValidationResult implements IValidationResult {

	@Override
	public Integer getSize() {
		return size;
	}
	@Override
	public void setSize(Integer size) {
		this.size = size;
	}
	@Override
	public Integer getTransformedSize() {
		return transformedSize;
	}
	@Override
	public void setTransformedSize(Integer transformedSize) {
		this.transformedSize = transformedSize;
	}
	@Override
	public Integer getValidSize() {
		return validSize;
	}
	@Override
	public void setValidSize(Integer validSize) {
		this.validSize = validSize;
	}
	@Override
	public Map<String, ValidationRule> getRulesByID() {
		return rulesByID;
	}
	@Override
	public void setRulesByID(Map<String, ValidationRule> rulesByID) {
		this.rulesByID = rulesByID;
	}
	public ValidationResult() {
		rulesByID = new HashMap<String, ValidationRule>();
	}

	public Integer size;
	public Integer transformedSize;
	public Integer validSize;
	public Map<String, ValidationRule> rulesByID;
}