package org.lareferencia.core.dashboard.service.impl.v3;

import java.util.Date;

import org.lareferencia.backend.domain.NetworkSnapshot;
import org.lareferencia.core.dashboard.service.IHarvestingResult;

public class NetworkSnapshot2IHarvestingResultAdapter implements IHarvestingResult {

	NetworkSnapshot source;
	
	public NetworkSnapshot2IHarvestingResultAdapter(NetworkSnapshot source) {
		this.source = source;
	}

	@Override
	public Long getId() {
		return source.getId();
	}

	@Override
	public Date getStartTime() {
		return source.getStartTime();
	}

	@Override
	public Date getEndTime() {
		return source.getEndTime();
	}

	@Override
	public String getStatus() {
		return source.getStatus().toString();
	}

	@Override
	public Integer getHarvestedSize() {
		return source.getSize();
	}

	@Override
	public Integer getValidSize() {
		return source.getValidSize();
	}

	@Override
	public Integer getTransformedSize() {
		return source.getTransformedSize();
	}

	@Override
	public Boolean isDeleted() {
		return source.isDeleted();
	}
	
}
