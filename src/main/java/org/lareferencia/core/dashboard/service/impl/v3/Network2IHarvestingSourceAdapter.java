package org.lareferencia.core.dashboard.service.impl.v3;

import java.util.HashMap;
import java.util.Map;

import org.lareferencia.backend.domain.Network;
import org.lareferencia.core.dashboard.service.IHarvestingSource;

public class Network2IHarvestingSourceAdapter implements IHarvestingSource {

	Network source;
	
	public Network2IHarvestingSourceAdapter(Network source) {
		this.source = source;
	}

	@Override
	public String getName() {
		return source.getName();
	}

	@Override
	public String getAcronym() {
		return source.getAcronym();
	}

	@Override
	public String getInstitutionName() {
		return source.getInstitutionName();
	}

	@Override
	public String getInstitutionAcronym() {
		return source.getInstitutionAcronym();
	}

	@Override
	public Map<String, String> getAttributes() {
		if ( source.getAttributes() != null)
			return source.getAttributes().asMap();
		else
			return new HashMap<String, String>();
	}

	@Override
	public Boolean isPublic() {
		return source.isPublished();
	}

	@Override
	public Long getId() {
		return source.getId();
	}


}
