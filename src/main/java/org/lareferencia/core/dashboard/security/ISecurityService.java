package org.lareferencia.core.dashboard.security;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface ISecurityService {
	
	List<String> getRequestGroups(HttpServletRequest request);
	Boolean isAdminRequest(HttpServletRequest request);
	
	/**********************/ 
	
	Boolean createUser(String userId, Map<String,String> infoMap);
	Boolean deleteUser(String userId, Map<String,String> infoMap);
	Boolean updateUser(String userId, Map<String,String> infoMap);
	
	Boolean changePassword(String userId, String passwd);
	
	Map<String,String> getUserInfo(String userId);
	
	Boolean createGroup(String groupId, Map<String,String> infoMap);
	Boolean deleteGroup(String groupId);
	Boolean updateGroup(String groupId, Map<String,String> infoMap);
	
	Map<String,String> getGroupInfo(String groupId);
	
	Boolean addUserToGroup(String userId, String groupId);
	
}
