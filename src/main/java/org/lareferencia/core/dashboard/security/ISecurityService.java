package org.lareferencia.core.dashboard.security;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

public interface ISecurityService {
	
	List<String> getRequestGroups(HttpServletRequest request);
	Boolean isAdminRequest(HttpServletRequest request);
	
	
}
