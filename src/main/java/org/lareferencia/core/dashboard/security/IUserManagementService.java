package org.lareferencia.core.dashboard.security;

import java.util.List;
import java.util.Map;

public interface IUserManagementService {

  Boolean createUser(Map<String,String> infoMap);
	Boolean deleteUser(String userId);
	Boolean updateUser(String userId, Map<String,String> infoMap);
	
	Boolean changePassword(String userId, String passwd);
	
	Map<String,String> getUserInfo(String userId);
 
  List<String> listUsers();
	
	Boolean createGroup(Map<String,String> infoMap);
	Boolean deleteGroup(String groupId);
	Boolean updateGroup(String groupId, Map<String,String> infoMap);
	
	Map<String,String> getGroupInfo(String groupId);
 
  List<String> listGroups();
	
	Boolean addUserToGroup(String userId, String groupId);
  Boolean removeUserFromGroup(String userId, String groupId);

}