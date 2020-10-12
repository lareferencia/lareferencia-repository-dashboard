package org.lareferencia.core.dashboard.service;

import java.util.Map;

import org.lareferencia.backend.network.INetworkAttributes;

public interface IHarvestingSource {
	
	Long getId();
	String getName();
	String getAcronym();
	String getInstitutionName();
	String getInstitutionAcronym();
	Map<String, String> getAttributes();
	Boolean isPublic();

}
