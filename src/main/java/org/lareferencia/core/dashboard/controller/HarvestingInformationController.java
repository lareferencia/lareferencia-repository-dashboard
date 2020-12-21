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

import javax.servlet.http.HttpServletRequest;

import org.lareferencia.backend.domain.OAIRecord;
import org.lareferencia.backend.repositories.jpa.OAIRecordRepository;
import org.lareferencia.core.dashboard.security.ISecurityService;
import org.lareferencia.core.dashboard.service.HarvesterInfoServiceException;
import org.lareferencia.core.dashboard.service.IHarvestingInformationService;
import org.lareferencia.core.dashboard.service.IHarvestingResult;
import org.lareferencia.core.dashboard.service.IHarvestingSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.TimeZone;

@RestController
@Api(value = "Harvesting Information", tags = "Harvesting")
@RequestMapping("/api/v2/harvesting/source/")
@CrossOrigin
public class HarvestingInformationController {

	@Autowired
	IHarvestingInformationService hService;

	@Autowired
	HttpServletRequest request;

	@Autowired
	ISecurityService securityService;
	
	@Autowired
	private OAIRecordRepository recordRepository;

	@ApiOperation(value = "Returns a list harvesting data sources with paging/sorting using {pageable}")
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "Returns a list harvesting data sources with paging/sorting using {pageable}") })
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	HttpEntity<Page<IHarvestingSource>> getSources(Pageable pageable) throws HarvesterInfoServiceException {

		Page<IHarvestingSource> result = null;
		
		// if its a admin request show all sources
		if ( securityService.isAdminRequest(request) ) {
			result = hService.listSources(pageable);
		}
		else { // else get the groups of this user and return a filtered source list using groups as whitelist
		    result = hService.listSources( securityService.getRequestGroups(request) , pageable);
		}
		 
		return new ResponseEntity<Page<IHarvestingSource>>(result, HttpStatus.OK);
	}

//	@ApiOperation(value = "Returns a harvesting source info by source id")
//	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a harvesting source info by source id") })
//	@RequestMapping(value = "/by_id/{sourceID}", method = RequestMethod.GET)
//	HttpEntity<IHarvestingSource> getSourceById(@PathVariable("sourceID") Long sourceID)
//			throws HarvesterInfoServiceException {
//
//		IHarvestingSource result = hService.getSourceByID(sourceID);
//
//		return new ResponseEntity<IHarvestingSource>(result, HttpStatus.OK);
//	}

	@ApiOperation(value = "Returns a harvesting source info by source acronym")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a harvesting source info by source acronym") })
	@RequestMapping(value = "/{sourceAcronym}", method = RequestMethod.GET)
	HttpEntity<IHarvestingSource> getSourceByAcronym(@PathVariable("sourceAcronym") String sourceAcronym)
			throws HarvesterInfoServiceException {

		IHarvestingSource result = hService.getSourceByAcronym(sourceAcronym);

		return new ResponseEntity<IHarvestingSource>(result, HttpStatus.OK);
	}

//	@ApiOperation(value = "Returns a harvesting source harvesting history  by source id")
//	@ApiResponses(value = {
//			@ApiResponse(code = 200, message = "Returns a harvesting source harvesting info by source id") })
//	@RequestMapping(value = "/by_id/{sourceID}/history", method = RequestMethod.GET)
//	HttpEntity<Page<IHarvestingResult>> getHarvestingHistoryById(@PathVariable("sourceID") Long sourceID,
//			Pageable pageable) throws HarvesterInfoServiceException {
//
//		Page<IHarvestingResult> result = hService.getHarvestingHistoryBySourceID(sourceID, pageable);
//
//		return new ResponseEntity<Page<IHarvestingResult>>(result, HttpStatus.OK);
//	}

	@ApiOperation(value = "Returns a harvesting source harvesting history by source acronym")
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "Returns a harvesting source harvesting info by source acronym") })
	@RequestMapping(value = "/{sourceAcronym}/history", method = RequestMethod.GET)
	HttpEntity<Page<IHarvestingResult>> getHarvestingHistoryByAcronym(
			@PathVariable("sourceAcronym") String sourceAcronym, Pageable pageable)
			throws HarvesterInfoServiceException {

		Page<IHarvestingResult> result = hService.getHarvestingHistoryBySourceAcronym(sourceAcronym, pageable);

		return new ResponseEntity<Page<IHarvestingResult>>(result, HttpStatus.OK);
	}
	
	
	@ApiOperation(value = "Returns a harvesting source harvesting history within a time interval by source acronym")
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "Returns a harvesting source harvesting info for a given time interval by source acronym") })
	@RequestMapping(value = "/{sourceAcronym}/history/{startDate}/{endDate}", method = RequestMethod.GET)
	HttpEntity<Page<IHarvestingResult>> getHarvestingHistoryByAcronymAndDate(
			@PathVariable("sourceAcronym") String sourceAcronym, @PathVariable("startDate") String fromDate, @PathVariable("endDate") String toDate, Pageable pageable)
			throws HarvesterInfoServiceException, ParseException {

		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
    Date startDate = formatter.parse(fromDate);
    Date endDate = formatter.parse(toDate);
    
    // Set endDate time to end of day
    Calendar cal = Calendar.getInstance();
		cal.setTime(endDate);
		cal.set(Calendar.HOUR_OF_DAY, 23);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
    cal.set(Calendar.MILLISECOND, 999);
    endDate = cal.getTime();

    Page<IHarvestingResult> result = hService.getHarvestingHistoryBySourceAcronym(sourceAcronym, startDate, endDate, pageable);

		return new ResponseEntity<Page<IHarvestingResult>>(result, HttpStatus.OK);
	}

//	@ApiOperation(value = "Returns a harvesting source last good known harvesting by source id")
//	@ApiResponses(value = {
//			@ApiResponse(code = 200, message = "Returns a harvesting source last good known harvesting by source id") })
//	@RequestMapping(value = "/by_id/{sourceID}/lkg", method = RequestMethod.GET)
//	HttpEntity<IHarvestingResult> getLGKSnapshotBySourceId(@PathVariable("sourceID") Long sourceID)
//			throws HarvesterInfoServiceException {
//
//		IHarvestingResult result = hService.getLastKnownGoodHarvestingBySourceID(sourceID);
//
//		return new ResponseEntity<IHarvestingResult>(result, HttpStatus.OK);
//	}

	@ApiOperation(value = "Returns a harvesting source last good known harvesting by source acronym")
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "Returns a harvesting source last good known harvesting by source acronym") })
	@RequestMapping(value = "/{sourceAcronym}/lkg", method = RequestMethod.GET)
	HttpEntity<IHarvestingResult> getLGKSnapshotBySourceAcronym(@PathVariable("sourceAcronym") String sourceAcronym)
			throws HarvesterInfoServiceException {

		IHarvestingResult result = hService.getLastKnownGoodSHarvestingBySourceAcronym(sourceAcronym);

		return new ResponseEntity<IHarvestingResult>(result, HttpStatus.OK);
	}
	
	@ResponseBody
	@RequestMapping(value = "/public/getRecordMetadataByID/{id}", method = RequestMethod.GET, produces = "application/xml; charset=utf-8")
	public String getRecordMetadataByID(@PathVariable Long id) throws Exception {

		Optional<OAIRecord> record = recordRepository.findById(id);

		if (record != null && record.isPresent())
			return record.get().getPublishedXML();
		else
			return "Registro inexistente - Posiblemente el diagnóstico está desactualizado";

	}

//	private Page<IHarvestingSource> filterByUserPermissions(Page<IHarvestingSource> list, Pageable pageable) {
//
//		KeycloakAuthorization authz = new KeycloakAuthorization(getKeycloakSecurityContext());
//		List<String> userGroups = authz.getGroups();
//		List<IHarvestingSource> sources = list.getContent();
//		List<IHarvestingSource> filtered = new ArrayList<IHarvestingSource>();
//
//		if (authz.hasRole(adminRole)) {
//			filtered = sources;
//		} else {
//			for (IHarvestingSource source : sources) {
//				if (userGroups.contains(source.getAcronym())) {
//					filtered.add(source);
//				}
//			}
//		}
//
//		return new PageImpl<IHarvestingSource>(filtered, pageable, filtered.size());
//	}

}
