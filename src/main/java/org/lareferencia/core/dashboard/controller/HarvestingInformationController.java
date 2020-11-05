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

import org.lareferencia.core.dashboard.service.HarvesterInfoServiceException;
import org.lareferencia.core.dashboard.service.IHarvestingInformationService;
import org.lareferencia.core.dashboard.service.IHarvestingSource;
import org.lareferencia.core.dashboard.service.IHarvestingResult;
import org.lareferencia.core.dashboard.service.IRecordValidationResult;
import org.lareferencia.core.dashboard.service.ValidationInformationServiceException;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.keycloak.KeycloakSecurityContext;
import org.lareferencia.core.dashboard.security.KeycloakAuthorization;

@RestController
@Api(value = "Harvesting Information", tags="Harvesting")
@RequestMapping("/api/v2/harvesting/source/")
@CrossOrigin
public class HarvestingInformationController {
	
	@Autowired
	IHarvestingInformationService hService;
  
  @Autowired
	HttpServletRequest request;
 
  @Value("${authz.admin-role}")
  private String adminRole;
 
  @Value("${authz.default-repo-scope}") 
  private String scope; 
  
  @Value("${authz.repo-res-suffix}") 
  private String repoResSuffix;

    @ApiOperation(value = "Returns a list harvesting data sources with paging/sorting using {pageable}")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a list harvesting data sources with paging/sorting using {pageable}") })
	@RequestMapping(value = "/list", method = RequestMethod.GET)
    HttpEntity< Page<IHarvestingSource> > getSources(Pageable pageable) throws HarvesterInfoServiceException {
		
    	Page<IHarvestingSource> result = hService.listSources(pageable);   	
    
      //filter result according to user's permissions
      result = filterByUserPermissions(result, pageable);
    
    	return new ResponseEntity< Page<IHarvestingSource> >(result, HttpStatus.OK);
	}
	
    @ApiOperation(value = "Returns a harvesting source info by source id")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a harvesting source info by source id") })
    @RequestMapping(value = "/by_id/{sourceID}", method = RequestMethod.GET)
    HttpEntity<IHarvestingSource> getSourceById(@PathVariable("sourceID")  Long sourceID) throws HarvesterInfoServiceException {

    	IHarvestingSource result = hService.getSourceByID(sourceID);
    	
        return new ResponseEntity<IHarvestingSource>(result, HttpStatus.OK);
    }
    
    @ApiOperation(value = "Returns a harvesting source info by source acronym")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a harvesting source info by source acronym") })
    @RequestMapping(value = "/by_acron/{sourceAcronym}", method = RequestMethod.GET)
    HttpEntity<IHarvestingSource> getSourceByAcronym(@PathVariable("sourceAcronym")  String sourceAcronym) throws HarvesterInfoServiceException {

    	IHarvestingSource result = hService.getSourceByAcronym(sourceAcronym);
    	
        return new ResponseEntity<IHarvestingSource>(result, HttpStatus.OK);
    }
	
    @ApiOperation(value = "Returns a harvesting source harvesting history  by source id")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a harvesting source harvesting info by source id") })
    @RequestMapping(value = "/by_id/{sourceID}/history", method = RequestMethod.GET)
    HttpEntity<Page<IHarvestingResult>> getHarvestingHistoryById(@PathVariable("sourceID")  Long sourceID, Pageable pageable) throws HarvesterInfoServiceException {

    	Page<IHarvestingResult> result = hService.getHarvestingHistoryBySourceID(sourceID, pageable);
    	
        return new ResponseEntity<Page<IHarvestingResult>>(result, HttpStatus.OK);
    }
    
    @ApiOperation(value = "Returns a harvesting source harvesting history by source acronym")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a harvesting source harvesting info by source acronym") })
    @RequestMapping(value = "/by_acron/{sourceAcronym}/history", method = RequestMethod.GET)
    HttpEntity<Page<IHarvestingResult>> getHarvestingHistoryByAcronym(@PathVariable("sourceAcronym")  String sourceAcronym, Pageable pageable) throws HarvesterInfoServiceException {

    	Page<IHarvestingResult> result = hService.getHarvestingHistoryBySourceAcronym(sourceAcronym, pageable);
    	
        return new ResponseEntity<Page<IHarvestingResult>>(result, HttpStatus.OK);
    }
    
    @ApiOperation(value = "Returns a harvesting source last good known harvesting by source id")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a harvesting source last good known harvesting by source id") })
    @RequestMapping(value = "/by_id/{sourceID}/lkg", method = RequestMethod.GET)
    HttpEntity<IHarvestingResult> getLGKSnapshotBySourceId(@PathVariable("sourceID")  Long sourceID) throws HarvesterInfoServiceException {

    	IHarvestingResult result = hService.getLastKnownGoodHarvestingBySourceID(sourceID);
    	
        return new ResponseEntity<IHarvestingResult>(result, HttpStatus.OK);
    }
    
    @ApiOperation(value = "Returns a harvesting source last good known harvesting by source acronym")
    @ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a harvesting source last good known harvesting by source acronym") })
    @RequestMapping(value = "/by_acron/{sourceAcronym}/lkg", method = RequestMethod.GET)
    HttpEntity<IHarvestingResult> getLGKSnapshotBySourceAcronym(@PathVariable("sourceAcronym")  String sourceAcronym) throws HarvesterInfoServiceException {

    	IHarvestingResult result = hService.getLastKnownGoodSHarvestingBySourceAcronym(sourceAcronym);
    	
        return new ResponseEntity<IHarvestingResult>(result, HttpStatus.OK);
    }
    
    private KeycloakSecurityContext getKeycloakSecurityContext() {
		
      return (KeycloakSecurityContext) request.getAttribute(KeycloakSecurityContext.class.getName());
    }
    
	  private Page<IHarvestingSource> filterByUserPermissions(Page<IHarvestingSource> list, Pageable pageable){
		 
		  KeycloakAuthorization authz = new KeycloakAuthorization(getKeycloakSecurityContext());
      List<IHarvestingSource> sources = list.getContent();
      List<IHarvestingSource> filtered = new ArrayList<IHarvestingSource>();
		
		  if (authz.hasRole(adminRole)){
        filtered = sources;
      }
      else {  
        for (IHarvestingSource source : sources){
          String resourceName = source.getAcronym() + " " + repoResSuffix;
        
          if (authz.hasPermission(resourceName, scope)){
  		      filtered.add(source);
   	      }
        } 
      }  
      
      return new PageImpl<IHarvestingSource>(filtered, pageable, filtered.size()); 
	 }
       
}
