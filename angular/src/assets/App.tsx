import { useState, useEffect } from 'react';

import { BarChart } from './components/bar-chart/BarChart';

import { Loading } from './components/loading/Loading';
import style from './styles/app.module.css';
import widgetPrevImage from './assets/widget-preview.png'
import axios from 'axios';
import { Stadistics } from './interfaces/stadistics.interface';
import { baseUrl } from './api/api';



function App() {

  const embbedFunction = 'lrhw';
  const widgetParams = (window as any)[embbedFunction];
  const preview: boolean = widgetParams && widgetParams.preview !== false ? true : false;
  const sourceId = widgetParams && widgetParams.repository_source || 'SITEID::2'

  const [data, setData] = useState<Stadistics>();
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(false)
  

  const [timeUnit, setTimeUnit] = useState('week');
  const [previewImage, setPreviewImage] = useState(preview);

  const fetchData = async () => { 

    const params = {
      source: sourceId,
      start_date: 'now-20y',
      end_date: 'now',
      time_unit: timeUnit
    };
    

    if(previewImage === true) return;
    setIsLoading(true);
      
    axios({
      method: 'GET',
      url: baseUrl,
      params: params,
    }).then(response => {
      if(response.data.level){
        setData(response.data);
        console.log('se lanzo el fetch'); 
      } else {
        console.log('error del source');
        setError(true);
      }
    setIsLoading(false);
    }).catch(error => {
      console.log(error);
      setError(true);
    });
  
  }
    
  useEffect(() => {
    fetchData();
  }, [ timeUnit, previewImage, sourceId ]);


  const handleChangeTimeUnit = (timeUnitType: string) => {
    setTimeUnit(
      timeUnitType === 'day' 
      ? 'day' 
      : timeUnitType === 'month' 
      ? 'month' 
      : 'week');
  };

  const isButtonActive = (buttonTimeUnit: string) => {
    return timeUnit === buttonTimeUnit 
      ? style.buttonActive 
      : '';
  };


  return (
    <>
    {
      sourceId
    }

    { !error ? <div className={style.container}>
      { previewImage ? 
      <div className={style.container} 
        style={{display:'flex', justifyContent:'center', alignContent:'center'}}>
        <img
          className={style.preview_img} 
          onClick={() => setPreviewImage(false)} 
          src={widgetPrevImage} alt="" 
        />
      </div>
      :
      <>
       <div>
        <button 
          onClick={() =>handleChangeTimeUnit('day')} 
          className={`${isButtonActive('day')} ${style.timeUnitButton}`}>
            Day
        </button>

        <button 
          onClick={() =>handleChangeTimeUnit('week')} 
          className={`${isButtonActive('week')} ${style.timeUnitButton}`}>
            Week
        </button>

        <button 
          onClick={() =>handleChangeTimeUnit('month')} 
          className={`${isButtonActive('month')} ${style.timeUnitButton}`}>
            Month
        </button>

      </div>
        { isLoading || !data  ? <Loading/> : <BarChart data={data}/> }
      </>
    }
    </div> : <div><h1>No se encontraron datos</h1></div>} 
    </>
  );
}

export default App;