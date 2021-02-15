package org.lareferencia.core.dashboard.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
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
 
  @ApiOperation(value = "Returns a list of regular (non-admin) users")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a list of regular users") })
	@RequestMapping(value = "/user/admin/list", method = RequestMethod.GET)
	HttpEntity<List<String>> listUsers() {
    
    List<String> result = uService.listUsers();
		return new ResponseEntity<List<String>>(result, HttpStatus.OK);
	}
  
  @ApiOperation(value = "Creates a new user")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Creates a new user with the given user info") })
	@RequestMapping(value = "/user/admin/create", method = RequestMethod.GET)
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
	@RequestMapping(value = "/user/self/{username}", method = RequestMethod.GET)
	HttpEntity<Map<String, String>> getUserInfo(@PathVariable("username") String username) {
    
    Map<String, String> result = uService.getUserInfo(username);
		return new ResponseEntity<Map<String, String>>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Updates a user's info")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Updates a user's info") })
	@RequestMapping(value = "/user/self/{username}/update", method = RequestMethod.GET)
	HttpEntity<Boolean> updateUser(@PathVariable("username") String username, @RequestParam(value = "userInfo", required = true) String userInfo) {
    
    ObjectMapper mapper = new ObjectMapper();
    Map<String, String> infoMap = new HashMap<String, String>();
    
    try {
      infoMap = mapper.readValue(userInfo, new TypeReference<Map<String, String>>() {});
    } catch (IOException e) {
      e.printStackTrace();
    }
    
    Boolean result = uService.updateUser(username, infoMap);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Changes a user's password")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Changes a user's password") })
	@RequestMapping(value = "/user/self/{username}/reset_password", method = RequestMethod.GET)
	HttpEntity<Boolean> changePassword(@PathVariable("username") String username, @RequestParam(value = "newPassword", required = true) String newPassword) {
    
    Boolean result = uService.changePassword(username, newPassword);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Adds a user to a group")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Adds a user to a group") })
	@RequestMapping(value = "/user/admin/{username}/add_to_group/{groupname}", method = RequestMethod.GET)
	HttpEntity<Boolean> addUserToGroup(@PathVariable("username") String username, @PathVariable("groupname") String groupname) {
    
    Boolean result = uService.addUserToGroup(username, groupname);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Removes a user")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Removes a user") })
	@RequestMapping(value = "/user/admin/{username}/delete", method = RequestMethod.GET)
	HttpEntity<Boolean> deleteUser(@PathVariable("username") String username) {
    
    Boolean result = uService.deleteUser(username);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Returns a list of groups")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a list of groups") })
	@RequestMapping(value = "/group/admin/list", method = RequestMethod.GET)
	HttpEntity<List<String>> listGroups() {
    
    List<String> result = uService.listGroups();
		return new ResponseEntity<List<String>>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Creates a new group")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Creates a new group with the given group info") })
	@RequestMapping(value = "/group/admin/create", method = RequestMethod.GET)
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
	@RequestMapping(value = "/group/admin/{groupname}", method = RequestMethod.GET)
	HttpEntity<Map<String, String>> getGroupInfo(@PathVariable("groupname") String groupname) {
    
    Map<String, String> result = uService.getGroupInfo(groupname);
		return new ResponseEntity<Map<String, String>>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Updates a group's info")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Updates a group's info") })
	@RequestMapping(value = "/group/admin/{groupname}/update", method = RequestMethod.GET)
	HttpEntity<Boolean> updateGroup(@PathVariable("groupname") String groupname, @RequestParam(value = "groupInfo", required = true) String groupInfo) {
    
    ObjectMapper mapper = new ObjectMapper();
    Map<String, String> infoMap = new HashMap<String, String>();
    
    try {
      infoMap = mapper.readValue(groupInfo, new TypeReference<Map<String, String>>() {});
    } catch (IOException e) {
      e.printStackTrace();
    }
    
    Boolean result = uService.updateGroup(groupname, infoMap);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Removes a group")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Removes a group") })
	@RequestMapping(value = "/group/admin/{groupname}/delete", method = RequestMethod.GET)
	HttpEntity<Boolean> deleteGroup(@PathVariable("groupname") String groupname) {
    
    Boolean result = uService.deleteGroup(groupname);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 

}