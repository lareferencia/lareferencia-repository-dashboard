package org.lareferencia.core.dashboard.service;

public class ValueCount {
	
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}
	public ValueCount(String value, int count) {
		this.value = value;
		this.count = count;
	}

	String value;
	Integer count;
}