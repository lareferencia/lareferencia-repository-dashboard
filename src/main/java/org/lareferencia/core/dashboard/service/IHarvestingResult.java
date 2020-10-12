package org.lareferencia.core.dashboard.service;

import java.util.Date;
import java.util.Map;

import org.lareferencia.backend.network.INetworkAttributes;

public interface IHarvestingResult {
	
	Long getId();
	
	Date getStartTime();
	Date getEndTime();
	
	String getStatus();

	Integer getHarvestedSize();
	Integer getValidSize();
	Integer getTransformedSize();
	
	Boolean isDeleted();

}
