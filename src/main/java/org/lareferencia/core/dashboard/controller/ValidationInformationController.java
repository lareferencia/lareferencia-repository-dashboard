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

import org.lareferencia.core.dashboard.service.IRecordValidationResult;

import java.util.List;
import java.util.Optional;

import org.lareferencia.core.dashboard.service.IValidationInformationService;
import org.lareferencia.core.dashboard.service.IValidationResult;
import org.lareferencia.core.dashboard.service.ValidationInformationServiceException;
import org.lareferencia.core.dashboard.service.ValueCount;
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
@Api(value = "Validation Information", tags="Validation")
@RequestMapping("/api/v2/validation/")
@CrossOrigin
public class ValidationInformationController {
	
	@Autowired
	IValidationInformationService vService;

	@ApiOperation(value = "Returns validation results info by harvesting id")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns validation results info by harvesting id") })  
    @RequestMapping(value = "/by_id/{harvestingID}", method = RequestMethod.GET)
    HttpEntity<IValidationResult> getValidationResults(@PathVariable("harvestingID")  Long harvestingID) {

		IValidationResult result = null;
		
		try {
		
			result = vService.validationResultByHarvestingID(harvestingID);
	        return new ResponseEntity<IValidationResult>(result, HttpStatus.OK);

		} catch (Exception e) {
	        return new ResponseEntity<IValidationResult>(result, HttpStatus.NOT_FOUND);
		}
    	
    }
    
	@ApiOperation(value = "Returns validation results on each record by harvesting id")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns validation results on each record by harvesting id") })  
    @RequestMapping(value = "/by_id/{harvestingID}/records", method = RequestMethod.GET)
    HttpEntity< Page<IRecordValidationResult> > getRecordValitationResult(@PathVariable("harvestingID")  Long harvestingID, 
    		@RequestParam(value = "is_valid") Optional<Boolean> isValid, 
    		@RequestParam(value = "is_transformed") Optional<Boolean> isTransformed, 
    		@RequestParam(value = "valid_rules") Optional<List<String>> validRules, 
     		@RequestParam(value = "invalid_rules") Optional<List<String>> invalidRules, 
    		@RequestParam(value = "oai_identifier") Optional<String> oaiIdentifier,
    		@RequestParam(value = "pageNumber", required = false, defaultValue = "0") Integer page,
    		@RequestParam(value = "pageSize", required = false, defaultValue = "20") Integer size

    		) throws ValidationInformationServiceException {

    	Page<IRecordValidationResult> result = vService.recordValidationResultsByHarvestingID(harvestingID, isValid, isTransformed, validRules, invalidRules, oaiIdentifier, PageRequest.of(page, size));
    	
        return new ResponseEntity< Page<IRecordValidationResult> >(result, HttpStatus.OK);
    }
    
	@ApiOperation(value = "Returns valid metadata occurrences/count for a given validation rule by {harvestingID} and {ruleID}")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns valid metadata occurrences/count for a given validation rule by {harvestingID} and {ruleID}") })  
    @RequestMapping(value = "/by_id/{harvestingID}/valid_occrs/{ruleID}", method = RequestMethod.GET)
    HttpEntity< List<ValueCount> > validOccurrenceCountByHarvestingIDAndRuleID(@PathVariable("harvestingID")  Long harvestingID, @PathVariable("ruleID")  Long ruleID) throws ValidationInformationServiceException {

    	List<ValueCount> result = vService.validOccurrenceCountByHarvestingIDAndRuleID(harvestingID, ruleID);
    	
        return new ResponseEntity< List<ValueCount> >(result, HttpStatus.OK);
    }
	
	@ApiOperation(value = "Returns invalid metadata occurrences/count for a given validation rule by {harvestingID} and {ruleID}")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns invalid metadata occurrences/count for a given validation rule by {harvestingID} and {ruleID}") })  
    @RequestMapping(value = "/by_id/{harvestingID}/invalid_occrs/{ruleID}", method = RequestMethod.GET)
    HttpEntity< List<ValueCount> > invalidOccurrenceCountByHarvestingIDAndRuleID(@PathVariable("harvestingID")  Long harvestingID, @PathVariable("ruleID")  Long ruleID) throws ValidationInformationServiceException {

    	List<ValueCount> result = vService.invalidOccurrenceCountByHarvestingIDAndRuleID(harvestingID, ruleID);
    	
        return new ResponseEntity< List<ValueCount> >(result, HttpStatus.OK);
    }
    
}
