package org.lareferencia.core.dashboard.service;

public interface IValidationRule {

	Long getRuleID();

	void setRuleID(Long ruleID);

	String getName();

	void setName(String name);

	String getDescription();

	void setDescription(String description);

	String getQuantifier();

	void setQuantifier(String quantifier);

	Boolean getMandatory();

	void setMandatory(Boolean mandatory);

	Integer getValidCount();

	void setValidCount(Integer validCount);

	Integer getInvalidCount();

	void setInvalidCount(Integer invalidCount);

}