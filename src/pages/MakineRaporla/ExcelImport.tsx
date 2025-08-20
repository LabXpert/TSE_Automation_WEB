import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

interface ExcelImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

const ExcelImport: React.FC<ExcelImportProps> = ({ isOpen, onClose, onImport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isExcelFile(droppedFile)) {
        setFile(droppedFile);
      } else {
        alert('Lütfen sadece Excel dosyası (.xlsx, .xls) seçin!');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isExcelFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        alert('Lütfen sadece Excel dosyası (.xlsx, .xls) seçin!');
      }
    }
  };

  const isExcelFile = (file: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    return validTypes.includes(file.type) || 
           file.name.toLowerCase().endsWith('.xlsx') || 
           file.name.toLowerCase().endsWith('.xls');
  };

  const processExcelFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // İlk satır başlıkları al, kalan satırları veri olarak işle
      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1) as any[][];
      
      const processedData = rows
        .filter(row => row.some(cell => cell !== undefined && cell !== ''))
        .map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });

      onImport(processedData);
      onClose();
      setFile(null);
    } catch (error) {
      console.error('Excel dosyası işlenirken hata:', error);
      alert('Excel dosyası işlenirken bir hata oluştu!');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '32px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#0f172a',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            Excel Dosyası İçe Aktar
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            ×
          </button>
        </div>

        {/* File Drop Area */}
        <div
          style={{
            border: `2px dashed ${dragActive ? '#dc2626' : file ? '#059669' : '#d1d5db'}`,
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: dragActive ? '#fef2f2' : file ? '#f0fdf4' : '#f9fafb',
            transition: 'all 0.3s ease',
            marginBottom: '24px'
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#059669" style={{ marginBottom: '16px' }}>
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                <path d="M9,18L7,16L12,11L17,16L15,18L13,16V20H11V16L9,18Z"/>
              </svg>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#059669',
                margin: '0 0 8px 0'
              }}>
                Dosya Seçildi
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#374151',
                margin: '0 0 16px 0'
              }}>
                {file.name}
              </p>
              <button
                onClick={removeFile}
                style={{
                  padding: '8px 16px',
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e5e7eb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                Dosyayı Kaldır
              </button>
            </div>
          ) : (
            <div>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#9ca3af" style={{ marginBottom: '16px' }}>
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                <path d="M12,13L8,9H10.5V5H13.5V9H16L12,13Z"/>
              </svg>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 8px 0'
              }}>
                Excel dosyasını buraya sürükleyin
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 16px 0'
              }}>
                veya dosya seçmek için tıklayın
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '12px 24px',
                  background: '#dc2626',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
              >
                Dosya Seç
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '24px'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#0369a1',
            fontWeight: '600',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
            </svg>
            Desteklenen Formatlar
          </div>
          <p style={{
            fontSize: '13px',
            color: '#0369a1',
            margin: 0
          }}>
            • Excel dosyaları (.xlsx, .xls)<br/>
            • İlk satır başlık olarak kullanılacak<br/>
            • Boş satırlar otomatik atlanacak
          </p>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            İptal
          </button>
          
          <button
            onClick={processExcelFile}
            disabled={!file || isProcessing}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: (!file || isProcessing) ? '#d1d5db' : '#dc2626',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffffff',
              cursor: (!file || isProcessing) ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!(!file || isProcessing)) {
                e.currentTarget.style.background = '#b91c1c';
              }
            }}
            onMouseLeave={(e) => {
              if (!(!file || isProcessing)) {
                e.currentTarget.style.background = '#dc2626';
              }
            }}
          >
            {isProcessing ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{
                  animation: 'spin 1s linear infinite'
                }}>
                  <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                </svg>
                İşleniyor...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,13L8,9H10.5V5H13.5V9H16L12,13Z"/>
                </svg>
                İçe Aktar
              </>
            )}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ExcelImport;
