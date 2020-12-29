/*******************************************************************************
 * Copyright (c) 2013, 2020 LA Referencia / Red CLARA and others
 *
 * This file is part of LRHarvester v4.x software
 *
 *  This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *     
 *     For any further information please contact
 *     Lautaro Matas <lmatas@gmail.com>
 *******************************************************************************/
package org.lareferencia.core.dashboard.controller;

import java.util.Optional;

import org.lareferencia.core.dashboard.service.impl.v3.BrokerEventsService;
import org.lareferencia.core.oabroker.BrokerEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@RestController
@Api(value = "OpenAIRE Broker Events", tags = "OpenAIRE Broker")
@RequestMapping("/api/v2/oabroker/source/")
@CrossOrigin
public class BrokerEventsController {


	@Autowired
	BrokerEventsService brokerService;
	

	@ApiOperation(value = "Returns broker events by source")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns validation results on each record by harvesting id") })  
    @RequestMapping(value = "/{sourceAcronym}", method = RequestMethod.GET)
    HttpEntity< Page<BrokerEvent> > getBrokerEventsBySource(@PathVariable("sourceAcronym") String sourceAcronym, 
															    		@RequestParam(value = "oai_identifier", required = false) Optional<String> oaiIdentifier,
															    		@RequestParam(value = "topic", required = false) Optional<String> topic,
															    		@RequestParam(value = "pageNumber", required = false, defaultValue = "0") Integer page,
															    		@RequestParam(value = "pageSize", required = false, defaultValue = "100") Integer size) {
		
		
		Page<BrokerEvent> result = null;

		try {
	
			result = brokerService.getEventsByAcronym(sourceAcronym, oaiIdentifier, topic, PageRequest.of(page, size) );
		
			return new ResponseEntity< Page<BrokerEvent> >(result, HttpStatus.OK);
			
		} catch (Exception e) {
	        return new ResponseEntity< Page<BrokerEvent> >(result, HttpStatus.NOT_FOUND);
		}

		
    }
	

}
