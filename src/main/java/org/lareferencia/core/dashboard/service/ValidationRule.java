package org.lareferencia.core.dashboard.service;

public class ValidationRule implements IValidationRule {
	
	@Override
	public Long getRuleID() {
		return ruleID;
	}
	@Override
	public void setRuleID(Long ruleID) {
		this.ruleID = ruleID;
	}
	@Override
	public String getName() {
		return name;
	}
	@Override
	public void setName(String name) {
		this.name = name;
	}
	@Override
	public String getDescription() {
		return description;
	}
	@Override
	public void setDescription(String description) {
		this.description = description;
	}
	@Override
	public String getQuantifier() {
		return quantifier;
	}
	@Override
	public void setQuantifier(String quantifier) {
		this.quantifier = quantifier;
	}
	@Override
	public Boolean getMandatory() {
		return mandatory;
	}
	@Override
	public void setMandatory(Boolean mandatory) {
		this.mandatory = mandatory;
	}
	@Override
	public Integer getValidCount() {
		return validCount;
	}
	@Override
	public void setValidCount(Integer validCount) {
		this.validCount = validCount;
	}
	@Override
	public Integer getInvalidCount() {
		return invalidCount;
	}
	@Override
	public void setInvalidCount(Integer invalidCount) {
		this.invalidCount = invalidCount;
	}
	
	public Long ruleID;
	public String name;
	public String description;
	public String quantifier;
	public Boolean mandatory;
	public Integer validCount;
	public Integer invalidCount;
}