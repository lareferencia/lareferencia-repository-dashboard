package org.lareferencia.core.dashboard.service.impl.v3;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.lareferencia.backend.domain.Network;
import org.lareferencia.backend.domain.NetworkSnapshot;
import org.lareferencia.backend.repositories.jpa.NetworkRepository;
import org.lareferencia.backend.repositories.jpa.NetworkSnapshotRepository;
import org.lareferencia.core.dashboard.service.HarvesterInfoServiceException;
import org.lareferencia.core.dashboard.service.IHarvestingInformationService;
import org.lareferencia.core.dashboard.service.IHarvestingSource;
import org.lareferencia.core.dashboard.service.IHarvestingResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@Scope("prototype")
public class HarvestingInformationService implements IHarvestingInformationService {

	private static Logger logger = LogManager.getLogger(HarvestingInformationService.class);

	@Autowired
	NetworkRepository networkRepository;

	@Autowired
	NetworkSnapshotRepository snapshotRepository;

	public Page<IHarvestingResult> getHarvestingHistoryBySourceID(Long sourceID, Pageable pageable)
			throws HarvesterInfoServiceException {

		Network network = findHarvestingSourceByID(sourceID);

		Page<NetworkSnapshot> page = snapshotRepository.findByNetwork(network, pageable);

		Page<IHarvestingResult> results = new PageImpl<IHarvestingResult>(
				page.getContent().stream().map(o -> new NetworkSnapshot2IHarvestingResultAdapter(o)).collect(Collectors.toList()),
				pageable, page.getTotalElements());

		return results;
	}

	public Page<IHarvestingResult> getHarvestingHistoryBySourceAcronym(String sourceAcronym, Pageable pageable)
			throws HarvesterInfoServiceException {

		Network network = findHarvestingSourceByAcronym(sourceAcronym);

		Page<NetworkSnapshot> page = snapshotRepository.findByNetwork(network, pageable);

		Page<IHarvestingResult> results = new PageImpl<IHarvestingResult>(
				page.getContent().stream().map(o -> new NetworkSnapshot2IHarvestingResultAdapter(o)).collect(Collectors.toList()),
				pageable, page.getTotalElements());

		return results;
	}

	@Override
	public Page<IHarvestingSource> listSources(List<String> whiteList, Pageable pageable) throws HarvesterInfoServiceException {

		Page<Network> page = networkRepository.findFilteredByAcronymList(whiteList, pageable);

		// builds a page based on result.
		Page<IHarvestingSource> results = new PageImpl<IHarvestingSource>(
				page.getContent().stream().map(o -> new Network2IHarvestingSourceAdapter(o)).collect(Collectors.toList()), pageable,
				page.getTotalElements());

		return results;
	}
	
	@Override
	public Page<IHarvestingSource> listSources(Pageable pageable) throws HarvesterInfoServiceException {

		Page<Network> page = networkRepository.findAll(pageable);

		// builds a page based on result.
		Page<IHarvestingSource> results = new PageImpl<IHarvestingSource>(
				page.getContent().stream().map(o -> new Network2IHarvestingSourceAdapter(o)).collect(Collectors.toList()), pageable,
				page.getTotalElements());

		return results;
	}

	@Override
	public IHarvestingSource getSourceByID(Long sourceID) throws HarvesterInfoServiceException {
		return new Network2IHarvestingSourceAdapter(findHarvestingSourceByID(sourceID));
	}

	@Override
	public IHarvestingSource getSourceByAcronym(String sourceAcronym) throws HarvesterInfoServiceException {
		return new Network2IHarvestingSourceAdapter(findHarvestingSourceByAcronym(sourceAcronym));
	}

	@Override
	public IHarvestingResult getLastKnownGoodHarvestingBySourceID(Long sourceID) throws HarvesterInfoServiceException {
		return new NetworkSnapshot2IHarvestingResultAdapter(snapshotRepository.findLastGoodKnowByNetworkID(sourceID));
	}

	@Override
	public IHarvestingResult getLastKnownGoodSHarvestingBySourceAcronym(String sourceAcronym) throws HarvesterInfoServiceException {

		Network network = findHarvestingSourceByAcronym(sourceAcronym);
		return new NetworkSnapshot2IHarvestingResultAdapter(snapshotRepository.findLastGoodKnowByNetworkID(network.getId()));

	}

	private Network findHarvestingSourceByID(Long sourceID) throws HarvesterInfoServiceException {

		Network network = networkRepository.getOne(sourceID);
		if (network == null)
			throw new HarvesterInfoServiceException("Harvesting source " + sourceID + "does not exist");

		return network;
	}

	private Network findHarvestingSourceByAcronym(String sourceAcronym) throws HarvesterInfoServiceException {

		Network network = networkRepository.findByAcronym(sourceAcronym);
		if (network == null)
			throw new HarvesterInfoServiceException("Harvesting source w/ ACronym" + sourceAcronym + "does not exist");

		return network;
	}

}
