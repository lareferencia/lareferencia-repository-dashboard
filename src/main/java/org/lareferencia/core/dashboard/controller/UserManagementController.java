package org.lareferencia.core.dashboard.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.lareferencia.core.dashboard.security.IUserManagementService;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@Api(value = "User Management", tags = "Security")
@RequestMapping("/api/v2/security/management/")
@CrossOrigin
public class UserManagementController {

  @Autowired
	IUserManagementService uService;
 
  @ApiOperation(value = "Creates a new user")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Creates a new user with the given user info") })
	@RequestMapping(value = "/user/create", method = RequestMethod.GET)
	HttpEntity<Boolean> createUser(@RequestParam(value = "userInfo", required = true) String userInfo) {

		ObjectMapper mapper = new ObjectMapper();
    Map<String, String> infoMap = new HashMap<String, String>();
    
    try {
      infoMap = mapper.readValue(userInfo, new TypeReference<Map<String, String>>() {});
    } catch (IOException e) {
      e.printStackTrace();
    }
    
    Boolean result = uService.createUser(infoMap);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Returns a user info by user id")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a user info by user id") })
	@RequestMapping(value = "/user/{userId}", method = RequestMethod.GET)
	HttpEntity<Map<String, String>> getUserInfo(@PathVariable("userId") String userId) {
    
    Map<String, String> result = uService.getUserInfo(userId);
		return new ResponseEntity<Map<String, String>>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Adds a user to a group")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Adds a user to a group") })
	@RequestMapping(value = "/user/{userId}/add_to_group/{groupId}", method = RequestMethod.GET)
	HttpEntity<Boolean> addUserToGroup(@PathVariable("userId") String userId, @PathVariable("groupId") String groupId) {
    
    Boolean result = uService.addUserToGroup(userId, groupId);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Creates a new group")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Creates a new group with the given group info") })
	@RequestMapping(value = "/group/create", method = RequestMethod.GET)
	HttpEntity<Boolean> createGroup(@RequestParam(value = "groupInfo", required = true) String groupInfo) {

		ObjectMapper mapper = new ObjectMapper();
    Map<String, String> infoMap = new HashMap<String, String>();
    
    try {
      infoMap = mapper.readValue(groupInfo, new TypeReference<Map<String, String>>() {});
    } catch (IOException e) {
      e.printStackTrace();
    }
    
    Boolean result = uService.createGroup(infoMap);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Returns a group info by group id")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a group info by group id") })
	@RequestMapping(value = "/group/{groupId}", method = RequestMethod.GET)
	HttpEntity<Map<String, String>> getGroupInfo(@PathVariable("groupId") String groupId) {
    
    Map<String, String> result = uService.getGroupInfo(groupId);
		return new ResponseEntity<Map<String, String>>(result, HttpStatus.OK);
	}

}