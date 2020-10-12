package org.lareferencia.backend.metadata;

import java.util.List;

import org.w3c.dom.Document;
import org.w3c.dom.Node;

public interface IMDFormatTransformer {

	Document transform(Document source) throws MDFormatTranformationException;
	String   transformToString(Document source) throws MDFormatTranformationException;
	void setParameter(String name, List<String> values);
	void setParameter(String name, String value);

	String getSourceMDFormat();
	String getTargetMDFormat();

}
