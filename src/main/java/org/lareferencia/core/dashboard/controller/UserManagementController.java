package org.lareferencia.core.dashboard.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.lareferencia.core.dashboard.security.IUserManagementService;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
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
	@RequestMapping(value = "/user/admin/create", method = RequestMethod.POST, consumes = {MediaType.APPLICATION_JSON_VALUE})
	HttpEntity<Boolean> createUser(@RequestBody Map<String, String> userInfo) {

    Boolean result = uService.createUser(userInfo);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Returns a user's info")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a user's info") })
	@RequestMapping(value = "/user/self/{username}", method = RequestMethod.GET)
	HttpEntity<Map<String, String>> getUserInfo(@PathVariable("username") String username) {
    
    Map<String, String> result = uService.getUserInfo(username);
		return new ResponseEntity<Map<String, String>>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Lists a user's groups")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Lists a user's groups") })
	@RequestMapping(value = "/user/admin/{username}/groups", method = RequestMethod.GET)
	HttpEntity<List<String>> getUserGroups(@PathVariable("username") String username) {
    
    List<String> result = uService.getUserGroups(username);
		return new ResponseEntity<List<String>>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Updates a user's info")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Updates a user's info") })
	@RequestMapping(value = "/user/self/{username}/update", method = RequestMethod.PUT, consumes = {MediaType.APPLICATION_JSON_VALUE})
	HttpEntity<Boolean> updateUser(@PathVariable("username") String username, @RequestBody Map<String, String> userInfo) {
    
    Boolean result = uService.updateUser(username, userInfo);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Changes a user's password")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Changes a user's password") })
	@RequestMapping(value = "/user/self/{username}/reset_password", method = RequestMethod.PUT)
	HttpEntity<Boolean> changePassword(@PathVariable("username") String username, @RequestParam(value = "newPassword", required = true) String newPassword) {
    
    Boolean result = uService.changePassword(username, newPassword);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Adds a user to a group")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Adds a user to a group") })
	@RequestMapping(value = "/user/admin/{username}/add_to_group/{groupname}", method = RequestMethod.PUT)
	HttpEntity<Boolean> addUserToGroup(@PathVariable("username") String username, @PathVariable("groupname") String groupname) {
    
    Boolean result = uService.addUserToGroup(username, groupname);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Removes a user from a group")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Adds a user to a group") })
	@RequestMapping(value = "/user/admin/{username}/remove_from_group/{groupname}", method = RequestMethod.DELETE)
	HttpEntity<Boolean> removeUserFromGroup(@PathVariable("username") String username, @PathVariable("groupname") String groupname) {
    
    Boolean result = uService.removeUserFromGroup(username, groupname);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Deletes a user")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Deletes a user") })
	@RequestMapping(value = "/user/admin/{username}/delete", method = RequestMethod.DELETE)
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
	@RequestMapping(value = "/group/admin/create", method = RequestMethod.POST, consumes = {MediaType.APPLICATION_JSON_VALUE})
	HttpEntity<Boolean> createGroup(@RequestBody Map<String, String> groupInfo) {
    
    Boolean result = uService.createGroup(groupInfo);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Returns a group's info")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Returns a group's info") })
	@RequestMapping(value = "/group/admin/{groupname}", method = RequestMethod.GET)
	HttpEntity<Map<String, String>> getGroupInfo(@PathVariable("groupname") String groupname) {
    
    Map<String, String> result = uService.getGroupInfo(groupname);
		return new ResponseEntity<Map<String, String>>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Lists a group's members")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Lists a group's members") })
	@RequestMapping(value = "/group/admin/{groupname}/members", method = RequestMethod.GET)
	HttpEntity<List<String>> getGroupMembers(@PathVariable("groupname") String groupname) {
    
    List<String> result = uService.getGroupMembers(groupname);
		return new ResponseEntity<List<String>>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Updates a group's info")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Updates a group's info") })
	@RequestMapping(value = "/group/admin/{groupname}/update", method = RequestMethod.PUT, consumes = {MediaType.APPLICATION_JSON_VALUE})
	HttpEntity<Boolean> updateGroup(@PathVariable("groupname") String groupname, @RequestBody Map<String, String> groupInfo) {
    
    Boolean result = uService.updateGroup(groupname, groupInfo);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 
  @ApiOperation(value = "Deletes a group")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Deletes a group") })
	@RequestMapping(value = "/group/admin/{groupname}/delete", method = RequestMethod.DELETE)
	HttpEntity<Boolean> deleteGroup(@PathVariable("groupname") String groupname) {
    
    Boolean result = uService.deleteGroup(groupname);
		return new ResponseEntity<Boolean>(result, HttpStatus.OK);
	}
 

}