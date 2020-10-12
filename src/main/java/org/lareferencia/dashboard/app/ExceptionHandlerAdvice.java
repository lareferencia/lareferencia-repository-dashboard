package org.lareferencia.dashboard.app;

import org.lareferencia.core.dashboard.service.ValidationInformationServiceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionHandlerAdvice {

	@ExceptionHandler(ValidationInformationServiceException.class)
	public ResponseEntity handleException(ValidationInformationServiceException e) {
		// log exception
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	}
}
