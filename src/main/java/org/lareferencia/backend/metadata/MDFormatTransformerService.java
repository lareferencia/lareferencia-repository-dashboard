package org.lareferencia.backend.metadata;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.w3c.dom.Document;

public class MDFormatTransformerService {

	HashMap<String, HashMap<String, IMDFormatTransformer>> trfMap; 

	public MDFormatTransformerService() {	
		trfMap = new HashMap<String, HashMap<String, IMDFormatTransformer>>();		
	}

	public void setTransformers(List<IMDFormatTransformer> transformers) {

		// builds a multidimensional map with [sourceMDF][targetMDF] as keys
		for (IMDFormatTransformer trf : transformers ) {

			if (!trfMap.containsKey(trf.getSourceMDFormat())) {
				trfMap.put(trf.getSourceMDFormat(), new HashMap<String, IMDFormatTransformer>());
			}
			trfMap.get(trf.getSourceMDFormat()).put(trf.getTargetMDFormat(), trf);

		}
	}

	public List<String> getSourceMetadataFormats() {
		return new ArrayList<String>( trfMap.keySet() );
	}


	public Document transform(String srcMDFormat, String tgtMDFormat, Document source) throws MDFormatTranformationException {
		return this.getMDTransformer(srcMDFormat, tgtMDFormat).transform(source) ;
	}

	public String   transformToString(String srcMDFormat, String tgtMDFormat, Document source) throws MDFormatTranformationException {
		return this.getMDTransformer(srcMDFormat, tgtMDFormat).transformToString(source);
	}

	public IMDFormatTransformer getMDTransformer(String srcMDFormat, String tgtMDFormat) throws MDFormatTranformationException {
		try {

			IMDFormatTransformer trf = trfMap.get(srcMDFormat).get(tgtMDFormat);

			if (trf == null)
				throw new MDFormatTranformationException("No existe transformador de formatos: " + srcMDFormat + " a " + tgtMDFormat + " declarado en el servicios de transformación de formato de metadatos." );
			return trf;
		} catch (NullPointerException e) {
			throw new MDFormatTranformationException("No existe transformador de formatos: " + srcMDFormat + " a " + tgtMDFormat + " declarado en el servicios de transformación de formato de metadatos." );
		}
	}




}
