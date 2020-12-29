package org.lareferencia.core.dashboard.service.impl.v3;

import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.lareferencia.backend.domain.Network;
import org.lareferencia.backend.repositories.jpa.NetworkRepository;
import org.lareferencia.core.dashboard.service.HarvesterInfoServiceException;
import org.lareferencia.core.oabroker.BrokerEvent;
import org.lareferencia.core.oabroker.BrokerEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;


@Component
@Scope("prototype")
public class BrokerEventsService {
	
	
	private static Logger logger = LogManager.getLogger(BrokerEventsService.class);

	@Autowired
	NetworkRepository networkRepository;

	@Autowired
	BrokerEventRepository eventsRepository;
	
	
	public Page<BrokerEvent> getEventsByAcronym(String sourceAcronym, Optional<String> oaiIdentifier, Optional<String> topic, Pageable pageable) throws HarvesterInfoServiceException {
		
		Network network = findHarvestingSourceByAcronym(sourceAcronym);

		if ( oaiIdentifier.isPresent() ) {
			if ( topic.isPresent() ) {
				return eventsRepository.findByNetworkIdAndIdentifierAndTopic(network.getId(), oaiIdentifier.get(), topic.get(), pageable);
			} else
				return eventsRepository.findByNetworkIdAndIdentifier(network.getId(), oaiIdentifier.get(), pageable);
			
		} else {
			if ( topic.isPresent() ) {
				return eventsRepository.findByNetworkIdAndTopic(network.getId(), topic.get(), pageable);
			} else
				return eventsRepository.findByNetworkId(network.getId(), pageable);
		}

	}
	
	
	private Network findHarvestingSourceByAcronym(String sourceAcronym) throws HarvesterInfoServiceException {

		Network network = networkRepository.findByAcronym(sourceAcronym);
		if (network == null)
			throw new HarvesterInfoServiceException("Harvesting source w/ ACronym" + sourceAcronym + "does not exist");

		return network;
	}

	

}
