import { useState, useEffect } from 'react';
import AnalizView from './AnalizView';
import AnalysisService, { type AnalysisData } from '../../services/analiz.service';

type TimeRangeType = '7gun' | '30gun' | '3ay' | '6ay' | '12ay' | 'tumzaman';

const Analiz: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeType>('12ay');

  // Analiz verilerini çek
  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AnalysisService.getAnalysisData(selectedTimeRange);
        console.log('Container - Alınan veri:', { 
          toplamTestSayisi: data.stats.toplamTestSayisi,
          toplamGelir: data.stats.toplamGelir,
          gelirType: typeof data.stats.toplamGelir 
        });
        setAnalysisData(data);
      } catch (error) {
        console.error('Analiz verileri yüklenirken hata:', error);
        setError('Analiz verileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [selectedTimeRange]);

  // Tarih aralığı değiştiğinde
  const handleTimeRangeChange = (range: TimeRangeType) => {
    setSelectedTimeRange(range);
  };

  return <AnalizView 
    analysisData={analysisData} 
    loading={loading} 
    error={error} 
    selectedTimeRange={selectedTimeRange}
    onTimeRangeChange={handleTimeRangeChange}
  />;
};

export default Analiz;