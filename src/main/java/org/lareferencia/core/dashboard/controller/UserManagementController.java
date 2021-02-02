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
 
  @ApiOperation(value = "Returns a user's info")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a user's info") })
	@RequestMapping(value = "/user/{userId}", method = RequestMethod.GET)
	HttpEntity<Map<String, String>> getUserInfo(@PathVariable("userId") String userId) {
    
    Map<String, String> result = uService.getUserInfo(userId);
		return new ResponseEntity<Map<String, String>>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Updates a user's info")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Updates a user's info") })
	@RequestMapping(value = "/user/{userId}/update", method = RequestMethod.GET)
	HttpEntity<Boolean> updateUser(@PathVariable("userId") String userId, @RequestParam(value = "userInfo", required = true) String userInfo) {
    
    ObjectMapper mapper = new ObjectMapper();
    Map<String, String> infoMap = new HashMap<String, String>();
    
    try {
      infoMap = mapper.readValue(userInfo, new TypeReference<Map<String, String>>() {});
    } catch (IOException e) {
      e.printStackTrace();
    }
    
    Boolean result = uService.updateUser(userId, infoMap);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Changes a user's password")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Changes a user's password") })
	@RequestMapping(value = "/user/{userId}/reset_password", method = RequestMethod.GET)
	HttpEntity<Boolean> changePassword(@PathVariable("userId") String userId, @RequestParam(value = "password", required = true) String password) {
    
    Boolean result = uService.changePassword(userId, password);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Adds a user to a group")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Adds a user to a group") })
	@RequestMapping(value = "/user/{userId}/add_to_group/{groupId}", method = RequestMethod.GET)
	HttpEntity<Boolean> addUserToGroup(@PathVariable("userId") String userId, @PathVariable("groupId") String groupId) {
    
    Boolean result = uService.addUserToGroup(userId, groupId);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Removes a user")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Removes a user") })
	@RequestMapping(value = "/user/{userId}/delete", method = RequestMethod.GET)
	HttpEntity<Boolean> deleteUser(@PathVariable("userId") String userId) {
    
    Boolean result = uService.deleteUser(userId);
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
 
  @ApiOperation(value = "Returns a group's info")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a group's info") })
	@RequestMapping(value = "/group/{groupId}", method = RequestMethod.GET)
	HttpEntity<Map<String, String>> getGroupInfo(@PathVariable("groupId") String groupId) {
    
    Map<String, String> result = uService.getGroupInfo(groupId);
		return new ResponseEntity<Map<String, String>>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Updates a group's info")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Updates a group's info") })
	@RequestMapping(value = "/group/{groupId}/update", method = RequestMethod.GET)
	HttpEntity<Boolean> updateGroup(@PathVariable("groupId") String groupId, @RequestParam(value = "groupInfo", required = true) String groupInfo) {
    
    ObjectMapper mapper = new ObjectMapper();
    Map<String, String> infoMap = new HashMap<String, String>();
    
    try {
      infoMap = mapper.readValue(groupInfo, new TypeReference<Map<String, String>>() {});
    } catch (IOException e) {
      e.printStackTrace();
    }
    
    Boolean result = uService.updateGroup(groupId, infoMap);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Removes a group")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Removes a group") })
	@RequestMapping(value = "/group/{groupId}/delete", method = RequestMethod.GET)
	HttpEntity<Boolean> deleteGroup(@PathVariable("groupId") String groupId) {
    
    Boolean result = uService.deleteGroup(groupId);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 

}