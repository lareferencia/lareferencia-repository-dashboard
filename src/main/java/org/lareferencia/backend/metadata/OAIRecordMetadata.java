/*******************************************************************************
 * Copyright (c) 2013 
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * 
 * Contributors:
 *     Lautaro Matas (lmatas@gmail.com) - Desarrollo e implementación
 *     Emiliano Marmonti(emarmonti@gmail.com) - Coordinación del componente III
 * 
 * Este software fue desarrollado en el marco de la consultoría "Desarrollo e implementación de las soluciones - Prueba piloto del Componente III -Desarrollador para las herramientas de back-end" del proyecto “Estrategia Regional y Marco de Interoperabilidad y Gestión para una Red Federada Latinoamericana de Repositorios Institucionales de Documentación Científica” financiado por Banco Interamericano de Desarrollo (BID) y ejecutado por la Cooperación Latino Americana de Redes Avanzadas, CLARA.
 ******************************************************************************/
package org.lareferencia.backend.metadata;

import lombok.Getter;
import lombok.Setter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.lareferencia.backend.metadata.OAIMetadataElement.Type;
import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import java.io.IOException;
import java.net.URI;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

public class OAIRecordMetadata {
	
	private static Logger logger = LogManager.getLogger(OAIRecordMetadata.class);

	
	private Document DOMDocument;

	@Getter
	private String identifier;

	@Getter
	@Setter
	private String origin;

	@Getter
	@Setter
	private String setSpec;
	

	public Document getDOMDocument() {
		return DOMDocument;
	}

	public OAIRecordMetadata(String identifier, String xmlString) throws OAIRecordMetadataParseException {

		this.identifier = identifier;

		try {

			DOMDocument = MedatadaDOMHelper.XMLString2Document(xmlString);

		} catch (ParserConfigurationException e) {
			throw new OAIRecordMetadataParseException("Error en configuración del parser. Idenfier" + identifier , e);
		} catch (SAXException e) {
			throw new OAIRecordMetadataParseException("Error parsing xml en: " + identifier, e);
		} catch (IOException e) {
			throw new OAIRecordMetadataParseException("Error desconocido en parsing de  " + identifier, e);
		}
	}
	
	public OAIRecordMetadata(String identifier, Node node) {
		this.identifier = identifier;
		this.DOMDocument = MedatadaDOMHelper.createDocumentFromNode(node);
	}
	
	
	public OAIRecordMetadata(String identifier, Document document) {
		this.identifier = identifier;
		this.DOMDocument = document;
	}

	public List<String> getFieldOcurrences(String fieldName) {
		
		
		try {
			NodeList nodelist = MedatadaDOMHelper.getNodeList(DOMDocument, XOAIXPATHHelper.getXPATH(fieldName) );
			List<String> contents = new ArrayList<String>(nodelist.getLength());
			
			for (int i = 0; i < nodelist.getLength(); i++) {
				try {

					if (nodelist.item(i).hasChildNodes())
						contents.add(nodelist.item(i).getFirstChild().getNodeValue());
				
				} catch (NullPointerException e) {
					// Esto no debiera ocurrir nunca
					// TODO: mejorar el tratamiento de esto
					logger.error("Error obteniendo occurrencias: " +MedatadaDOMHelper.Node2XMLString(nodelist.item(i)));
				}
			}
			return contents;

		} catch (TransformerException e) {
			// TODO: mejorar el tratamiento de esto
			e.printStackTrace();
			return new ArrayList<String>(0);
		}
	}

	
	public void replaceFieldOcurrence(String fieldName, String content) {
		
		try {
			
			String xpath =  XOAIXPATHHelper.getXPATH(fieldName);
			
			if ( MedatadaDOMHelper.isNodeDefined(DOMDocument,xpath) ) {
				
				Node node = MedatadaDOMHelper.getSingleNode(DOMDocument, xpath);
				MedatadaDOMHelper.setNodeText(node, content);
				
			}
		} catch (DOMException e) {
			logger.error("Error en remplazo de valor de metadato:" +fieldName);
			e.printStackTrace();
		} 
		
		catch (TransformerException e) {
			logger.error("Error en reemplazo de valor de metadato:" +fieldName);
			e.printStackTrace();
		}
	}
	
	public void removeFieldOcurrence(String fieldName) {
		
		try {
			
			String xpath =  XOAIXPATHHelper.getXPATH(fieldName);
			
			if ( MedatadaDOMHelper.isNodeDefined(DOMDocument,xpath) ) {
				
				NodeList nodes = MedatadaDOMHelper.getNodeList(DOMDocument, xpath);
				
				for (int i=0; i<nodes.getLength();i++)
					MedatadaDOMHelper.removeNodeAndEmptyParents(nodes.item(i));
			}
			
		} catch (DOMException e) {
			logger.error("Error remoción de valor de metadato:" +fieldName);
			e.printStackTrace();
		} 
		
		catch (TransformerException e) {
			logger.error("Error remoción de valor de metadato:" +fieldName);
			e.printStackTrace();
		}
	}
	
	public void removeNode(Node node) {
		
		try {
		  MedatadaDOMHelper.removeNodeAndEmptyParents(node);
		} catch (DOMException e) {
			logger.error("Error remoción de nodo");
			e.printStackTrace();
		} 
		
		catch (TransformerException e) {
			logger.error("Error remoción de nodo");
			e.printStackTrace();
		}
	}
	
	public void addFieldOcurrence(String fieldName, String content) {

		try {
			
			String parentXPATH = XOAIXPATHHelper.getRootXPATH();
			Node parentNode = MedatadaDOMHelper.getSingleNode(DOMDocument, parentXPATH);
			
			List<OAIMetadataElement> elements = XOAIXPATHHelper.getXPATHList(fieldName);

			// esto va a definir todos los nodos no definidos, mira hasta el anteultimo elemento
			for (int i=0; i<elements.size()-1; i++) {
				
				OAIMetadataElement elem = elements.get(i);
				String xpath =  elem.getXpath();
		
				if ( !MedatadaDOMHelper.isNodeDefined(DOMDocument, xpath) ) {
					Node newNode = MedatadaDOMHelper.addChildElementWithNameAttr(parentNode, elem.getType().toString(), elem.getName());
				}
				
					
				parentNode = MedatadaDOMHelper.getSingleNode(DOMDocument, xpath);
			}
			
			// trata el ultimo elemento aparte
			
			OAIMetadataElement lastElem = elements.get(elements.size()-1); 
			String xpath =  lastElem.getXpath();
			
			// si el ultimo elemento ya esta definido
			if ( MedatadaDOMHelper.isNodeDefined(DOMDocument, xpath) ) {
				
				// lo obtiene
				Node node = MedatadaDOMHelper.getSingleNode(DOMDocument, xpath);
				
				if ( lastElem.getType() == Type.field ) { // si es de tipo field
					
					// agrega un nuevo nodo al padre (element), de tipo field, con el mismo nombre y con el valor deseado
					Node newNode = MedatadaDOMHelper.addChildElementWithNameAttr(node.getParentNode(), Type.field.toString(), lastElem.getName());
					MedatadaDOMHelper.setNodeText(newNode, content);
				
				}
				else { // si no es de tipo field es de tipo element, entonces
				
					// agrega un nuevo nodo hijo, de tipo field, con nombre value y el contenido
					Node newNode = MedatadaDOMHelper.addChildElementWithNameAttr(node, Type.field.toString(), "value");
					MedatadaDOMHelper.setNodeText(newNode, content);
					
				}
	
			}
			else { // si no esta definido
				

				if ( lastElem.getType() == Type.field ) { // si es de tipo field
					
					// agrega un nuevo nodo al padre (anteultimo elemento), de tipo field, con el mismo nombre y con el valor deseado
					Node newNode = MedatadaDOMHelper.addChildElementWithNameAttr(parentNode, Type.field.toString(), lastElem.getName());
					MedatadaDOMHelper.setNodeText(newNode, content);
				
				}
				else { // si no es de tipo field es de tipo element, entonces
					
					// agrega un nuevo nodo hijo al anteultimo nodo, de tipo element, usando el nombre del ultimo elemento
					Node newElementNode = MedatadaDOMHelper.addChildElementWithNameAttr(parentNode, Type.element.toString(), lastElem.getName());
				
					// a ese nuevo nodo element le agrega un nuevo nodo hijo, de tipo field, con nombre value y el contenido
					Node newFieldNode = MedatadaDOMHelper.addChildElementWithNameAttr(newElementNode, Type.field.toString(), "value");
					MedatadaDOMHelper.setNodeText(newFieldNode, content);
					
				}
				
				
				/**
				 * Nota: Se puede resumir este codigo juntando casos y puede quedar más corto, pero prefiero dejar los casos 
				 * separados para facilitar el debug.
				 */
			}
			

		
		} catch (DOMException e) {
			logger.error("Error en agregador de metadato:" +fieldName);
			e.printStackTrace();
		} 
		
		catch (TransformerException e) {
			logger.error("Error en agregador de metadato:" +fieldName);
			e.printStackTrace();
		}
	}
	
	
	public String getFieldPrefixedContent(String fieldname, String prefix) {

		String name = "UNKNOWN";

		for (Node node : getFieldNodes(fieldname)) {

			String occr = node.getFirstChild().getNodeValue();

			if (occr.startsWith(prefix))
				name = occr.substring(prefix.length()).trim();
		}

		return name;
	}

	

	
	public List<Node> getFieldNodes(String fieldName) {
		

		try {

			return MedatadaDOMHelper.getListOfNodes(DOMDocument, XOAIXPATHHelper.getXPATH(fieldName) );

		} catch (Exception e) {
			// TODO: mejorar el tratamiento de esto
			e.printStackTrace();
			return new ArrayList<Node>(0);
		}
	}

	
	public List<OAIMetadataBitstream> getBitstreams() {
		
		List<OAIMetadataBitstream> bundles = new ArrayList<OAIMetadataBitstream>();
		
		try {
			
			List<Node> bundleNodes = MedatadaDOMHelper.getListOfNodes(
					DOMDocument, XOAIXPATHHelper.getXPATH("bundles.bundle", false, true) 
			);
			
			
			for (int i=0; i<bundleNodes.size(); i++ ) {
				
				
				Node bundleNode = bundleNodes.get(i);
				
				
				Document bundleDoc = MedatadaDOMHelper.createDocumentFromNode(bundleNode);
				
				//System.out.println( MedatadaDOMHelper.Node2XMLString(bundleDoc) );
				
				List<Node> bitstreamNodes = MedatadaDOMHelper.getListOfNodes(
						bundleDoc, XOAIXPATHHelper.getXPATH("bundle.bitstreams.bitstream", false, false)) ;
				
				
				String type = MedatadaDOMHelper.getSingleString(bundleDoc, XOAIXPATHHelper.getXPATH("bundle:name", true, false) );
				
				
				for (Node bitstreamNode : bitstreamNodes ) {
					
					OAIMetadataBitstream bitstream = new OAIMetadataBitstream();
					bitstream.setType(type);
					
					for ( int j = 0; j < bitstreamNode.getChildNodes().getLength(); j++ ) {
				
						Node propertyNode = bitstreamNode.getChildNodes().item(j);
						
						if ( propertyNode.getAttributes() != null && propertyNode.getAttributes().getLength() > 0 
								&& propertyNode.getAttributes().getNamedItem("name") != null ) {
						
							switch ( propertyNode.getAttributes().getNamedItem("name").getTextContent() ) {
								
								case "name":
									bitstream.setName( propertyNode.getFirstChild().getTextContent() );
									break;
									
								case "url":
									bitstream.setUrl(new URI(URLDecoder.decode(propertyNode.getFirstChild().getTextContent(), "UTF-8")).toURL().toString());
									break;
									
								case "size":
									bitstream.setSize( propertyNode.getFirstChild().getTextContent() );
									break;
								
								case "format":
									bitstream.setFormat( propertyNode.getFirstChild().getTextContent() );
									break;
									
								case "checksum":
									bitstream.setChecksum( propertyNode.getFirstChild().getTextContent() );
									break;
								
								case "sid":
									bitstream.setSid( Integer.getInteger( propertyNode.getFirstChild().getTextContent() ) );
									if ( bitstream.getSid() == null ) bitstream.setSid(10*i+j); 
									break;
								
								
								default:
									break;
							}
						}
					}
					
					bundles.add(bitstream);
					
				}
			}
			
		} catch (Exception e) {
			
			logger.debug( "Problemas en getBundles :: " + e.getMessage());
		}
		
		
		logger.debug("bundles " + bundles.toString());
		
		return bundles;
	}
	

	@Override
	public String toString() {
			return MedatadaDOMHelper.document2XMLString(this.DOMDocument);
		
	}

	public class OAIRecordMetadataParseException extends Exception {

	
		private static final long serialVersionUID = 2279626648050333938L;

		public OAIRecordMetadataParseException() {
			super();
		}

		public OAIRecordMetadataParseException(String message, Throwable cause) {
			super(message, cause);
		}

		public OAIRecordMetadataParseException(String message) {
			super(message);
		}

		public OAIRecordMetadataParseException(Throwable cause) {
			super(cause);
		}

	}

}
